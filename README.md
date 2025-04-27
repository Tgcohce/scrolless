# Scrolless

<div align="center">
  <img src="public/icon-512x512.png" alt="Scrolless Logo" width="120" />
  <h3>Stake DOT. Scroll Less. Earn More.</h3>
  <p>A mobile-first PWA that rewards users for reducing screen time</p>
  
  ![License](https://img.shields.io/github/license/tgcohce/scrolless)
  ![React](https://img.shields.io/badge/React-18-blue)
  ![Next.js](https://img.shields.io/badge/Next.js-14-black)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
</div>

#### Quick Note: Currently Scrolless is in beta (on assethub testnet) and staking mechanism is only available to WND tokens.

## 📱 About Scrolless

Scrolless is an innovative mobile application that incentivizes digital wellbeing by rewarding users for reducing their screen time. Users stake DOT tokens and commit to daily screen time limits. If they meet their goals, they earn rewards; if not, their stake goes to the community pool.

### The Problem

In today's hyper-connected world, excessive screen time has become a significant issue affecting mental health, productivity, and overall wellbeing. Traditional screen time management apps rely solely on willpower, which often isn't enough.

### Our Solution

Scrolless introduces a financial incentive layer to digital wellbeing. By staking cryptocurrency and proving reduced screen time, users have a tangible reason to put down their phones and engage with the real world.

## ✨ Features

- **Stake DOT**: Lock your tokens as a commitment to reducing screen time
- **Daily Challenges**: Set daily screen time limits that work for you
- **Proof Submission**: Submit daily screenshots of your screen time stats
- **Reward System**: Earn rewards for successfully meeting your goals
- **Progress Tracking**: Monitor your digital wellbeing journey
- **Blockchain Integration**: Transparent and trustless reward distribution

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **Blockchain**: Polkadot/Substrate (DOT)
- **Wallet Integration**: Ethereum-compatible wallets (MetaMask, etc.)
- **PWA Support**: Full offline capabilities and mobile installation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or another Ethereum-compatible wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tgcohce/scrolless.git
   cd scrolless
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_RPC_URL=your_rpc_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📖 How to Use

1. **Connect Wallet**: Connect your MetaMask or other Ethereum-compatible wallet
2. **Stake DOT**: Choose an amount to stake and set your daily screen time limit
3. **Track Usage**: Use your device normally, but be mindful of your screen time
4. **Submit Proof**: At the end of each day, submit a screenshot of your screen time stats
5. **Earn Rewards**: Successfully meet your goals to earn rewards from the pool

## 🎨 Color Palette

Scrolless uses a custom color palette:

- Light Cyan: `#c9f4fa`
- Cyan: `#7fe5f0`
- Dark Brown/Purple: `#513b41`
- Bright Red: `#f83839`
- Pink/Magenta: `#E6007A`

## 📁 Project Structure

```
scrolless/
├── app/                  # Next.js app directory
│   ├── dashboard/        # Dashboard page
│   ├── proof/            # Proof submission page
│   ├── rewards/          # Rewards page
│   ├── stake/            # Staking page
│   ├── client-layout.tsx # Client-side layout component
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── manifest.ts       # PWA manifest
│   └── page.tsx          # Welcome page
├── components/           # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── blockchain.ts     # Blockchain interactions
│   ├── hooks.ts          # Custom React hooks
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

### Development Guidelines

- Follow the existing code style and organization
- Write clean, maintainable, and testable code
- Update documentation for any new features
- Add appropriate comments for complex logic
- Test thoroughly before submitting PRs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] Multi-wallet support (WalletConnect, Coinbase Wallet)
- [ ] Network switching capabilities
- [ ] Transaction history page
- [ ] Enhanced analytics and insights
- [ ] Social features and challenges
- [ ] Integration with health apps for additional metrics
- [ ] Mobile app versions (iOS/Android)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Ethers.js](https://docs.ethers.org/)
- [Polkadot](https://polkadot.com/)

---

<div align="center">
  <p>Built with ❤️ by Tolga</p>
</div>
