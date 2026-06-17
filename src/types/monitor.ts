export interface InfraLocalStatus {
  [equipamento: string]: 'ONLINE' | 'OFFLINE';
}

export interface HeartbeatPayload {
  loja_id: string;
  status_internet: 'ONLINE' | 'OFFLINE';
  latencia_ms: number;
  infra_local: InfraLocalStatus;
}