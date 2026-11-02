import React from 'react';
import { 
  FileText, 
  Receipt, 
  ArrowRight, 
  Sparkles, 
  PlusCircle, 
  RotateCcw,
  ShieldCheck,
  Building2,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onSelectTemplate: (template: 'agreement' | 'invoice') => void;
  onNewBlankAgreement: () => void;
  onLoadAgreementDemo: () => void;
  onNewBlankInvoice: () => void;
  onLoadInvoiceDemo: () => void;
}

export const TemplateHub: React.FC<Props> = ({
  onSelectTemplate,
  onNewBlankAgreement,
  onLoadAgreementDemo,
  onNewBlankInvoice,
  onLoadInvoiceDemo
}) => {
  return (
    <div className="template-hub-container">
      {/* Hero Welcome Header */}
      <div className="template-hub-hero">
        <div className="hub-brand-badge">
          <Sparkles size={16} className="text-primary-accent" />
          <span>sBLOOM Document Studio</span>
        </div>
        <h1 className="hub-hero-title">Document & Invoice Workspace</h1>
        <p className="hub-hero-subtitle">
          Select a template below to draft client agreements or generate billing invoices with real-time preview and A4 print export.
        </p>
      </div>

      {/* Template Cards Grid */}
      <div className="template-cards-grid">
        {/* Template Card 1: Master Service Agreement */}
        <div className="template-card msa-card">
          <div className="template-card-top">
            <div className="template-icon-wrapper msa-icon">
              <FileText size={28} />
            </div>
            <span className="template-category-badge">Legal Contract</span>
          </div>

          <h2 className="template-title">Master Services Agreement (MSA) & SOW</h2>
          <p className="template-desc">
            Complete multi-page service contract with modular annexures (Social Media, GBP, Paid Ads, Website, SEO, SOW Schedule, and Onboarding Checklist).
          </p>

          <ul className="template-feature-list">
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Full 8-page Master Agreement backbone & terms</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Modular Annexures A through G with auto-numbering</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Commercial pricing engine with complimentary GBP rule</span>
            </li>
          </ul>

          <div className="template-actions-group">
            <button
              type="button"
              className="hub-btn hub-btn-primary"
              onClick={() => onSelectTemplate('agreement')}
            >
              <span>Open Agreement</span>
              <ArrowRight size={16} />
            </button>

            <div className="hub-btn-row">
              <button
                type="button"
                className="hub-btn hub-btn-secondary"
                onClick={onNewBlankAgreement}
                title="Start with fresh empty fields"
              >
                <PlusCircle size={15} />
                <span>New Blank</span>
              </button>
              <button
                type="button"
                className="hub-btn hub-btn-secondary"
                onClick={onLoadAgreementDemo}
                title="Load Kavety Multispeciality Hospital sample"
              >
                <RotateCcw size={15} />
                <span>Load Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 2: Tax Invoice */}
        <div className="template-card invoice-card">
          <div className="template-card-top">
            <div className="template-icon-wrapper invoice-icon">
              <Receipt size={28} />
            </div>
            <span className="template-category-badge invoice-badge">Billing & Finance</span>
          </div>

          <h2 className="template-title">Tax Invoice Generator</h2>
          <p className="template-desc">
            Single-page A4 commercial invoice formatted for healthcare clients, replicating the official Medcy Health Tech / sBLOOM invoice layout.
          </p>

          <ul className="template-feature-list">
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Editable Client "Bill To" & branch locations</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Dynamic services table, rates & auto-GST calculation</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-check-icon" />
              <span>Payment bank details, INR words & digital seal</span>
            </li>
          </ul>

          <div className="template-actions-group">
            <button
              type="button"
              className="hub-btn hub-btn-primary invoice-btn-primary"
              onClick={() => onSelectTemplate('invoice')}
            >
              <span>Open Tax Invoice</span>
              <ArrowRight size={16} />
            </button>

            <div className="hub-btn-row">
              <button
                type="button"
                className="hub-btn hub-btn-secondary"
                onClick={onNewBlankInvoice}
                title="Start a fresh empty invoice"
              >
                <PlusCircle size={15} />
                <span>New Blank</span>
              </button>
              <button
                type="button"
                className="hub-btn hub-btn-secondary"
                onClick={onLoadInvoiceDemo}
                title="Load Vizag IVF Centre sample invoice"
              >
                <RotateCcw size={15} />
                <span>Load Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Trust Footer */}
      <div className="template-hub-footer">
        <div className="hub-trust-item">
          <ShieldCheck size={18} />
          <span>Local Persistence: Auto-saves drafts safely in browser storage</span>
        </div>
        <div className="hub-trust-item">
          <Building2 size={18} />
          <span>Print Ready: Precise A4 layout for instant PDF export</span>
        </div>
        <div className="hub-trust-item">
          <Percent size={18} />
          <span>WYSIWYG: Direct click-to-edit mode supported on all documents</span>
        </div>
      </div>
    </div>
  );
};

