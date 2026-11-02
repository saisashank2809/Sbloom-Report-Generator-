/**
 * Convert numerical INR amount to Indian Currency words
 * Format: "Indian Rupees : Thirty Thousand Rupees Only"
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n: number): string {
  let word = '';
  if (n >= 100) {
    word += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      word += ONES[n] + ' ';
    } else {
      word += TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ONES[n % 10] + ' ' : ' ');
    }
  }
  return word.trim();
}

export function numberToWordsIndian(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return 'Zero Rupees Only';
  }

  const rounded = Math.round(Math.abs(amount));
  let n = rounded;
  let result = '';

  const crores = Math.floor(n / 10000000);
  n %= 10000000;

  const lakhs = Math.floor(n / 100000);
  n %= 100000;

  const thousands = Math.floor(n / 1000);
  n %= 1000;

  const remainder = n;

  if (crores > 0) {
    result += convertBelowThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertBelowThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertBelowThousand(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertBelowThousand(remainder) + ' ';
  }

  const words = result.trim().replace(/\s+/g, ' ');
  return `${words} Rupees Only`;
}

export function formatInrWords(amount: number): string {
  return `Indian Rupees : ${numberToWordsIndian(amount)}`;
}

