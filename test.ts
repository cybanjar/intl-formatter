import { IntlFormatter } from './src/index';

const formatter = new IntlFormatter()

console.log(formatter.format(1234.56)); // Expected: "1,234.56"