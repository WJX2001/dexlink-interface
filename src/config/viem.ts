import { avalancheFuji } from 'viem/chains';
import { PublicClient, createPublicClient, http } from 'viem';

export const viemClients = (chaiId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient;
  } = {
    [avalancheFuji.id]: createPublicClient({
      chain: avalancheFuji,
      transport: http(),
    }),
  };
  return clients[chaiId];
};
