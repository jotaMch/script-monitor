"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarHeartbeat = enviarHeartbeat;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
async function enviarHeartbeat(payload) {
    try {
        await axios_1.default.post(env_1.ENV.API_CENTRAL, payload, {
            timeout: 5000,
            headers: {
                'Authorization': `Bearer ${env_1.ENV.AGENTE_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`[${new Date().toISOString()}] 🎯 Status reportado com sucesso.`);
    }
    catch (error) {
        console.error(`[Aviso] Falha de comunicação com o servidor central.`);
    }
}
