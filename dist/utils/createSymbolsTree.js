"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategories = exports.createSymbolsTree = void 0;
const createSymbolsTree = (symbols) => {
    const parseSymbols = {};
    symbols.reduce((accumulator, currenctSymbol) => {
        if (!accumulator[currenctSymbol.type]) {
            accumulator[currenctSymbol.type] = [currenctSymbol];
        }
        else {
            accumulator[currenctSymbol.type].push(currenctSymbol);
        }
        return accumulator;
    }, parseSymbols);
    return parseSymbols;
};
exports.createSymbolsTree = createSymbolsTree;
const createCategories = (symbols) => {
    const uniqueSet = [];
    symbols.filter(symbol => {
        if (uniqueSet.indexOf(symbol.type) === -1) {
            uniqueSet.push(symbol.type);
            return true;
        }
        return false;
    });
    return uniqueSet;
};
exports.createCategories = createCategories;
/*
{
    SHARES: {
        SDRGBP: [
            ...
        ] ...
    } ...
}
*/
