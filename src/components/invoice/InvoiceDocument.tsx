import React, { useState } from 'react';
import type { InvoiceData } from '../../types/invoice';
import { Mail, Phone, Globe, MapPin, Landmark, FileText, PenTool } from 'lucide-react';
import { CustomerSignatureModal } from './CustomerSignatureModal';

interface Props {
  doc: InvoiceData;
  isEditable?: boolean;
  onCustomerSignatureChange?: (sigData: string) => void;
}

export const InvoiceDocument: React.FC<Props> = ({ 
  doc, 
  isEditable = false,
  onCustomerSignatureChange
}) => {
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  // Format currency with Indian comma separators
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: val % 1 === 0 ? 0 : 2
    }).format(val || 0);
  };

  const formatDecimals = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  return (
    <>
      <div
        className={`invoice-print-sheet ${isEditable ? 'is-live-editing' : ''}`}
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      spellCheck={isEditable}
    >
      {/* 1. Header & Client Section (Left: Provider Info + Bill To, Right: Meta Card) */}
      <header className="invoice-header-row">
        {/* Left Column: Brand & Bill To Info */}
        <div className="invoice-left-col">
          <div className="invoice-brand-block">
            <div className="invoice-brand-logo-wrap">
              <img 
                src="/invoice-medcy-logo.png" 
                alt="MEDCY HEALTH TECH" 
                className="invoice-logo-img" 
                onError={(e) => {
                  // Graceful fallback to CSS stylized logo if image is blocked
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="invoice-logo-fallback" style={{ display: 'none' }}>
                <div className="medcy-fallback-title">MEDCY</div>
                <div className="medcy-fallback-sub">H E A L T H &nbsp; T E C H</div>
              </div>
            </div>

            <div className="invoice-provider-subbrand">
              {doc.provider.brandName}
            </div>

            <div className="invoice-provider-contacts">
              <div className="contact-line">
                <Mail size={12} className="contact-icon" />
                <span>{doc.provider.email}</span>
              </div>
              <div className="contact-line">
                <Phone size={12} className="contact-icon" />
                <span>{doc.provider.phone}</span>
              </div>
              <div className="contact-line">
                <Globe size={12} className="contact-icon" />
                <span>{doc.provider.website.replace('https://', '').replace('/', '')}</span>
              </div>
              <div className="contact-line address-line">
                <MapPin size={12} className="contact-icon" />
                <span>{doc.provider.address}</span>
              </div>
            </div>
          </div>

          {/* Bill To Details immediately below provider contacts with reduced, tight spacing */}
          <div className="invoice-bill-to-col">
            <div className="bill-to-title-tag">Bill To</div>
            <h2 className="bill-to-client-name">{doc.clientInfo.customerName}</h2>
            <div className="bill-to-client-address">{doc.clientInfo.address}</div>

            <div className="bill-to-fields-list">
              <div className="bill-field-row">
                <span className="bill-field-label">Billing Address & Branches</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.branches}</span>
              </div>
              <div className="bill-field-row">
                <span className="bill-field-label">Contact Person</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.contactPerson}</span>
              </div>
              <div className="bill-field-row">
                <span className="bill-field-label">Email</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.email}</span>
              </div>
              <div className="bill-field-row">
                <span className="bill-field-label">Phone</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.phone}</span>
              </div>
              <div className="bill-field-row">
                <span className="bill-field-label">GSTIN (if applicable)</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.gstin}</span>
              </div>
              <div className="bill-field-row">
                <span className="bill-field-label">State</span>
                <span className="bill-field-colon">:</span>
                <span className="bill-field-value underline-field">{doc.clientInfo.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tagline & Tax Invoice Metadata Card */}
        <div className="invoice-meta-block">
          <div className="invoice-top-tagline">
            {doc.provider.tagline}
          </div>

          <div className="invoice-meta-card">
            <div className="invoice-meta-header">
              <h3>TAX INVOICE</h3>
              <p>FOR SERVICES RENDERED</p>
            </div>

            <div className="invoice-meta-body">
              <div className="meta-grid-row">
                <span className="meta-label">Invoice No.</span>
                <span className="meta-colon">:</span>
                <span className="meta-value bold-value">{doc.meta.invoiceNo}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Invoice Date</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.invoiceDate}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Service Period</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.servicePeriod}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Due Date</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.dueDate}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Place of Supply</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.placeOfSupply}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Reverse Charge</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.reverseCharge}</span>
              </div>
              <div className="meta-grid-row">
                <span className="meta-label">Reference No.</span>
                <span className="meta-colon">:</span>
                <span className="meta-value">{doc.meta.referenceNo}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Services & Line Items Table (Image 2) */}
      <section className="invoice-table-section">
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th className="th-sno">S.No.</th>
              <th className="th-desc">Description of Service</th>
              <th className="th-qty">Qty</th>
              <th className="th-rate">Rate (₹ )</th>
              <th className="th-taxable">Taxable Value (₹)</th>
              <th className="th-gst-pct">GST (%)</th>
              <th className="th-gst-amt">GST Amount (₹)</th>
              <th className="th-total">Total Amount<br />(₹)</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="td-sno">{item.sNo || idx + 1}</td>
                <td className="td-desc">
                  <div className="item-description-text">{item.description}</div>
                </td>
                <td className="td-qty">{item.qty}</td>
                <td className="td-rate">₹{formatCurrency(item.rate)}</td>
                <td className="td-taxable">₹{formatCurrency(item.taxableValue)}</td>
                <td className="td-gst-pct">{item.gstPercent}%</td>
                <td className="td-gst-amt">₹{formatCurrency(item.gstAmount)}</td>
                <td className="td-total">₹{formatCurrency(item.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Notes & Calculated Totals Summary */}
      <section className="invoice-totals-section">
        {/* Left: Notes & Amount in Words */}
        <div className="invoice-notes-block">
          <div className="notes-heading">Notes:</div>
          <div className="notes-list">
            {doc.notes.map((note, idx) => (
              <div key={idx} className="note-line">{note}</div>
            ))}
          </div>

          <div className="amount-words-wrap">
            <div className="amount-words-heading">Amount in Words</div>
            <div className="amount-words-text">{doc.totals.amountInWords}</div>
          </div>
        </div>

        {/* Right: Subtotal, CGST, SGST & Total Highlight Box */}
        <div className="invoice-calculations-block">
          <div className="calc-table">
            <div className="calc-row">
              <span className="calc-label">Subtotal</span>
              <span className="calc-val">₹{formatDecimals(doc.totals.subtotal)}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label">CGST ({doc.totals.cgstPercent}%)</span>
              <span className="calc-val">₹{formatDecimals(doc.totals.cgstAmount)}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label">SGST ({doc.totals.sgstPercent}%)</span>
              <span className="calc-val">₹{formatDecimals(doc.totals.sgstAmount)}</span>
            </div>
          </div>

          <div className="invoice-grand-total-bar">
            <span className="grand-total-label">Total Amount (₹)</span>
            <span className="grand-total-value">₹ {formatDecimals(doc.totals.totalAmount)}</span>
          </div>
        </div>
      </section>

      {/* 5. Payment Details (Image 3) & Terms & Conditions + Seal */}
      <section className="invoice-footer-grid">
        {/* Left: Payment Details Card & Optional Customer Acceptance Block */}
        <div className="invoice-left-footer-col">
          <div className="invoice-payment-col">
            <div className="payment-card-header">
              <span className="header-accent-bar"></span>
              <Landmark size={15} className="payment-header-icon" />
              <h4>Payment Details</h4>
            </div>

            <div className="payment-details-body">
              <div className="payment-row">
                <span className="pay-label">Bank Name</span>
                <span className="pay-colon">:</span>
                <span className="pay-val">{doc.paymentDetails.bankName}</span>
              </div>
              <div className="payment-row">
                <span className="pay-label">Account Name</span>
                <span className="pay-colon">:</span>
                <span className="pay-val">{doc.paymentDetails.accountName}</span>
              </div>
              <div className="payment-row">
                <span className="pay-label">Account Number</span>
                <span className="pay-colon">:</span>
                <span className="pay-val">{doc.paymentDetails.accountNumber}</span>
              </div>
              <div className="payment-row">
                <span className="pay-label">IFSC Code</span>
                <span className="pay-colon">:</span>
                <span className="pay-val">{doc.paymentDetails.ifscCode}</span>
              </div>
              <div className="payment-row">
                <span className="pay-label">UPI (Optional)</span>
                <span className="pay-colon">:</span>
                <span className="pay-val">{doc.paymentDetails.upiId}</span>
              </div>
            </div>
          </div>

          {/* Customer Signature / Acceptance Block (Togglable via Header / Editor) */}
          {doc.showCustomerSignature && (
            <div className="invoice-customer-signatory-wrap">
              <div className="customer-sign-header-line">
                <span className="sign-company-name">
                  {doc.customerSignatoryLabel || (doc.clientInfo.customerName ? `For ${doc.clientInfo.customerName}` : 'Customer Acceptance')}
                </span>
              </div>

              <div 
                className={`signature-graphics-box customer-sig-box ${!doc.customerSignatureData ? 'is-placeholder' : 'is-signed'}`}
                onClick={() => setIsCustModalOpen(true)}
                title={doc.customerSignatureData ? "Click to re-sign or change customer signature" : "Click to sign digitally"}
              >
                {doc.customerSignatureData ? (
                  <>
                    <img 
                      src={doc.customerSignatureData} 
                      alt="Customer Digital Signature" 
                      className="customer-signature-img"
                    />
                    <div className="customer-sig-hover-tools no-print">
                      <span className="hover-tool-tag">Click to Re-Sign</span>
                    </div>
                  </>
                ) : (
                  <div className="customer-sig-placeholder-content no-print">
                    <PenTool size={13} className="cust-sig-icon" />
                    <span className="cust-sig-text">Customer Digital Signature</span>
                    <span className="cust-sig-subtext">Click to sign / Date</span>
                  </div>
                )}
              </div>

              <div className="sign-title">
                {doc.customerSignatoryTitle || 'Authorized Customer Signature'}
              </div>
            </div>
          )}
        </div>

        {/* Right: Terms & Conditions & Authorized Seal */}
        <div className="invoice-terms-col">
          <div className="terms-card-header">
            <FileText size={15} className="terms-header-icon" />
            <h4>Terms & Conditions</h4>
          </div>

          <div className="terms-details-body">
            {doc.terms.map((term, idx) => (
              <div key={idx} className="term-line">{term}</div>
            ))}
          </div>

          <div className="invoice-signatory-wrap">
            <div className="sign-company-name">{doc.signatoryFor}</div>
            
            <div className="signature-graphics-box">
              {doc.showStamp ? (
                <img 
                  src="/invoice-authorized-sign.png" 
                  alt="Company Stamp & Signature" 
                  className="invoice-stamp-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <img 
                  src="/invoice-signature.png" 
                  alt="Authorized Signature" 
                  className="invoice-signature-only-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
            </div>

            <div className="sign-title">{doc.signatoryTitle}</div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner Pill */}
      <footer className="invoice-bottom-pill">
        <div className="pill-contact-links">
          <span>🌐 {doc.provider.website}</span>
          <span className="pill-sep">|</span>
          <span>✉ {doc.provider.email}</span>
          <span className="pill-sep">|</span>
          <span>☎ {doc.provider.phone}</span>
        </div>
        <div className="pill-brand-motto">
          ATTRACT &bull; ENGAGE &bull; GROW
        </div>
      </footer>
    </div>

    {/* Digital Signature Modal */}
    <CustomerSignatureModal
      isOpen={isCustModalOpen}
      onClose={() => setIsCustModalOpen(false)}
      onSave={(dataUrl) => {
        onCustomerSignatureChange?.(dataUrl);
      }}
      initialSignature={doc.customerSignatureData}
      customerName={doc.clientInfo.contactPerson || doc.clientInfo.customerName}
    />
  </>
  );
};
