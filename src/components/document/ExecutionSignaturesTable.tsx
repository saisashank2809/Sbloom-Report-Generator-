import React from 'react';
import type { DocumentData } from '../../types/document';
import { PenTool, Stamp } from 'lucide-react';

interface Props {
  doc: DocumentData;
  providerHeader?: string;
  customerHeader?: string;
  signatureLabel?: string;
  onCustomerSignatureClick?: () => void;
  onProviderStampClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const ExecutionSignaturesTable: React.FC<Props> = ({
  doc,
  providerHeader = 'Provider approval',
  customerHeader = 'Customer approval',
  signatureLabel = 'Signature / written acceptance:',
  onCustomerSignatureClick,
  onProviderStampClick,
  style,
  className = ''
}) => {
  const { clientInfo } = doc;
  const showProvider = doc.showProviderStamp !== false;
  const showCustomer = doc.showCustomerSignature !== false;
  const customerSig = doc.customerSignatureData;
  const providerSig = doc.providerSignatureData || '/invoice-authorized-sign.png';

  return (
    <table 
      className={`doc-table doc-execution-table doc-modern-sig-table ${className}`} 
      style={{ marginTop: '16px', ...style }}
    >
      <thead>
        <tr>
          <th style={{ width: '50%' }}>{providerHeader}</th>
          <th style={{ width: '50%' }}>{customerHeader}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Name / title: <strong>{clientInfo.serviceProviderRep}</strong> ({clientInfo.serviceProviderTitle})
          </td>
          <td>
            Name / title: <strong>{clientInfo.representativeName}</strong> ({clientInfo.representativeTitle})
          </td>
        </tr>
        <tr>
          {/* Provider Signature & Stamp Column */}
          <td className="doc-execution-sig-cell">
            <div 
              className={`doc-sig-stamp-container doc-provider-sig-target is-clickable`}
              onClick={onProviderStampClick}
              title="Click to choose between official provider stamps and signatures"
            >
              {showProvider ? (
                <div className="doc-provider-stamp-box">
                  <img 
                    src={providerSig} 
                    alt="Provider Official Seal & Signature" 
                    className="doc-provider-stamp-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="doc-sig-hover-tag doc-provider-hover-tag no-print">
                    <span>Choose Signature</span>
                  </div>
                </div>
              ) : (
                <div className="doc-sig-interactive-placeholder doc-provider-placeholder no-print">
                  <Stamp size={13} className="doc-sig-icon" />
                  <span className="doc-sig-action-text">Provider Official Stamp</span>
                  <span className="doc-sig-sub-action">Click to choose signature / stamp</span>
                </div>
              )}
            </div>
            <div className="sig-line"></div>
            <div className="doc-sig-caption-text">{signatureLabel}</div>
          </td>

          {/* Customer Signature Column */}
          <td className="doc-execution-sig-cell">
            <div 
              className={`doc-sig-stamp-container doc-cust-sig-target ${showCustomer ? 'is-clickable' : ''}`}
              onClick={showCustomer ? onCustomerSignatureClick : undefined}
              title={showCustomer ? (customerSig ? "Click to change or re-sign" : "Click to sign digitally") : undefined}
            >
              {showCustomer ? (
                customerSig ? (
                  <div className="doc-customer-sig-box">
                    <img 
                      src={customerSig} 
                      alt="Customer Signature" 
                      className="doc-customer-sig-img"
                    />
                    <div className="doc-sig-hover-tag no-print">
                      <span>Click to Re-Sign</span>
                    </div>
                  </div>
                ) : (
                  <div className="doc-sig-interactive-placeholder no-print">
                    <PenTool size={13} className="doc-sig-icon" />
                    <span className="doc-sig-action-text">Customer Digital Signature</span>
                    <span className="doc-sig-sub-action">Click to sign / Stamp</span>
                  </div>
                )
              ) : (
                <div className="doc-sig-empty-space" />
              )}
            </div>
            <div className="sig-line"></div>
            <div className="doc-sig-caption-text">{signatureLabel}</div>
          </td>
        </tr>
        <tr>
          <td>Date: {clientInfo.effectiveDate}</td>
          <td>Date: {clientInfo.effectiveDate}</td>
        </tr>
      </tbody>
    </table>
  );
};

