import { formatter, IntlFormatter } from './dist/index.js';

const format = new IntlFormatter()

console.log(format.format(1234.56)); // Expected: "1,234.56"
console.log(format.format(1234.56, { maximumFractionDigits: 0 })); // Expected: "1,235"
console.log(formatter.formatCurrency(1234.567, { currency: 'USD' })); // Expected: "$1,234.57"