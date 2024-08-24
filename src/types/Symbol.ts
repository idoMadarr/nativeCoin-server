export interface SymbolType {
  ask: string;
  bid: string;
  display: string;
  id: string;
  max: string;
  min: string;
  perc: string;
  rateUpdateTime: string;
  symbol: string;
  symbolName: string;
  type: string;
  popularity?: undefined | string;
}

export interface SymbolTreeType {
  [key: string]: SymbolType[];
}
