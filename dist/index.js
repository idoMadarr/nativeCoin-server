"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv = __importStar(require("dotenv"));
const socketIO_1 = __importDefault(require("./services/socketIO"));
require("express-async-errors");
const createSymbolsTree_1 = require("./utils/createSymbolsTree");
const symbolsArray_json_1 = require("./db/symbolsArray.json");
const symbolsObject_json_1 = __importDefault(require("./db/symbolsObject.json"));
const redis_1 = __importDefault(require("./services/redis"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Middleware to serve static files from 'icons' folder:
const iconsDir = path_1.default.join(__dirname, 'icons');
app.use('/icons', express_1.default.static(iconsDir));
// Fetch initial symbols structure
app.get('/static', (_req, res) => {
    const categories = (0, createSymbolsTree_1.createCategories)(symbolsArray_json_1.symbolsArray);
    const symbolsList = (0, createSymbolsTree_1.createSymbolsTree)(symbolsArray_json_1.symbolsArray);
    return res.send({ symbolsObject: symbolsObject_json_1.default, symbolsList, categories });
});
// Update after user viewable symbols
app.post('/viewable', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const viewableSymbols = req.body.viewableSymbols;
    const userId = req.body.userId;
    yield redis_1.default.set(userId, JSON.stringify(viewableSymbols));
    return res.send({});
}));
// Fetch random icon
app.get('/random-icon', (req, res) => {
    fs_1.default.readdir(iconsDir, (error, files) => {
        if (error)
            return res.status(400).send(error);
        if (!files.length)
            return res.status(401).send({ message: 'Empty Directory' });
        const randomFile = files[Math.floor(Math.random() * files.length - 1)];
        res.sendFile(path_1.default.join(iconsDir, randomFile));
    });
});
const initServer = () => {
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
        socketIO_1.default.socketInit(server);
    });
};
initServer();
