import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Função para inicializar a conexão com o Google Sheets
export async function getGoogleSheet() {
  try {
    // Autenticação com credenciais de serviço
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Inicializa o documento usando o ID da planilha
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "", serviceAccountAuth)

    // Carrega as informações do documento
    await doc.loadInfo()

    return doc
  } catch (error) {
    console.error("Erro ao conectar com o Google Sheets:", error)
    throw new Error("Falha ao conectar com o Google Sheets")
  }
}

// Função para adicionar uma nova linha à planilha
export async function addRowToSheet(data: {
  cpf: string
  gender: string
  professional: string
  hasPlan: string
  frequency: string
}) {
  try {
    const doc = await getGoogleSheet()

    // Obtém a primeira planilha do documento
    const sheet = doc.sheetsByIndex[0]

    // Formata os dados para adicionar à planilha
    const newRow = {
      CPF: data.cpf,
      Sexo: data.gender === "masculino" ? "Masculino" : data.gender === "feminino" ? "Feminino" : "Outro",
      Profissional: getProfessionalName(data.professional),
      "Possui Plano": data.hasPlan === "sim" ? "Sim" : "Não",
      Frequência: getFrequencyName(data.frequency),
      "Data de Preenchimento": new Date().toLocaleString("pt-BR"),
    }

    // Adiciona a nova linha à planilha
    await sheet.addRow(newRow)

    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar dados à planilha:", error)
    return { success: false, error: "Falha ao salvar dados na planilha" }
  }
}

// Funções auxiliares para obter nomes legíveis
function getProfessionalName(value: string): string {
  const professionals: Record<string, string> = {
    "dr-silva": "Dr. Silva - Clínico Geral",
    "dra-santos": "Dra. Santos - Cardiologista",
    "dr-oliveira": "Dr. Oliveira - Ortopedista",
    "dra-costa": "Dra. Costa - Dermatologista",
    "dr-pereira": "Dr. Pereira - Neurologista",
  }
  return professionals[value] || value
}

function getFrequencyName(value: string): string {
  const frequencies: Record<string, string> = {
    "primeira-vez": "Primeira vez",
    mensal: "Mensalmente",
    trimestral: "A cada 3 meses",
    semestral: "A cada 6 meses",
    anual: "Anualmente",
    raramente: "Raramente",
  }
  return frequencies[value] || value
}
