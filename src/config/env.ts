import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

if (!process.env.LOJA_ID || !process.env.API_CENTRAL || !process.env.AGENTE_TOKEN) {
  console.error("❌ ERRO CRÍTICO: Configurações obrigatórias ausentes no arquivo .env");
  process.exit(1);
}

export const ENV = {
  LOJA_ID: process.env.LOJA_ID,
  API_CENTRAL: process.env.API_CENTRAL,
  AGENTE_TOKEN: process.env.AGENTE_TOKEN,
  INTERVALO: Number(process.env.INTERVALO_MS) || 30000,
  INFRA_IPS: {
    roteador: process.env.IP_ROTEADOR_LOCAL,
    impressora_comanda: process.env.IP_IMPRESSORA_COMANDA,
    impressora_nfc: process.env.IP_IMPRESSORA_NFC,
    totem_01: process.env.IP_TOTEM_01,
    totem_02: process.env.IP_TOTEM_02,
  } as Record<string, string | undefined>
};