import type { InvoiceData } from '../types/invoice';
import { formatInrWords } from '../utils/numberToWords';

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  id: 'inv-vizag-ivf-aug2026',
  clientInfo: {
    customerName: 'Vizag IVF Centre',
    address: '29-2-42/213, opp. Veterinary Hospital Judge Court, Prakasaraopeta, Nehru Nagar, Ram Nagar,\nVisakhapatnam, Andhra Pradesh 530020',
    branches: 'Visakhapatnam, Gajuwaka, Vizianagaram, Srikakulam',
    contactPerson: 'B. Sireesha Rani',
    email: 'Vizagivf@gmail.com',
    phone: '+91 77026 36137',
    gstin: 'N/A',
    state: 'Andhra Pradesh'
  },
  meta: {
    invoiceNo: 'SB/26-27/01',
    invoiceDate: '01 Sep  2026',
    servicePeriod: '01 Aug 2026 – 31 Aug 2026',
    dueDate: '10th Sep 2026',
    placeOfSupply: 'Andhra Pradesh',
    reverseCharge: 'No',
    referenceNo: 'N/A'
  },
  items: [
    {
      id: 'item-1',
      sNo: 1,
      description: 'Website Development & Maintenance, \nLocal SEO & Google Business Profile Management, Ads Management',
      qty: '4( considering four branches)',
      rate: 30000,
      taxableValue: 30000,
      gstPercent: 0,
      gstAmount: 0,
      totalAmount: 30000
    }
  ],
  totals: {
    subtotal: 30000,
    cgstPercent: 9,
    cgstAmount: 0,
    sgstPercent: 9,
    sgstAmount: 0,
    totalAmount: 30000,
    amountInWords: 'Indian Rupees : Thirty Thousand Rupees Only'
  },
  paymentDetails: {
    bankName: 'ICICI',
    accountName: 'MEDCY HEALTH TECH PRIVATE LIMITED',
    accountNumber: '631605013978',
    ifscCode: 'ICIC0006316',
    upiId: 'medcy89522.ibz@icici'
  },
  provider: {
    brandName: 'DIGITAL MARKETING SERVICES(SBLOOM)',
    companyName: 'MEDCY HEALTH TECH',
    tagline: 'AI-NATIVE HEALTHCARE SOLUTIONS FOR A BRIGHTER TOMORROW',
    subTagline: 'Partnering for Healthcare Excellence',
    email: 'hr@medcytech.com',
    phone: '+91 9989978418',
    website: 'https://marketing.ottobon.in/',
    address: 'Q887+M98 Health City Chinnagadili, Plot 9A, Chinna Gadhili, Arilova, Visakhapatnam, Andhra Pradesh 530040'
  },
  notes: [
    '1. This invoice is for services rendered during August 2026.',
    '2. Services are provided as per the agreed scope and proposal.',
    '3. For any queries, please contact us at academy@ottobon.in.'
  ],
  terms: [
    '1. Payment shall be made within 10 days from the date of invoice.',
    '2. Services are provided as per the agreed scope and proposal.',
    '3. Any applicable taxes will be charged as per prevailing law.',
    '4. Disputes, if any, shall be subject to the jurisdiction of Visakhapatnam, Andhra Pradesh.',
    '5. This is a system-generated invoice and does not require a physical signature.'
  ],
  signatoryFor: 'For Medcy Health Tech Pvt Ltd',
  signatoryTitle: 'Authorized Signatory',
  showStamp: true,
  showCustomerSignature: true,
  customerSignatoryLabel: 'For Vizag IVF Centre',
  customerSignatoryTitle: 'Authorized Customer Signature',
  customerSignatureData: ''
};

export const BLANK_INVOICE_DATA: InvoiceData = {
  id: `inv-${Date.now()}`,
  clientInfo: {
    customerName: '',
    address: '',
    branches: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: 'N/A',
    state: ''
  },
  meta: {
    invoiceNo: `SB/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/01`,
    invoiceDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    servicePeriod: '',
    dueDate: '',
    placeOfSupply: '',
    reverseCharge: 'No',
    referenceNo: 'N/A'
  },
  items: [
    {
      id: `item-${Date.now()}`,
      sNo: 1,
      description: '',
      qty: '1',
      rate: 0,
      taxableValue: 0,
      gstPercent: 0,
      gstAmount: 0,
      totalAmount: 0
    }
  ],
  totals: {
    subtotal: 0,
    cgstPercent: 9,
    cgstAmount: 0,
    sgstPercent: 9,
    sgstAmount: 0,
    totalAmount: 0,
    amountInWords: formatInrWords(0)
  },
  paymentDetails: {
    bankName: 'ICICI',
    accountName: 'MEDCY HEALTH TECH PRIVATE LIMITED',
    accountNumber: '631605013978',
    ifscCode: 'ICIC0006316',
    upiId: 'medcy89522.ibz@icici'
  },
  provider: {
    brandName: 'DIGITAL MARKETING SERVICES(SBLOOM)',
    companyName: 'MEDCY HEALTH TECH',
    tagline: 'AI-NATIVE HEALTHCARE SOLUTIONS FOR A BRIGHTER TOMORROW',
    subTagline: 'Partnering for Healthcare Excellence',
    email: 'hr@medcytech.com',
    phone: '+91 9989978418',
    website: 'https://marketing.ottobon.in/',
    address: 'Q887+M98 Health City Chinnagadili, Plot 9A, Chinna Gadhili, Arilova, Visakhapatnam, Andhra Pradesh 530040'
  },
  notes: [
    '1. This invoice is for services rendered during current billing period.',
    '2. Services are provided as per the agreed scope and proposal.',
    '3. For any queries, please contact us at academy@ottobon.in.'
  ],
  terms: [
    '1. Payment shall be made within 10 days from the date of invoice.',
    '2. Services are provided as per the agreed scope and proposal.',
    '3. Any applicable taxes will be charged as per prevailing law.',
    '4. Disputes, if any, shall be subject to the jurisdiction of Visakhapatnam, Andhra Pradesh.',
    '5. This is a system-generated invoice and does not require a physical signature.'
  ],
  signatoryFor: 'For Medcy Health Tech Pvt Ltd',
  signatoryTitle: 'Authorized Signatory',
  showStamp: true,
  showCustomerSignature: true,
  customerSignatoryLabel: 'For Vizag IVF Centre',
  customerSignatoryTitle: 'Authorized Customer Signature',
  customerSignatureData: ''
};

