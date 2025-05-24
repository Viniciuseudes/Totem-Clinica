"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, User, Stethoscope, CreditCard, Calendar, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FormData {
  cpf: string
  gender: string
  professional: string
  hasPlan: string
  frequency: string
}

interface QuestionnaireFormProps {
  onSubmit: (data: FormData) => void
  initialData: FormData
}

export function QuestionnaireForm({ onSubmit, initialData }: QuestionnaireFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (currentStep === 1) {
      if (!formData.cpf) {
        newErrors.cpf = "CPF é obrigatório"
      } else if (!/^\d{11}$/.test(formData.cpf)) {
        newErrors.cpf = "CPF deve conter 11 dígitos"
      }

      if (!formData.gender) {
        newErrors.gender = "Selecione o sexo"
      }
    } else if (currentStep === 2) {
      if (!formData.professional) {
        newErrors.professional = "Selecione o profissional"
      }

      if (!formData.hasPlan) {
        newErrors.hasPlan = "Informe se possui plano"
      }

      if (!formData.frequency) {
        newErrors.frequency = "Selecione a frequência"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(2)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const formatCPF = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "")
    // Limit to 11 digits
    return digits.slice(0, 11)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-100">
      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white">
        <h2 className="text-lg font-bold text-center">Questionário</h2>
        <p className="text-center text-xs opacity-90">Responda e ganhe seu brinde!</p>
      </div>

      <div className="p-2 flex-grow flex flex-col">
        <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
          {/* Progress indicator - reduzido */}
          <div className="mb-1">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Etapa {currentStep} de 2</span>
              <span className="text-xs font-medium text-gray-500">{currentStep === 1 ? "50%" : "100%"} concluído</span>
            </div>
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-700"
                initial={{ width: currentStep === 1 ? "0%" : "50%" }}
                animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow flex flex-col justify-between"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1">
                    <div className="p-1.5 bg-purple-100 rounded-full mr-2">
                      <User className="h-3 w-3 text-purple-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Seus Dados</h3>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="cpf" className="text-xs">
                        CPF
                      </Label>
                      <Input
                        id="cpf"
                        type="text"
                        inputMode="numeric"
                        placeholder="Digite seu CPF (apenas números)"
                        value={formData.cpf}
                        onChange={(e) => updateField("cpf", formatCPF(e.target.value))}
                        className={`text-xs py-1 h-8 ${errors.cpf ? "border-red-500" : ""}`}
                      />
                      {errors.cpf && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 font-medium"
                        >
                          {errors.cpf}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs">Sexo</Label>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {[
                          { value: "masculino", label: "Masculino" },
                          { value: "feminino", label: "Feminino" },
                          { value: "outro", label: "Outro" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center justify-center p-1 rounded-md border transition-all cursor-pointer text-center ${
                              formData.gender === option.value
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 hover:border-orange-200"
                            }`}
                            onClick={() => updateField("gender", option.value)}
                          >
                            <span className="text-xs">{option.label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.gender && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 font-medium mt-1"
                        >
                          {errors.gender}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-lg shadow-md group h-9"
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow flex flex-col justify-between"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1">
                    <div className="p-1.5 bg-blue-100 rounded-full mr-2">
                      <Stethoscope className="h-3 w-3 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Informações da Consulta</h3>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="professional" className="text-xs">
                        Qual profissional você veio consultar?
                      </Label>
                      <Select
                        value={formData.professional}
                        onValueChange={(value) => updateField("professional", value)}
                      >
                        <SelectTrigger className={`text-xs py-1 h-8 ${errors.professional ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Selecione o profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-silva">Dr. Silva - Clínico Geral</SelectItem>
                          <SelectItem value="dra-santos">Dra. Santos - Cardiologista</SelectItem>
                          <SelectItem value="dr-oliveira">Dr. Oliveira - Ortopedista</SelectItem>
                          <SelectItem value="dra-costa">Dra. Costa - Dermatologista</SelectItem>
                          <SelectItem value="dr-pereira">Dr. Pereira - Neurologista</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.professional && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 font-medium"
                        >
                          {errors.professional}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-1">
                        <CreditCard className="h-3 w-3 text-blue-600 mr-1" />
                        <Label className="text-xs">Você possui plano de saúde?</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { value: "sim", label: "Sim" },
                          { value: "nao", label: "Não" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center justify-center p-1 rounded-md border transition-all cursor-pointer ${
                              formData.hasPlan === option.value
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-blue-200"
                            }`}
                            onClick={() => updateField("hasPlan", option.value)}
                          >
                            <span className="text-xs">{option.label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.hasPlan && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 font-medium mt-1"
                        >
                          {errors.hasPlan}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 text-blue-600 mr-1" />
                        <Label htmlFor="frequency" className="text-xs">
                          Com que frequência você consulta este profissional?
                        </Label>
                      </div>
                      <Select value={formData.frequency} onValueChange={(value) => updateField("frequency", value)}>
                        <SelectTrigger className={`text-xs py-1 h-8 ${errors.frequency ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primeira-vez">Primeira vez</SelectItem>
                          <SelectItem value="mensal">Mensalmente</SelectItem>
                          <SelectItem value="trimestral">A cada 3 meses</SelectItem>
                          <SelectItem value="semestral">A cada 6 meses</SelectItem>
                          <SelectItem value="anual">Anualmente</SelectItem>
                          <SelectItem value="raramente">Raramente</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.frequency && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 font-medium"
                        >
                          {errors.frequency}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      variant="outline"
                      className="w-full py-2 text-sm group h-9"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                      Voltar
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      type="submit"
                      className="w-full py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-lg shadow-md h-9"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Finalizar"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
