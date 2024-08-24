import { Server } from 'socket.io';
import symbolObject from '../db/symbolsObject.json';
import { SymbolType } from '../types/Symbol';
import client from './redis';

let io: any;
let interval: NodeJS.Timeout;

const fetchRealTimeData = async (symbols: string[]) => {
  const updateData = symbols.reduce((acc, symbol) => {
    const randomness = Math.floor(Math.random() * 10) % 2 === 0;
    if (symbol in symbolObject && randomness) {
      // @ts-ignore
      const updatedItem: SymbolType = symbolObject[symbol];

      const randomOperator = Math.floor(Math.random() * 10) % 2 === 0;
      let updatedBid: number;
      let updatedAsk: number;

      if (randomOperator) {
        updatedBid = Number(updatedItem.bid) + 3.48;
        updatedAsk = Number(updatedItem.ask) + 2.91;
      } else {
        updatedBid = Number(updatedItem.bid) - 2.86;
        updatedAsk = Number(updatedItem.ask) - 1.37;
      }

      updatedItem.bid = updatedBid.toFixed(2).toString();
      updatedItem.ask = updatedAsk.toFixed(2).toString();

      acc.push(updatedItem);
    }
    return acc;
  }, [] as SymbolType[]);
  return updateData;
};

export default {
  socketInit: (server: any) => {
    io = new Server(server);
    console.log('Socket Connected');

    io.on('connection', (socket: any) => {
      if (interval) {
        clearInterval(interval);
      }

      // Fetch real time data ...
      interval = setInterval(async () => {
        try {
          const currentSymbols = await client.get(socket.id);
          if (currentSymbols) {
            const formattedCurrentSymbols: string[] =
              JSON.parse(currentSymbols);
            const updateData = await fetchRealTimeData(formattedCurrentSymbols);
            socket.emit('updates', { updates: updateData });
          }
        } catch (error) {
          console.error('Error fetching real-time data:', error);
        }
      }, 5000);

      // Stop tracking when client disconnects
      socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
        clearInterval(interval);
        client.del(socket.id);
      });
    });
  },
  getIO: () => {
    if (io) return io;
    console.log('Socket.io is not initialized!');
  },
};
