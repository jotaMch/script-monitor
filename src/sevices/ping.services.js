"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checarConexaoExterna = checarConexaoExterna;
exports.checarInfraLocal = checarInfraLocal;
const ping_1 = __importDefault(require("ping"));
const env_1 = require("../config/env");
async function checarConexaoExterna() {
    try {
        const res = await ping_1.default.promise.probe('1.1.1.1', { timeout: 3 });
        if (res.alive) {
            const latencia = typeof res.time === 'number' ? res.time : parseFloat(res.time) || 0;
            return { status: 'ONLINE', latencia: Math.round(latencia) };
        }
        return { status: 'OFFLINE', latencia: 0 };
    }
    catch {
        return { status: 'OFFLINE', latencia: 0 };
    }
}
async function checarInfraLocal() {
    const statusLocal = {};
    const promessas = Object.entries(env_1.ENV.INFRA_IPS).map(async ([equipamento, ip]) => {
        if (!ip)
            return;
        try {
            const res = await ping_1.default.promise.probe(ip, { timeout: 2 });
            statusLocal[equipamento] = res.alive ? 'ONLINE' : 'OFFLINE';
        }
        catch {
            statusLocal[equipamento] = 'OFFLINE';
        }
    });
    await Promise.all(promessas);
    return statusLocal;
}
