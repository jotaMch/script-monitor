import axios from 'axios';
import { ENV } from '../config/env';
import { HeartbeatPayload } from '../types/monitor';

export async function enviarHeartbeat(payload: HeartbeatPayload): Promise<void> {
  try {
    await axios.post(ENV.API_CENTRAL, payload, {
      timeout: 5000,
      headers: {
        'Authorization': `Bearer ${ENV.AGENTE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[${new Date().toISOString()}] Status reportado com sucesso.`);
  } catch (error) {
    console.error(`[Aviso] Falha de comunicação com o servidor central.`);
  }
}
