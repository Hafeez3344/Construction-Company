/**
 * Converts a numeric currency value to plain text words in PKR format.
 * Example: 1542000 => "One Million Five Hundred Forty-Two Thousand PKR Only"
 * Example: 450000 => "Four Hundred Fifty Thousand PKR Only"
 */
export function numberToPKRWords(num: number): string {
  if (isNaN(num) || num === 0) return "Zero PKR Only";
  if (num < 0) return "Minus " + numberToPKRWords(Math.abs(num));

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + ones[n % 10] : "") + " ";
    } else if (n > 0) {
      str += ones[n] + " ";
    }
    return str;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = "";

  const billion = Math.floor(integerPart / 1000000000);
  const million = Math.floor((integerPart % 1000000000) / 1000000);
  const thousand = Math.floor((integerPart % 1000000) / 1000);
  const remainder = integerPart % 1000;

  if (billion > 0) {
    result += convertChunk(billion) + "Billion ";
  }
  if (million > 0) {
    result += convertChunk(million) + "Million ";
  }
  if (thousand > 0) {
    result += convertChunk(thousand) + "Thousand ";
  }
  if (remainder > 0) {
    result += convertChunk(remainder);
  }

  result = result.trim() + " PKR";

  if (decimalPart > 0) {
    result += " and " + convertChunk(decimalPart).trim() + " Paisa";
  }

  return result + " Only";
}
