"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Upload, X, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PageTransition from "@/components/layout/page-transition"
import { motion } from "framer-motion"
import Tesseract from 'tesseract.js'; // Import Tesseract.js  (Install: npm install tesseract.js)

interface ProofPageProps {
    onSubmitProof?: (data: { image: File | null; description: string; date: string; ocrText?: string }) => Promise<void>
}

export default function ProofPage({ onSubmitProof }: ProofPageProps) {
    const router = useRouter()
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [isLoading, setIsLoading] = useState(false)
    const [ocrText, setOcrText] = useState<string | undefined>()  // State to store OCR text
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrError, setOcrError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // useEffect to run OCR when image changes
    useEffect(() => {
        const runOCR = async (file: File) => {
            setOcrLoading(true);
            setOcrError(null);
            try {
                if (typeof window === 'undefined' || !Tesseract) {
                    throw new Error("Tesseract.js is not available.  Ensure it is correctly installed and imported.");
                }

                // Perform OCR using Tesseract.js
                const result = await Tesseract.recognize(file, 'eng', {
                    logger: (info) => console.log(info), // Optional: Log OCR progress
                });

                if (result.data?.text) {
                    setOcrText(result.data.text);
                } else {
                    setOcrText("No text detected");
                }



            } catch (err: any) {
                setOcrError(err.message || "OCR processing failed.");
                setOcrText(undefined); // Clear any previous text
            } finally {
                setOcrLoading(false);
            }
        };

        if (image) {
            runOCR(image);
        } else {
            setOcrText(undefined);
        }
    }, [image]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            // Create preview
            const reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImage(null)
        setImagePreview(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            // Check if OCR detected social media usage
            const isSocialMedia = ocrText && (
                ocrText.toLowerCase().includes("whatsapp") ||
                ocrText.toLowerCase().includes("instagram") ||
                ocrText.toLowerCase().includes("facebook")
            );

            if (!isSocialMedia) {
                alert("Proof must be a screenshot or photo of social media app usage (WhatsApp, Instagram, Facebook)."); // Replace with a better UI notification
                setIsLoading(false);
                return; // Stop submission
            }

            if (onSubmitProof) {
                await onSubmitProof({ image, description, date, ocrText })
            } else {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500))
                console.log("Proof submitted:", { image, description, date, ocrText })
            }
            // Navigate back to dashboard on success
            router.push("/dashboard")
        } catch (error: any) {
            console.error("Failed to submit proof:", error)
            // Show error toast here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageTransition>
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Submit Proof</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Screenshot or Photo</label>
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="proof-image"
                                    ref={inputRef}
                                />
                                <label htmlFor="proof-image" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-500">Click to upload</span>
                                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                                </label>
                            </div>
                        ) : (
                            <Card className="relative overflow-hidden">
                                <motion.button
                                    type="button"
                                    className="absolute top-2 right-2 bg-slate-800 bg-opacity-70 rounded-full p-1 text-white"
                                    onClick={removeImage}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Proof preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </Card>
                        )}
                        {ocrLoading && <p className="text-sm text-slate-500 mt-2">Detecting text...</p>}
                        {ocrError && (
                            <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                {ocrError}
                            </div>
                        )}
                        {ocrText && (
                            <div className="mt-2 p-2 bg-slate-100 rounded-md border border-slate-200">
                                <p className="text-sm font-medium text-slate-700">Detected Text:</p>
                                <p className="text-sm text-slate-600 break-words">{ocrText}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Describe your achievement today..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading || !description || ocrLoading}>
                        {isLoading ? "Submitting..." : "Submit Proof"}
                    </Button>
                </form>
            </div>
        </PageTransition>
    )
}
