import { ethers, Signer } from 'ethers';

// Smart Contract ABI (Application Binary Interface)
const scrollessABI = [
  "event Staked(address indexed user, uint256 amount, uint256 totalDays, uint256 duration)",
  "event ProofSubmitted(address user, uint256 day, bool success) external onlyOwner",
  "function stake(uint256 totalDays, uint256 duration) external payable",
  "function claimRewards() external",
  "function redistributePenalties(address[] calldata winners) external onlyOwner",
  "function withdraw() external",
  "function deposit() external payable",
  "function owner() external view returns (address)",
  "function penaltyPool() external view returns (uint256)",
  "function stakes(address) external view returns (uint256, uint256, uint256, uint256, uint256, bool)",
  "function proofs(address, uint256) external view returns (bool)",
  "function pendingWithdrawals(address) external view returns (uint256)",
];

const contractAddress = '0xb5cf29f539cf21e9cad207aaecf2722abc9e1928'; 

// Chain details
const chainId = 420420421;
const rpcUrl = 'https://westend-asset-hub-eth-rpc.polkadot.io';

// Helper function to get the contract instance
const getContract = (signer: Signer) => {
  return new ethers.Contract(contractAddress, scrollessABI, signer);
};

export interface StakeParams {
  amount: number;
  duration: number;
  limit: number; // This should be totalDays
}

/**
 * Stakes DOT to the contract.
 * @param signer - The Signer object from ethers.js, representing the user's wallet.
 * @param {StakeParams} params - The stake parameters.
 * @returns A Promise that resolves when the transaction is mined (or rejects on error).
 */
export async function stakeDOT(signer: Signer, { amount, duration, limit: totalDays }: StakeParams): Promise<void> {
  const contract = getContract(signer);
  const amountInWei = ethers.parseEther(amount.toString()); // Convert DOT to Wei
  // Calculate the duration in seconds.
  const calculatedDuration = totalDays * 24 * 60 * 60; // totalDays * seconds_per_day

  // Make sure provided duration is at least the calculated duration, or use calculatedDuration if provided duration is too short
  const actualDuration = Math.max(duration, calculatedDuration);

  try {
    const tx = await contract.stake(totalDays, actualDuration, { value: amountInWei });
    await tx.wait(); // Wait for the transaction to be mined
    console.log('Stake successful!');
  } catch (error: any) {
    console.error('Stake failed:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

/**
 * Gets the DOT balance of the user's wallet.  This is NOT the staked amount, but the total DOT in the wallet.
 * @param signer - The Signer object from ethers.js.
 * @returns A Promise that resolves with the user's DOT balance as a number.
 */
export async function getBalance(signer: Signer): Promise<number> {
  const address = await signer.getAddress();
  const balanceInWei = await signer.provider.getBalance(address);
  const balanceInDOT = Number(ethers.formatEther(balanceInWei)); // Convert Wei to DOT
  return balanceInDOT;
}

/**
 * Gets the stake information for a given user.
 * @param signer - The Signer object from ethers.js.
 * @param userAddress - The address of the user.
 * @returns A Promise that resolves with the stake information.
 */
export async function getStakeInfo(signer: Signer, userAddress: string): Promise<StakeInfo> {
    const contract = getContract(signer);
    try {
        const stakeInfo = await contract.stakes(userAddress);
        return {
            amount: Number(ethers.formatEther(stakeInfo.amount)), // Convert from Wei
            startTime: Number(stakeInfo.startTime),
            duration: Number(stakeInfo.duration),
            totalDays: Number(stakeInfo.totalDays),
            successDays: Number(stakeInfo.successDays),
            claimed: stakeInfo.claimed,
        };
    } catch (error: any) {
        console.error("Failed to get stake info:", error);
        throw error;
    }
}

/**
 * Submits a proof for a given user and day (owner only).
 * @param signer - The Signer object from ethers.js (must be the owner).
 * @param userAddress - The address of the user.
 * @param day - The day of the proof.
 * @param success - Whether the proof was successful.
 */
export async function submitProof(signer: Signer, userAddress: string, day: number, success: boolean): Promise<void> {
  const contract = getContract(signer);
  try {
    const tx = await contract.submitProof(userAddress, day, success);
    await tx.wait();
    console.log(`Proof submitted for ${userAddress} on day ${day}: ${success}`);
  } catch (error: any) {
    console.error('Failed to submit proof:', error);
    throw error;
  }
}

/**
 * Claims rewards for the caller.
 * @param signer - The Signer object from ethers.js.
 */
export async function claimRewards(signer: Signer): Promise<void> {
  const contract = getContract(signer);
  try {
    const tx = await contract.claimRewards();
    await tx.wait();
    console.log('Rewards claimed!');
  } catch (error: any) {
    console.error('Failed to claim rewards:', error);
    throw error;
  }
}

/**
 * Redistributes penalties to winners (owner only).
 * @param signer - The Signer object from ethers.js (must be the owner).
 * @param winners - An array of addresses of the winners.
 */
export async function redistributePenalties(signer: Signer, winners: string[]): Promise<void> {
  const contract = getContract(signer);
  try {
    const tx = await contract.redistributePenalties(winners);
    await tx.wait();
    console.log('Penalties redistributed to:', winners);
  } catch (error: any) {
    console.error('Failed to redistribute penalties:', error);
    throw error;
  }
}

/**
 * Withdraws the caller's pending withdrawals.
 * @param signer - The Signer object from ethers.js.
 */
export async function withdraw(signer: Signer): Promise<void> {
  const contract = getContract(signer);
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    console.log('Withdrawal successful!');
  } catch (error: any) {
    console.error('Failed to withdraw:', error);
    throw error;
  }
}

/**
  * Deposits DOT into the penalty pool.
  * @param signer - The Signer object
  * @param amount - The amount of DOT to deposit
  */
export async function deposit(signer: Signer, amount: number): Promise<void> {
    const contract = getContract(signer);
    const amountInWei = ethers.parseEther(amount.toString());
    try {
        const tx = await contract.deposit({ value: amountInWei });
        await tx.wait();
        console.log(`Successfully deposited ${amount} DOT into penalty pool`);
    } catch (error) {
        console.error("Deposit failed", error);
        throw error;
    }
}

/**
 * Gets the owner of the contract.
 * @param signer - The Signer object from ethers.js.
 * @returns A Promise that resolves with the owner's address.
 */
export async function getOwner(signer: Signer): Promise<string> {
  const contract = getContract(signer);
  try {
    const owner = await contract.owner();
    return owner;
  } catch (error: any) {
    console.error('Failed to get owner:', error);
    throw error;
  }
}

/**
 * Gets the current balance of the penalty pool.
 * @param signer - The Signer object from ethers.js.
 * @returns A Promise that resolves with the penalty pool balance as a number.
 */
export async function getPenaltyPool(signer: Signer): Promise<number> {
  const contract = getContract(signer);
  try {
    const poolInWei = await contract.penaltyPool();
    const poolInDOT = Number(ethers.formatEther(poolInWei));
    return poolInDOT;
  } catch (error: any) {
    console.error('Failed to get penalty pool:', error);
    throw error;
  }
}

/**
 * Gets stake information for a user.
 * @param signer - ethers.js signer
 * @param userAddress - address of user
 */
export async function getStakeInformation(signer: Signer, userAddress: string): Promise<StakeInfo> {
    const contract = getContract(signer);
    try {
        const stakeData = await contract.stakes(userAddress);
        const stakeInfo: StakeInfo = {
            amount: Number(ethers.formatEther(stakeData.amount)),
            startTime: Number(stakeData.startTime),
            duration: Number(stakeData.duration),
            totalDays: Number(stakeData.totalDays),
            successDays: Number(stakeData.successDays),
            claimed: stakeData.claimed,
        };
        return stakeInfo;
    } catch (error) {
        console.error("Failed to get stake information", error);
        throw error;
    }
}

/**
 * Gets proof status for a user and day.
 * @param signer - ethers.js signer
 * @param userAddress - address of user
 * @param day - the day
 * @returns boolean indicating whether a proof exists
 */
export async function getProof(signer: Signer, userAddress: string, day: number): Promise<boolean> {
    const contract = getContract(signer);
    try {
        const proof = await contract.proofs(userAddress, day);
        return proof;
    } catch (error) {
        console.error("Failed to get proof", error);
        throw error;
    }
}

/**
* Gets pending withdrawals for a user
* @param signer - ethers.js signer
* @param userAddress - address of user
* @returns amount pending withdrawal
*/
export async function getPendingWithdrawals(signer: Signer, userAddress: string): Promise<number> {
    const contract = getContract(signer);
    try {
        const withdrawalsWei = await contract.pendingWithdrawals(userAddress);
        const withdrawalsDot = Number(ethers.formatEther(withdrawalsWei));
        return withdrawalsDot;
    } catch (error) {
        console.error("Failed to get pending withdrawals", error);
        throw error;
    }
}

export interface StakeInfo {
  amount: number;
  startTime: number;
  duration: number;
  totalDays: number;
  successDays: number;
  claimed: boolean;
}
