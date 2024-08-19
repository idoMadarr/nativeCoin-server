import { SymbolTreeType, SymbolType } from '../types/Symbol';

export const createSymbolsTree = (symbols: SymbolType[]) => {
  const parseSymbols: SymbolTreeType = {};
  symbols.reduce((accumulator, { type, symbolName, ...rest }) => {
    accumulator[type] = {
      ...(accumulator[type] || {}),
      [symbolName]: { type, symbolName, ...rest },
    };
    return accumulator;
  }, parseSymbols);
  return parseSymbols;
};

/* 
{
    SHARES: {
        SDRGBP: {
            ...    
        } ...
    } ...
}
*/
