"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const symbolsObject_json_1 = __importDefault(require("../db/symbolsObject.json"));
const redis_1 = __importDefault(require("./redis"));
let io;
let interval;
const fetchRealTimeData = (symbols) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = symbols.reduce((acc, symbol) => {
        const randomness = Math.floor(Math.random() * 10) % 2 === 0;
        if (symbol in symbolsObject_json_1.default && randomness) {
            // @ts-ignore
            const updatedItem = symbolsObject_json_1.default[symbol];
            const randomOperator = Math.floor(Math.random() * 10) % 2 === 0;
            let updatedBid;
            let updatedAsk;
            if (randomOperator) {
                updatedBid = Number(updatedItem.bid) + 3.48;
                updatedAsk = Number(updatedItem.ask) + 2.91;
            }
            else {
                updatedBid = Number(updatedItem.bid) - 2.86;
                updatedAsk = Number(updatedItem.ask) - 1.37;
            }
            updatedItem.bid = updatedBid.toFixed(2).toString();
            updatedItem.ask = updatedAsk.toFixed(2).toString();
            acc.push(updatedItem);
        }
        return acc;
    }, []);
    return updateData;
});
exports.default = {
    socketInit: (server) => {
        io = new socket_io_1.Server(server);
        console.log('Socket Connected');
        io.on('connection', (socket) => {
            if (interval) {
                clearInterval(interval);
            }
            // Fetch real time data ...
            interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const currentSymbols = yield redis_1.default.get(socket.id);
                    if (currentSymbols) {
                        const formattedCurrentSymbols = JSON.parse(currentSymbols);
                        const updateData = yield fetchRealTimeData(formattedCurrentSymbols);
                        socket.emit('updates', { updates: updateData });
                    }
                }
                catch (error) {
                    console.error('Error fetching real-time data:', error);
                }
            }), 5000);
            // Stop tracking when client disconnects
            socket.on('disconnect', () => {
                console.log(`user disconnected: ${socket.id}`);
                clearInterval(interval);
                redis_1.default.del(socket.id);
            });
        });
    },
    getIO: () => {
        if (io)
            return io;
        console.log('Socket.io is not initialized!');
    },
};
