import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SetupInstructions() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuração necessária</AlertTitle>
      <AlertDescription className="text-sm mt-2">
        <p className="mb-2">
          Para usar a integração com o Google Sheets, você precisa configurar as seguintes variáveis de ambiente:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>GOOGLE_SERVICE_ACCOUNT_EMAIL - Email da conta de serviço do Google</li>
          <li>GOOGLE_PRIVATE_KEY - Chave privada da conta de serviço</li>
          <li>GOOGLE_SHEET_ID - ID da planilha do Google Sheets</li>
        </ul>
        <p className="mt-2">
          Siga as instruções na documentação para criar uma conta de serviço e compartilhar sua planilha com essa conta.
        </p>
      </AlertDescription>
    </Alert>
  )
}
