"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const ping_services_1 = require("./sevices/ping.services");
const api_services_1 = require("./sevices/api.services");
async function rodarMonitoramento() {
    const [conexaoExterna, infraLocal] = await Promise.all([
        (0, ping_services_1.checarConexaoExterna)(),
        (0, ping_services_1.checarInfraLocal)()
    ]);
    await (0, api_services_1.enviarHeartbeat)({
        loja_id: env_1.ENV.LOJA_ID,
        status_internet: conexaoExterna.status,
        latencia_ms: conexaoExterna.latencia,
        infra_local: infraLocal
    });
}
console.log(`🚀 Agente de Monitoramento iniciado para a filial: ${env_1.ENV.LOJA_ID}`);
// Execução inicial e loop
rodarMonitoramento();
setInterval(rodarMonitoramento, env_1.ENV.INTERVALO);
