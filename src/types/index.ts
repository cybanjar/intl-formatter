export type FormatOptions = {
  locale?: string;
  currency?: string;
  style?: 'decimal' | 'currency' | 'percent' | 'unit';
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  unit?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  useGrouping?: boolean | 'always' | 'auto' | 'min2';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  currencySign?: 'standard' | 'accounting';
  unitDisplay?: 'long' | 'short' | 'narrow';
  roundingMode?: 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfCeil' | 'halfFloor' | 'halfExpand' | 'halfTrunc' | 'halfEven';
  compactDisplay?: 'long' | 'short' | 'narrow';
};