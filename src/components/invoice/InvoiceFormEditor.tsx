import React, { useState } from 'react';
import type { InvoiceData, InvoiceItem } from '../../types/invoice';
import { formatInrWords } from '../../utils/numberToWords';
import { 
  Building2, 
  Receipt, 
  Landmark, 
  FileText, 
  Plus, 
  Trash2, 
  Calculator, 
  Sparkles,
  CheckCircle,
  PenTool,
  Info,
  X
} from 'lucide-react';
import { CustomerSignatureModal } from './CustomerSignatureModal';

interface Props {
  doc: InvoiceData;
  onChange: (updated: InvoiceData) => void;
}

export const InvoiceFormEditor: React.FC<Props> = ({ doc, onChange }) => {
  const [activeTab, setActiveTab] = useState<'client' | 'items' | 'payment' | 'terms'>('client');
  const [isCustSignModalOpen, setIsCustSignModalOpen] = useState<boolean>(false);

  // Helper to update client info
  const handleClientChange = (field: keyof InvoiceData['clientInfo'], value: string) => {
    onChange({
      ...doc,
      clientInfo: {
        ...doc.clientInfo,
        [field]: value
      }
    });
  };

  // Helper to update metadata
  const handleMetaChange = (field: keyof InvoiceData['meta'], value: string) => {
    onChange({
      ...doc,
      meta: {
        ...doc.meta,
        [field]: value
      }
    });
  };

  // Helper to update payment details
  const handlePaymentChange = (field: keyof InvoiceData['paymentDetails'], value: string) => {
    onChange({
      ...doc,
      paymentDetails: {
        ...doc.paymentDetails,
        [field]: value
      }
    });
  };

  // Recalculate totals across all items
  const recalculateAllTotals = (newItems: InvoiceItem[]) => {
    let subtotal = 0;
    let totalGst = 0;

    newItems.forEach((item) => {
      subtotal += item.taxableValue || 0;
      totalGst += item.gstAmount || 0;
    });

    const grandTotal = subtotal + totalGst;
    const halfGst = totalGst / 2;

    const updatedTotals = {
      subtotal,
      cgstPercent: totalGst > 0 ? 9 : 0,
      cgstAmount: halfGst,
      sgstPercent: totalGst > 0 ? 9 : 0,
      sgstAmount: halfGst,
      totalAmount: grandTotal,
      amountInWords: formatInrWords(grandTotal)
    };

    return updatedTotals;
  };

  // Update a specific line item
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...doc.items];
    const current = { ...updatedItems[index], [field]: value };

    // Auto-calculate taxable value and GST if rate or gstPercent changes
    if (field === 'rate' || field === 'gstPercent') {
      const rateVal = field === 'rate' ? Number(value) || 0 : current.rate;
      const gstPct = field === 'gstPercent' ? Number(value) || 0 : current.gstPercent;
      
      current.taxableValue = rateVal;
      current.gstAmount = (rateVal * gstPct) / 100;
      current.totalAmount = current.taxableValue + current.gstAmount;
    } else if (field === 'taxableValue') {
      const taxable = Number(value) || 0;
      current.taxableValue = taxable;
      current.gstAmount = (taxable * current.gstPercent) / 100;
      current.totalAmount = taxable + current.gstAmount;
    }

    updatedItems[index] = current;
    const newTotals = recalculateAllTotals(updatedItems);

    onChange({
      ...doc,
      items: updatedItems,
      totals: newTotals
    });
  };

  // Add a new line item
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      sNo: doc.items.length + 1,
      description: 'Digital Marketing & Social Media Management Services',
      qty: '1',
      rate: 15000,
      taxableValue: 15000,
      gstPercent: 0,
      gstAmount: 0,
      totalAmount: 15000
    };
    const updatedItems = [...doc.items, newItem];
    const newTotals = recalculateAllTotals(updatedItems);

    onChange({
      ...doc,
      items: updatedItems,
      totals: newTotals
    });
  };

  // Remove a line item
  const handleRemoveItem = (index: number) => {
    if (doc.items.length <= 1) {
      alert('Invoice must have at least one line item.');
      return;
    }
    const updatedItems = doc.items.filter((_, i) => i !== index).map((it, i) => ({
      ...it,
      sNo: i + 1
    }));
    const newTotals = recalculateAllTotals(updatedItems);

    onChange({
      ...doc,
      items: updatedItems,
      totals: newTotals
    });
  };

  return (
    <div className="invoice-editor-pane">
      {/* Editor Sub-Tabs Navigation */}
      <nav className="invoice-editor-tabs">
        <button
          type="button"
          className={`inv-tab-btn ${activeTab === 'client' ? 'active' : ''}`}
          onClick={() => setActiveTab('client')}
        >
          <Building2 size={15} />
          <span>1. Bill To & Details</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <Receipt size={15} />
          <span>2. Services Table</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <Landmark size={15} />
          <span>3. Bank & Payment</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          <FileText size={15} />
          <span>4. Notes & Terms</span>
        </button>
      </nav>

      {/* Tab 1: Client "Bill To" & Metadata (Matching Image 1) */}
      {activeTab === 'client' && (
        <div className="invoice-tab-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <Building2 size={16} className="text-primary-accent" />
              <h3>Bill To Information (Image 1)</h3>
            </div>
            <p className="form-section-hint">
              These fields map directly to the Client Details block on the invoice with editable underline styling.
            </p>

            <div className="form-grid-2col">
              <div className="form-field-group full-width">
                <label className="field-label">Customer / Hospital Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Vizag IVF Centre"
                  value={doc.clientInfo.customerName}
                  onChange={(e) => handleClientChange('customerName', e.target.value)}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="field-label">Primary Hospital Address</label>
                <textarea
                  className="form-textarea address-textarea"
                  rows={3}
                  placeholder="Street address, landmark, city, state and pincode"
                  value={doc.clientInfo.address}
                  onChange={(e) => handleClientChange('address', e.target.value)}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="field-label">
                  Billing Address & Branches (Underlined on Invoice)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Visakhapatnam, Gajuwaka, Vizianagaram, Srikakulam"
                  value={doc.clientInfo.branches}
                  onChange={(e) => handleClientChange('branches', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B. Sireesha Rani"
                  value={doc.clientInfo.contactPerson}
                  onChange={(e) => handleClientChange('contactPerson', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. Vizagivf@gmail.com"
                  value={doc.clientInfo.email}
                  onChange={(e) => handleClientChange('email', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +91 77026 36137"
                  value={doc.clientInfo.phone}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">GSTIN (if applicable)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. N/A or 15-digit GSTIN"
                  value={doc.clientInfo.gstin}
                  onChange={(e) => handleClientChange('gstin', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Andhra Pradesh"
                  value={doc.clientInfo.state}
                  onChange={(e) => handleClientChange('state', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Invoice Metadata Box */}
          <div className="form-section-card">
            <div className="form-section-header">
              <Receipt size={16} className="text-primary-accent" />
              <h3>Invoice Metadata & Dates</h3>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="field-label">Invoice Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={doc.meta.invoiceNo}
                  onChange={(e) => handleMetaChange('invoiceNo', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Invoice Date</label>
                <input
                  type="text"
                  className="form-input"
                  value={doc.meta.invoiceDate}
                  onChange={(e) => handleMetaChange('invoiceDate', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Service Period</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 01 Aug 2026 – 31 Aug 2026"
                  value={doc.meta.servicePeriod}
                  onChange={(e) => handleMetaChange('servicePeriod', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Payment Due Date</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 10th Sep 2026"
                  value={doc.meta.dueDate}
                  onChange={(e) => handleMetaChange('dueDate', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Place of Supply</label>
                <input
                  type="text"
                  className="form-input"
                  value={doc.meta.placeOfSupply}
                  onChange={(e) => handleMetaChange('placeOfSupply', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Reverse Charge</label>
                <select
                  className="form-input"
                  value={doc.meta.reverseCharge}
                  onChange={(e) => handleMetaChange('reverseCharge', e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Services & Line Items Table (Matching Image 2) */}
      {activeTab === 'items' && (
        <div className="invoice-tab-content">
          <div className="form-section-card">
            <div className="form-section-header-row">
              <div className="form-section-header">
                <Receipt size={16} className="text-primary-accent" />
                <h3>Itemized Services Table (Image 2)</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddItem}
              >
                <Plus size={14} /> Add Service Row
              </button>
            </div>
            <p className="form-section-hint">
              Configure line items, quantities, rates, and GST percentage. Taxable values and totals calculate automatically.
            </p>

            <div className="invoice-items-form-list">
              {doc.items.map((item, idx) => (
                <div key={item.id || idx} className="invoice-item-edit-card">
                  <div className="item-card-header">
                    <span className="item-badge">Line Item #{idx + 1}</span>
                    <button
                      type="button"
                      className="btn-trash-item"
                      onClick={() => handleRemoveItem(idx)}
                      title="Remove this service row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Description of Service</label>
                    <textarea
                      className="form-textarea desc-textarea"
                      rows={3}
                      placeholder="e.g. Website Development & Maintenance, Local SEO & Google Business Profile Management, Ads Management"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    />
                  </div>

                  <div className="form-grid-3col">
                    <div className="form-field-group">
                      <label className="field-label">Quantity / Remarks</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 4( considering four branches)"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Rate (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">GST Rate</label>
                      <select
                        className="form-input"
                        value={item.gstPercent}
                        onChange={(e) => handleItemChange(idx, 'gstPercent', Number(e.target.value))}
                      >
                        <option value={0}>0% (Tax Exempt / Nil)</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18% (Standard GST)</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>
                  </div>

                  <div className="item-computed-strip">
                    <div className="computed-item">
                      <span className="c-label">Taxable Value:</span>
                      <span className="c-val">₹{item.taxableValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="computed-item">
                      <span className="c-label">GST Amount:</span>
                      <span className="c-val">₹{item.gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="computed-item bold-c">
                      <span className="c-label">Row Total:</span>
                      <span className="c-val">₹{item.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations & Amount in Words Review */}
            <div className="totals-review-card">
              <div className="totals-review-header">
                <Calculator size={15} />
                <span>Calculated Invoice Summary</span>
              </div>

              <div className="totals-summary-grid">
                <div className="t-row">
                  <span>Subtotal:</span>
                  <strong>₹{doc.totals.subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="t-row">
                  <span>CGST ({doc.totals.cgstPercent}%):</span>
                  <strong>₹{doc.totals.cgstAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="t-row">
                  <span>SGST ({doc.totals.sgstPercent}%):</span>
                  <strong>₹{doc.totals.sgstAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="t-row grand-t-row">
                  <span>Grand Total:</span>
                  <span className="t-grand-val">₹{doc.totals.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="form-field-group" style={{ marginTop: '14px' }}>
                <div className="label-with-action">
                  <label className="field-label">Amount in Words</label>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => {
                      onChange({
                        ...doc,
                        totals: {
                          ...doc.totals,
                          amountInWords: formatInrWords(doc.totals.totalAmount)
                        }
                      });
                    }}
                  >
                    <Sparkles size={12} /> Auto-Generate INR Words
                  </button>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={doc.totals.amountInWords}
                  onChange={(e) => {
                    onChange({
                      ...doc,
                      totals: {
                        ...doc.totals,
                        amountInWords: e.target.value
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bank & Payment Details (Matching Image 3) */}
      {activeTab === 'payment' && (
        <div className="invoice-tab-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <Landmark size={16} className="text-primary-accent" />
              <h3>Payment & Bank Instructions (Image 3)</h3>
            </div>
            <p className="form-section-hint">
              These details are prominently presented in the bottom-left payment card of the invoice.
            </p>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="field-label">Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ICICI"
                  value={doc.paymentDetails.bankName}
                  onChange={(e) => handlePaymentChange('bankName', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Account Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MEDCY HEALTH TECH PRIVATE LIMITED"
                  value={doc.paymentDetails.accountName}
                  onChange={(e) => handlePaymentChange('accountName', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 631605013978"
                  value={doc.paymentDetails.accountNumber}
                  onChange={(e) => handlePaymentChange('accountNumber', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ICIC0006316"
                  value={doc.paymentDetails.ifscCode}
                  onChange={(e) => handlePaymentChange('ifscCode', e.target.value)}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="field-label">UPI ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. medcy89522.ibz@icici"
                  value={doc.paymentDetails.upiId}
                  onChange={(e) => handlePaymentChange('upiId', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notes, Terms & Signatory */}
      {activeTab === 'terms' && (
        <div className="invoice-tab-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <FileText size={16} className="text-primary-accent" />
              <h3>Invoice Notes</h3>
            </div>

            <div className="notes-editor-list">
              {doc.notes.map((note, idx) => (
                <div key={idx} className="form-field-group">
                  <label className="field-label">Note #{idx + 1}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={note}
                    onChange={(e) => {
                      const updated = [...doc.notes];
                      updated[idx] = e.target.value;
                      onChange({ ...doc, notes: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section-card">
            <div className="form-section-header">
              <FileText size={16} className="text-primary-accent" />
              <h3>Terms & Conditions</h3>
            </div>

            <div className="terms-editor-list">
              {doc.terms.map((term, idx) => (
                <div key={idx} className="form-field-group">
                  <label className="field-label">Condition #{idx + 1}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={term}
                    onChange={(e) => {
                      const updated = [...doc.terms];
                      updated[idx] = e.target.value;
                      onChange({ ...doc, terms: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section-card">
            <div className="form-section-header">
              <CheckCircle size={16} className="text-primary-accent" />
              <h3>Signatory & Authorization</h3>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="field-label">Company Entity Sign-Off</label>
                <input
                  type="text"
                  className="form-input"
                  value={doc.signatoryFor}
                  onChange={(e) => onChange({ ...doc, signatoryFor: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Signatory Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={doc.signatoryTitle}
                  onChange={(e) => onChange({ ...doc, signatoryTitle: e.target.value })}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="checkbox-label-wrap">
                  <input
                    type="checkbox"
                    checked={doc.showStamp}
                    onChange={(e) => onChange({ ...doc, showStamp: e.target.checked })}
                  />
                  <span>Display Official Medcy Health Tech Seal & Digital Signature</span>
                </label>
              </div>
            </div>

            {/* Customer Digital Signature Placeholder (Togglable Add / Remove) */}
            <div className="editor-customer-sign-section">
              <div className="editor-customer-sign-header">
                <div className="cust-sign-head-info">
                  <div className="cust-sign-icon-wrap">
                    <PenTool size={16} />
                  </div>
                  <div>
                    <h4>Customer Digital Signature Placeholder</h4>
                    <p>Provide a designated client acceptance & digital signature box on the invoice</p>
                  </div>
                </div>

                <div className="cust-sign-toggle-action">
                  <label className="switch-toggle-btn">
                    <input
                      type="checkbox"
                      checked={!!doc.showCustomerSignature}
                      onChange={(e) => onChange({ ...doc, showCustomerSignature: e.target.checked })}
                    />
                    <span className="switch-slider"></span>
                  </label>
                  <span className="toggle-label-text">
                    {doc.showCustomerSignature ? 'Active on Invoice' : 'Disabled'}
                  </span>
                </div>
              </div>

              {doc.showCustomerSignature ? (
                <div className="editor-customer-sign-body">
                  <div className="form-grid-2col">
                    <div className="form-field-group">
                      <label className="field-label">Customer Sign-Off Label</label>
                      <input
                        type="text"
                        className="form-input"
                        value={doc.customerSignatoryLabel ?? (doc.clientInfo.customerName ? `For ${doc.clientInfo.customerName}` : 'Customer Acceptance')}
                        onChange={(e) => onChange({ ...doc, customerSignatoryLabel: e.target.value })}
                        placeholder="e.g. For Vizag IVF Centre"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Customer Designation / Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={doc.customerSignatoryTitle ?? 'Authorized Customer Signature'}
                        onChange={(e) => onChange({ ...doc, customerSignatoryTitle: e.target.value })}
                        placeholder="e.g. Authorized Customer Signature"
                      />
                    </div>
                  </div>

                  {/* Quick One-Click Signature Presets */}
                  <div className="cust-sig-presets-row">
                    <span className="preset-label">
                      <Sparkles size={12} className="text-primary" />
                      <span>Quick Signature Presets:</span>
                    </span>
                    <div className="preset-pill-group">
                      <button
                        type="button"
                        className={`btn-sig-preset-pill ${doc.customerSignatureData === '/customer-signature-radhika.png' ? 'active' : ''}`}
                        onClick={() => onChange({
                          ...doc,
                          customerSignatureData: '/customer-signature-radhika.png',
                          customerSignatoryTitle: doc.customerSignatoryTitle || 'Authorized Customer Signature'
                        })}
                        title="Directly apply B. Radhika transparent signature"
                      >
                        <img src="/customer-signature-radhika.png" alt="B. Radhika" className="preset-pill-img" />
                        <span>B. Radhika</span>
                      </button>

                      <button
                        type="button"
                        className={`btn-sig-preset-pill ${doc.customerSignatureData === '/invoice-signature.png' ? 'active' : ''}`}
                        onClick={() => onChange({
                          ...doc,
                          customerSignatureData: '/invoice-signature.png'
                        })}
                        title="Directly apply Executive transparent signature"
                      >
                        <img src="/invoice-signature.png" alt="Executive Sign" className="preset-pill-img" />
                        <span>Executive Sign</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="cust-sig-bar-wrap">
                    <div className="cust-sig-status-badge">
                      {doc.customerSignatureData ? (
                        <span className="status-pill status-signed">
                          <CheckCircle size={13} /> Digitally Signed
                        </span>
                      ) : (
                        <span className="status-pill status-placeholder">
                          <Info size={13} /> Blank Placeholder Box (Ready to Sign)
                        </span>
                      )}
                    </div>

                    <div className="cust-sig-btn-group">
                      <button
                        type="button"
                        className="btn-cust-action btn-sign"
                        onClick={() => setIsCustSignModalOpen(true)}
                      >
                        <PenTool size={13} />
                        <span>{doc.customerSignatureData ? 'Edit / Re-Sign' : 'Sign Digitally'}</span>
                      </button>

                      {doc.customerSignatureData && (
                        <button
                          type="button"
                          className="btn-cust-action btn-clear"
                          onClick={() => onChange({ ...doc, customerSignatureData: '' })}
                          title="Reset to blank placeholder box"
                        >
                          <Trash2 size={13} />
                          <span>Clear Signature</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-cust-action btn-remove-box"
                        onClick={() => onChange({ ...doc, showCustomerSignature: false })}
                        title="Remove customer signature placeholder from document"
                      >
                        <X size={13} />
                        <span>Remove Placeholder</span>
                      </button>
                    </div>
                  </div>

                  {/* Signature preview if signed */}
                  {doc.customerSignatureData && (
                    <div className="cust-sig-thumb-preview">
                      <span className="thumb-label">Current Digital Signature:</span>
                      <div className="thumb-frame">
                        <img src={doc.customerSignatureData} alt="Customer Signature Preview" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="editor-customer-sign-empty">
                  <p>No customer signature placeholder currently on the invoice.</p>
                  <button
                    type="button"
                    className="btn-add-cust-placeholder"
                    onClick={() => onChange({ ...doc, showCustomerSignature: true })}
                  >
                    <Plus size={14} />
                    <span>Add Customer Signature Placeholder</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Modal */}
      <CustomerSignatureModal
        isOpen={isCustSignModalOpen}
        onClose={() => setIsCustSignModalOpen(false)}
        onSave={(dataUrl) => {
          onChange({
            ...doc,
            customerSignatureData: dataUrl
          });
        }}
        initialSignature={doc.customerSignatureData}
        customerName={doc.clientInfo.contactPerson || doc.clientInfo.customerName}
      />
    </div>
  );
};
