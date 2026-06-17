import ping from 'ping';
import { ENV } from '../config/env';
import { InfraLocalStatus } from '../types/monitor';

export async function checarConexaoExterna(): Promise<{ status: 'ONLINE' | 'OFFLINE'; latencia: number }> {
  try {
    // teste de conexão externa com a cloudfire
    const res = await ping.promise.probe('1.1.1.1', { timeout: 3 });
    if (res.alive) {
      const latencia = typeof res.time === 'number' ? res.time : parseFloat(res.time) || 0;
      return { status: 'ONLINE', latencia: Math.round(latencia) };
    }
    return { status: 'OFFLINE', latencia: 0 };
  } catch {
    return { status: 'OFFLINE', latencia: 0 };
  }
}

export async function checarInfraLocal(): Promise<InfraLocalStatus> {
  const statusLocal: InfraLocalStatus = {};
  //teste de conexão com os periféricos da loja 
  const promessas = Object.entries(ENV.INFRA_IPS).map(async ([equipamento, ip]) => {
    if (!ip) return;
    try {
      const res = await ping.promise.probe(ip, { timeout: 2 });
      statusLocal[equipamento] = res.alive ? 'ONLINE' : 'OFFLINE';
    } catch {
      statusLocal[equipamento] = 'OFFLINE';
    }
  });

  await Promise.all(promessas);
  return statusLocal;
}