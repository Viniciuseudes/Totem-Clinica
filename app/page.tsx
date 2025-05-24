"use client"

import { useState, useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { ThankYouScreen } from "@/components/thank-you-screen"
import { TotemFrame } from "@/components/totem-frame"
import { saveToGoogleSheets } from "./actions"

export default function Home() {
  const [step, setStep] = useState<"welcome" | "form" | "thank-you">("welcome")
  const [formData, setFormData] = useState({
    cpf: "",
    gender: "",
    professional: "",
    hasPlan: "",
    frequency: "",
  })
  const [inactive, setInactive] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  // Reset to welcome screen after inactivity (3 minutes)
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      setInactive(false)
      inactivityTimer = setTimeout(
        () => {
          setInactive(true)
          setStep("welcome")
          setFormData({
            cpf: "",
            gender: "",
            professional: "",
            hasPlan: "",
            frequency: "",
          })
        },
        3 * 60 * 1000,
      ) // 3 minutes
    }

    resetTimer()

    // Add event listeners to reset the timer on user activity
    const events = ["mousedown", "touchstart", "keydown"]
    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    return () => {
      clearTimeout(inactivityTimer)
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [])

  const handleStart = () => {
    setStep("form")
  }

  const handleSubmit = async (data: typeof formData) => {
    setFormData(data)
    setSaveStatus("saving")

    try {
      // Salvar dados no Google Sheets
      const result = await saveToGoogleSheets(data)

      if (result.success) {
        setSaveStatus("success")
      } else {
        console.error("Erro ao salvar:", result.error)
        setSaveStatus("error")
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      setSaveStatus("error")
    }

    setStep("thank-you")
  }

  const handleReset = () => {
    setFormData({
      cpf: "",
      gender: "",
      professional: "",
      hasPlan: "",
      frequency: "",
    })
    setSaveStatus("idle")
    setStep("welcome")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-gradient-to-b from-orange-600 to-orange-900 overflow-hidden">
      <TotemFrame className="h-[95vh]">
        {step === "welcome" && <WelcomeScreen onStart={handleStart} />}
        {step === "form" && <QuestionnaireForm onSubmit={handleSubmit} initialData={formData} />}
        {step === "thank-you" && <ThankYouScreen onReset={handleReset} saveStatus={saveStatus} />}
      </TotemFrame>
    </main>
  )
}
