import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Função para padronizar resposta da API
export async function parseApiResponse(response, key = "data") {
  try {
    const json = await response.json()
    if (Array.isArray(json)) {
      // Caso o backend retorne array direto
      return { success: true, [key]: json }
    }
    // Caso padrão: já vem com success/data/etc
    return json
  } catch (e) {
    return { success: false, error: "Resposta inválida da API" }
  }
}