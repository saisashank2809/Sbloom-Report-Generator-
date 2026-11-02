export interface InvoiceClientInfo {
  customerName: string;
  address: string;
  branches: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  state: string;
}

export interface InvoiceMeta {
  invoiceNo: string;
  invoiceDate: string;
  servicePeriod: string;
  dueDate: string;
  placeOfSupply: string;
  reverseCharge: string;
  referenceNo: string;
}

export interface InvoiceItem {
  id: string;
  sNo: number;
  description: string;
  qty: string;
  rate: number;
  taxableValue: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
}

export interface InvoicePaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface InvoiceTotals {
  subtotal: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  totalAmount: number;
  amountInWords: string;
}

export interface InvoiceProviderDetails {
  brandName: string;
  companyName: string;
  tagline: string;
  subTagline: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

export interface InvoiceData {
  id: string;
  clientInfo: InvoiceClientInfo;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  paymentDetails: InvoicePaymentDetails;
  totals: InvoiceTotals;
  provider: InvoiceProviderDetails;
  notes: string[];
  terms: string[];
  signatoryFor: string;
  signatoryTitle: string;
  showStamp: boolean;
  showCustomerSignature?: boolean;
  customerSignatoryLabel?: string;
  customerSignatoryTitle?: string;
  customerSignatureData?: string;
  updatedAt?: string;
}

