import WebSocket from 'ws';

export interface IWsConnection {
  client: WebSocket,
  token: string;
}

export let tokenOpening: IWsConnection[] = [];

export const remove = (socket: WebSocket) => {
  tokenOpening = tokenOpening.filter(o => o.client != socket);
}


