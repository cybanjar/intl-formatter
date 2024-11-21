import { FormatOptions } from '../types';

export class IntlFormatter {
  private defaultOptions: FormatOptions;

  constructor(options: FormatOptions = {}) {
    this.defaultOptions = {
      locale: navigator?.language || 'en-US',
      style: 'decimal',
      notation: 'standard',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      minimumSignificantDigits: undefined,
      maximumSignificantDigits: undefined,
      useGrouping: true,
      roundingMode: 'halfEven',
      currency: undefined,
      currencyDisplay: 'symbol',
      currencySign: undefined,
      unit: undefined,
      unitDisplay: 'short',
      signDisplay: 'auto',
      compactDisplay: 'short',
      ...options,
    };
  }

  format(value: number, options: FormatOptions = {}): string {
    try {
      const { locale = this.defaultOptions.locale, ...formatOptions } = { ...this.defaultOptions, ...options };
      
      // Handle very small numbers with high precision requirements
      if (Math.abs(value) < Math.pow(10, -6) && options.minimumFractionDigits) {
        return value.toFixed(options.minimumFractionDigits);
      }

      // Check if Intl is supported
      if (typeof Intl === 'undefined' || !Intl.NumberFormat) {
        return value.toLocaleString(locale);
      }

      // Handle older browsers that don't support certain options
      const safeFormatOptions = { ...formatOptions };
      if (!this.supportsNotation()) {
        delete safeFormatOptions.notation;
        delete safeFormatOptions.compactDisplay;
      }
      if (!this.supportsRoundingMode()) {
        delete safeFormatOptions.roundingMode;
      }
      if (!this.supportsSignDisplay()) {
        delete safeFormatOptions.signDisplay;
      }
      if (!this.supportsUnitFormat()) {
        delete safeFormatOptions.unit;
        delete safeFormatOptions.unitDisplay;
      }

      // Clean up undefined options
      Object.keys(safeFormatOptions).forEach((key) => {
        const formatKey = key as keyof typeof safeFormatOptions;
        if (safeFormatOptions[formatKey] === undefined) {
          delete safeFormatOptions[formatKey];
        }
      });

      return new Intl.NumberFormat(locale, safeFormatOptions as Intl.NumberFormatOptions).format(value);
    } catch (error) {
      console.error('Formatting error:', error);
      return value.toLocaleString(this.defaultOptions.locale);
    }
  }

  formatCurrency(value: number, options: Omit<FormatOptions, 'style'> = {}): string {
    return this.format(value, {
      ...options,
      style: 'currency',
      minimumFractionDigits: options.minimumFractionDigits ?? 2,
      maximumFractionDigits: options.maximumFractionDigits ?? 2
    });
  }

  formatPercent(value: number, options: Omit<FormatOptions, 'style'> = {}): string {
    return this.format(value, {
      ...options,
      style: 'percent',
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
      maximumFractionDigits: options.maximumFractionDigits ?? 1
    });
  }

  formatUnit(value: number, unit: string, options: Omit<FormatOptions, 'style' | 'unit'> = {}): string {
    if (!this.supportsUnitFormat()) {
      const formattedValue = this.format(value, options);
      const unitDisplay = options.unitDisplay || 'short';
      const unitMap = {
        short: unit,
        long: this.getUnitLongForm(unit),
        narrow: this.getUnitNarrowForm(unit)
      };
      return `${formattedValue} ${unitMap[unitDisplay]}`;
    }

    return this.format(value, {
      ...options,
      style: 'unit',
      unit,
      unitDisplay: options.unitDisplay || 'short'
    });
  }

  formatCustom(value: number, formatFn: (formattedValue: string) => string, options: FormatOptions = {}): string {
    const formattedValue = this.format(value, options);
    return formatFn(formattedValue);
  }

  formatRange(start: number, end: number, options: FormatOptions = {}): string {
    try {
      const { locale = this.defaultOptions.locale, ...formatOptions } = { ...this.defaultOptions, ...options };

      if (typeof Intl === 'undefined' || !Intl.NumberFormat) {
        return `${start.toLocaleString(locale)} - ${end.toLocaleString(locale)}`;
      }

      const safeFormatOptions = { ...formatOptions };
      if (!this.supportsNotation()) {
        delete safeFormatOptions.notation;
        delete safeFormatOptions.compactDisplay;
      }
      if (!this.supportsRoundingMode()) {
        delete safeFormatOptions.roundingMode;
      }
      if (!this.supportsSignDisplay()) {
        delete safeFormatOptions.signDisplay;
      }

      Object.keys(safeFormatOptions).forEach((key) => {
        if (safeFormatOptions[key as keyof typeof safeFormatOptions] === undefined) {
          delete safeFormatOptions[key as keyof typeof safeFormatOptions];
        }
      });

      const formatter = new Intl.NumberFormat(locale, safeFormatOptions as Intl.NumberFormatOptions);

      if (this.supportsFormatRange()) {
        return (formatter as any).formatRange(start, end);
      }

      const separator = this.getLocaleSeparator(locale || 'en');
      return `${formatter.format(start)}${separator}${formatter.format(end)}`;
    } catch (error) {
      console.error('Range formatting error:', error);
      return `${this.format(start)} - ${this.format(end)}`;
    }
  }

  formatCompact(value: number, options: Omit<FormatOptions, 'notation'> = {}): string {
    if (!this.supportsNotation()) {
      const absValue = Math.abs(value);
      const sign = value < 0 ? '-' : '';
      const { minimumFractionDigits = 1, maximumFractionDigits = 1 } = options;
      
      const format = (val: number, precision: number) => {
        return val.toFixed(Math.min(Math.max(minimumFractionDigits, precision), maximumFractionDigits));
      };

      if (absValue >= 1e12) return `${sign}${format(absValue / 1e12, 1)}T`;
      if (absValue >= 1e9) return `${sign}${format(absValue / 1e9, 1)}B`;
      if (absValue >= 1e6) return `${sign}${format(absValue / 1e6, 1)}M`;
      if (absValue >= 1e3) return `${sign}${format(absValue / 1e3, 1)}K`;
      return this.format(value, options);
    }

    return this.format(value, {
      ...options,
      notation: 'compact',
      compactDisplay: options.compactDisplay || 'short'
    });
  }

  formatScientific(value: number, options: Omit<FormatOptions, 'notation'> = {}): string {
    if (!this.supportsNotation()) {
      const { minimumSignificantDigits = 3, maximumSignificantDigits = 5 } = options;
      const precision = Math.min(Math.max(minimumSignificantDigits - 1, 0), maximumSignificantDigits - 1);
      return value.toExponential(precision);
    }

    return this.format(value, {
      ...options,
      notation: 'scientific',
      minimumSignificantDigits: options.minimumSignificantDigits ?? 3,
      maximumSignificantDigits: options.maximumSignificantDigits ?? 5
    });
  }

  private supportsNotation(): boolean {
    try {
      new Intl.NumberFormat('en', { notation: 'compact' } as Intl.NumberFormatOptions);
      return true;
    } catch {
      return false;
    }
  }

  private supportsRoundingMode(): boolean {
    try {
      new Intl.NumberFormat('en', { roundingMode: 'halfEven' } as Intl.NumberFormatOptions);
      return true;
    } catch {
      return false;
    }
  }

  private supportsUnitFormat(): boolean {
    try {
      new Intl.NumberFormat('en', { style: 'unit', unit: 'meter' } as Intl.NumberFormatOptions);
      return true;
    } catch {
      return false;
    }
  }

  private supportsSignDisplay(): boolean {
    try {
      new Intl.NumberFormat('en', { signDisplay: 'always' } as Intl.NumberFormatOptions);
      return true;
    } catch {
      return false;
    }
  }

  private supportsFormatRange(): boolean {
    return typeof Intl !== 'undefined' && 
           Intl.NumberFormat && 
           typeof (Intl.NumberFormat.prototype as any).formatRange === 'function';
  }

  private getLocaleSeparator(locale: string): string {
    const lang = locale.toLowerCase().split('-')[0];
    switch (lang) {
      case 'zh':
      case 'ja':
      case 'ko':
        return '～';
      case 'ar':
      case 'fa':
      case 'he':
        return '—';
      case 'th':
        return ' ถึง ';
      default:
        return '–';
    }
  }

  private getUnitLongForm(unit: string): string {
    const unitMap: Record<string, string> = {
      'meter': 'meters',
      'm': 'meters',
      'kilometer': 'kilometers',
      'km': 'kilometers',
      'celsius': 'degrees Celsius',
      'fahrenheit': 'degrees Fahrenheit',
      'gram': 'grams',
      'g': 'grams',
      'kilogram': 'kilograms', 
      'kg': 'kilograms',
      'liter': 'liters',
      'l': 'liters',
      'milliliter': 'milliliters',
      'ml': 'milliliters',
      'second': 'seconds',
      's': 'seconds',
      'minute': 'minutes',
      'min': 'minutes',
      'hour': 'hours',
      'h': 'hours',
      'day': 'days',
      'd': 'days',
      'week': 'weeks',
      'w': 'weeks',
      'month': 'months',
      'mo': 'months',
      'year': 'years',
      'y': 'years',
      'byte': 'bytes',
      'b': 'bytes',
      'kilobyte': 'kilobytes',
      'kb': 'kilobytes',
      'megabyte': 'megabytes',
      'mb': 'megabytes',
      'gigabyte': 'gigabytes',
      'gb': 'gigabytes'
    };
    return unitMap[unit] || unit;
  }

  private getUnitNarrowForm(unit: string): string {
    const unitMap: Record<string, string> = {
      'meter': 'm',
      'kilometer': 'km',
      'celsius': '°C',
      'fahrenheit': '°F',
      'gram': 'g',
      'kilogram': 'kg',
      'liter': 'l', 
      'milliliter': 'ml',
      'second': 's',
      'minute': 'min',
      'hour': 'h',
      'day': 'd',
      'week': 'w',
      'month': 'mo',
      'year': 'y',
      'byte': 'b',
      'kilobyte': 'kb',
      'megabyte': 'mb',
      'gigabyte': 'gb'
    };
    return unitMap[unit] || unit;
  }
}