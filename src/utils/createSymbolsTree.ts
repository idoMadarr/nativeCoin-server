import { SymbolTreeType, SymbolType } from '../types/Symbol';

export const createSymbolsTree = (symbols: SymbolType[]) => {
  const parseSymbols: SymbolTreeType = {};

  symbols.reduce((accumulator, currenctSymbol) => {
    if (!accumulator[currenctSymbol.type]) {
      accumulator[currenctSymbol.type] = [currenctSymbol];
    } else {
      accumulator[currenctSymbol.type].push(currenctSymbol);
    }
    return accumulator;
  }, parseSymbols);
  return parseSymbols;
};

export const createCategories = (symbols: SymbolType[]) => {
  const uniqueSet: string[] = [];

  symbols.filter(symbol => {
    if (uniqueSet.indexOf(symbol.type) === -1) {
      uniqueSet.push(symbol.type);
      return true;
    }
    return false;
  });

  return uniqueSet;
};

/* 
{
    SHARES: {
        SDRGBP: [
            ...    
        ] ...
    } ...
}
*/
