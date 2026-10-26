import React from 'react';
import type { ClientInfo } from '../../types/document';

interface Props {
  clientInfo: ClientInfo;
  onChange: (updated: ClientInfo) => void;
}

export const Step1ClientInfo: React.FC<Props> = ({ clientInfo, onChange }) => {
  const handleChange = (field: keyof ClientInfo, val: string) => {
    onChange({ ...clientInfo, [field]: val });
  };

  return (
    <div className="wizard-step-pane">
      <div className="step-intro">
        <h3 className="step-title">Client & Corporate Particulars (V2.0)</h3>
        <p className="step-subtitle">
          Enter customer details once. They automatically populate the Master Agreement Cover, all attached Annexures, and execution blocks.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group col-span-2">
          <label className="form-label">Customer Brand / Hospital Name *</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="e.g. Kavety Multispeciality Hospital"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Legal Entity Name *</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.legalEntityName}
            onChange={(e) => handleChange('legalEntityName', e.target.value)}
            placeholder="e.g. Kavety Multispeciality Hospital Pvt. Ltd."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Customer CIN / GSTIN</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.customerCinGstin}
            onChange={(e) => handleChange('customerCinGstin', e.target.value)}
            placeholder="e.g. U85110AP2021PTC098765 / 37AABCK1234M1Z2"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Authorized Representative Name *</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.representativeName}
            onChange={(e) => handleChange('representativeName', e.target.value)}
            placeholder="e.g. Dr. Hanumanth Reddy"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Designation / Title *</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.representativeTitle}
            onChange={(e) => handleChange('representativeTitle', e.target.value)}
            placeholder="e.g. Owner / Managing Director"
          />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Registered Office Address</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={clientInfo.customerRegisteredAddress ?? clientInfo.address ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...clientInfo,
                customerRegisteredAddress: val,
                address: val
              });
            }}
            placeholder="e.g. Plot No. 42, Health City, Chinna Gadhili, Arilova, Visakhapatnam - 530040"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Formal Notice Email (Customer) *</label>
          <input
            type="email"
            className="form-input"
            value={clientInfo.noticeEmailCustomer}
            onChange={(e) => handleChange('noticeEmailCustomer', e.target.value)}
            placeholder="director@kavetyhospital.com"
          />
          <span className="field-hint">Used for contractual notices of breach, renewal & amendments</span>
        </div>

        <div className="form-group">
          <label className="form-label">Contact Phone</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Agreement Effective Date *</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.effectiveDate}
            onChange={(e) => handleChange('effectiveDate', e.target.value)}
            placeholder="e.g. 15th Day of August 2026"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Jurisdiction & Governing Law</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.jurisdiction}
            onChange={(e) => handleChange('jurisdiction', e.target.value)}
            placeholder="Visakhapatnam, Andhra Pradesh, India"
          />
        </div>

        <div className="form-divider col-span-2">
          <span>Service Provider Entity (sBLOOM V2.0)</span>
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Service Provider Legal Entity</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.serviceProviderName}
            onChange={(e) => handleChange('serviceProviderName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Provider CIN / GSTIN</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.providerCinGstin}
            onChange={(e) => handleChange('providerCinGstin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Provider Notice Email</label>
          <input
            type="text"
            className="form-input"
            value={clientInfo.noticeEmailProvider}
            onChange={(e) => handleChange('noticeEmailProvider', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
