# IntlFormatter

A flexible and robust number formatting library that provides a consistent interface for formatting numbers across different locales and formats. It gracefully handles browser compatibility issues and provides fallbacks for unsupported features.

## Installation

```bash
npm install intl-number-formatter
```

## Basic Usage

```typescript
import { IntlFormatter } from 'intl-formatter';
// Create a formatter instance with default options
const formatter = new IntlFormatter();
// Basic number formatting
formatter.format(1234.567); // "1,234.57"
// Currency formatting
formatter.formatCurrency(1234.567, { currency: 'USD' }); // "$1,234.57"
// Percentage formatting
formatter.formatPercent(0.1234); // "12.3%"
```

## Features

- **Locale and Format Fallbacks**: Automatically falls back to a more basic format if the locale and format are not supported.
- **Flexible Options**: Provides a wide range of options to customize the formatting style and precision.
- **Browser Compatibility**: Uses Intl.NumberFormat under the hood, ensuring compatibility with modern browsers.    


## Available Formats

- **Currency**: Formats a number as a currency string.
- **Decimal**: Formats a number as a decimal string.
- **Percent**: Formats a number as a percentage string.
- **Scientific**: Formats a number in scientific notation.
- **Unit**: Formats a number as a unit string.
- **Custom**: Formats a number as a custom string.

## Available Units

- **Mass**: Formats a number as a mass unit (e.g. grams, kilograms).
- **Time**: Formats a number as a time unit (e.g. seconds, minutes, hours).
- **Length**: Formats a number as a length unit (e.g. meters, kilometers).
- **Volume**: Formats a number as a volume unit (e.g. liters, milliliters).
- **Speed**: Formats a number as a speed unit (e.g. meters per second, kilometers per hour).
- **Temperature**: Formats a number as a temperature unit (e.g. Celsius, Fahrenheit).

## Format currency

```typescript
const formatter = new IntlFormatter();
formatter.formatCurrency(1234.567, { currency: 'USD' }); // "$1,234.57"
```

## Format percent

```typescript
formatter.formatPercent(0.1234); // "12.3%"
```

## Format unit

```typescript
formatter.formatUnit(1234.567, { unit: 'meter' }); // "1,234.57 m"
```

## Format custom

```typescript
formatter.formatCustom(1234.567, (formattedValue) => `${formattedValue} meters`); // "1,234.57 meters"
```

## Format range

```typescript
formatter.formatRange(1234.567, 1234.567); // "1,234.57 - 1,234.57"
```

## Format compact

```typescript
formatter.formatCompact(1234.567); // "1.23K"
```

## Format scientific

```typescript
formatter.formatScientific(1234.567); // "1.234567E3"
```

## Unit Long and Narrow Form 

```typescript
formatter.getUnitLongForm('meter'); // "meter"
formatter.getUnitNarrowForm('meter'); // "m"
```



## Available Options

| Option | Type | Default | Description | Available Options |
|--------|------|---------|-------------|-------------------|
| `locale` | string | `navigator.language` or 'en-US' | The locale to use for formatting | Any valid locale string (e.g. 'en-US', 'fr-FR', 'de-DE') |
| `style` | string | 'decimal' | The formatting style | 'decimal', 'currency', 'percent', 'unit' |
| `notation` | string | 'standard' | The notation to use | 'standard', 'scientific', 'engineering', 'compact' |
| `minimumFractionDigits` | number | 0 | Minimum number of fraction digits to use | 0-20 |
| `maximumFractionDigits` | number | 2 | Maximum number of fraction digits to use | 0-20 |
| `minimumSignificantDigits` | number | undefined | Minimum number of significant digits | 1-21 |
| `maximumSignificantDigits` | number | undefined | Maximum number of significant digits | 1-21 |
| `useGrouping` | boolean \| string | true | Whether to use grouping separators | true, false, 'always', 'auto', 'min2' |
| `roundingMode` | string | 'halfEven' | The rounding mode to use | 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven' |
| `currency` | string | undefined | The currency code | Any valid ISO 4217 currency code (e.g. 'USD', 'EUR', 'JPY') |
| `currencyDisplay` | string | 'symbol' | How to display the currency | 'symbol', 'narrowSymbol', 'code', 'name' |
| `currencySign` | string | undefined | The currency sign to use | 'standard', 'accounting' |
| `unit` | string | undefined | The unit to use for unit formatting | Any valid unit identifier (e.g. 'meter', 'liter', 'celsius') |
| `unitDisplay` | string | 'short' | How to display the unit | 'short', 'long', 'narrow' |
| `signDisplay` | string | 'auto' | When to display the sign | 'auto', 'never', 'always', 'exceptZero' |
| `compactDisplay` | string | 'short' | Compact notation display style | 'short', 'long' |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
