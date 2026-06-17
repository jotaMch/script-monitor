import { ENV } from './config/env';
import { checarConexaoExterna, checarInfraLocal } from './sevices/ping.services';
import { enviarHeartbeat } from './sevices/api.services';

async function rodarMonitoramento() {
  const [conexaoExterna, infraLocal] = await Promise.all([
    checarConexaoExterna(),
    checarInfraLocal()
  ]);

  await enviarHeartbeat({
    loja_id: ENV.LOJA_ID,
    status_internet: conexaoExterna.status,
    latencia_ms: conexaoExterna.latencia,
    infra_local: infraLocal
  });
}

console.log(`🚀 Agente de Monitoramento iniciado para a filial: ${ENV.LOJA_ID}`);

// Execução inicial e loop
rodarMonitoramento();
setInterval(rodarMonitoramento, ENV.INTERVALO);