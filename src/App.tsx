import { useState, useEffect, useRef } from 'react';
import type { DocumentData } from './types/document';
import type { InvoiceData } from './types/invoice';
import { DEFAULT_DOCUMENT_DATA } from './config/offerings.config';
import { DEFAULT_INVOICE_DATA, BLANK_INVOICE_DATA } from './config/invoice.config';
import { Step1ClientInfo } from './components/wizard/Step1ClientInfo';
import { Step2Offerings } from './components/wizard/Step2Offerings';
import { Step3OfferingDetails } from './components/wizard/Step3OfferingDetails';
import { Step4Review } from './components/wizard/Step4Review';
import { DocumentContainer } from './components/document/DocumentContainer';
import { TemplateHub } from './components/hub/TemplateHub';
import { InvoiceFormEditor } from './components/invoice/InvoiceFormEditor';
import { InvoiceDocument } from './components/invoice/InvoiceDocument';
import { 
  FileText, 
  Receipt,
  Columns, 
  Eye, 
  Printer, 
  Download, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Moon,
  Sun,
  Edit3,
  Unlock,
  Lock,
  RefreshCw,
  LayoutGrid,
  PlusCircle,
  PenTool,
  Stamp,
  ChevronDown
} from 'lucide-react';
import { CustomerSignatureModal } from './components/invoice/CustomerSignatureModal';
import { ProviderSignatureModal } from './components/document/ProviderSignatureModal';

const STORAGE_KEY_MSA = 'sbloom_document_state_v1';
const STORAGE_KEY_INVOICE = 'sbloom_invoice_state_v1';
const TEMPLATE_KEY = 'sbloom_active_template';
const THEME_KEY = 'sbloom_theme_mode';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(THEME_KEY) === 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Active Template Mode: 'hub' (Blank / Starting Page), 'agreement', or 'invoice'
  const [activeTemplate, setActiveTemplate] = useState<'hub' | 'agreement' | 'invoice'>(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    if (saved === 'agreement' || saved === 'invoice') {
      return saved;
    }
    return 'hub'; // Default to clean template hub on start
  });

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, activeTemplate);
  }, [activeTemplate]);

  // Master Agreement (MSA) State
  const [doc, setDoc] = useState<DocumentData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MSA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved MSA state:', e);
    }
    return DEFAULT_DOCUMENT_DATA;
  });

  // Tax Invoice State
  const [invoiceDoc, setInvoiceDoc] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved invoice state:', e);
    }
    return DEFAULT_INVOICE_DATA;
  });

  // UI state for dual-pane views
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'form' | 'preview'>('split');
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const [previewResetKey, setPreviewResetKey] = useState<number>(0);
  const [agreementCustModalOpen, setAgreementCustModalOpen] = useState<boolean>(false);
  const [providerModalOpen, setProviderModalOpen] = useState<boolean>(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState<boolean>(false);
  const providerDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close provider dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(e.target as Node)) {
        setProviderDropdownOpen(false);
      }
    };
    if (providerDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [providerDropdownOpen]);

  const getProviderStampBtnText = () => {
    if (doc.showProviderStamp === false) return '+ Provider Stamp';
    if (doc.providerSignatureData === '/invoice-signature.png') return 'Provider Sign';
    if (doc.providerSignatureData === '/invoice-stamp.png') return 'Provider Seal';
    return 'Provider Stamp';
  };

  // Auto-save MSA to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MSA, JSON.stringify(doc));
    } catch (e) {
      console.error('LocalStorage MSA save error:', e);
    }
  }, [doc]);

  // Auto-save Invoice to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INVOICE, JSON.stringify(invoiceDoc));
    } catch (e) {
      console.error('LocalStorage Invoice save error:', e);
    }
  }, [invoiceDoc]);

  // Print triggered from browser
  const handlePrint = () => {
    window.print();
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const isMsa = activeTemplate === 'agreement';
    const currentData = isMsa ? doc : invoiceDoc;
    const clientName = isMsa 
      ? doc.clientInfo.customerName || 'sbloom_client'
      : invoiceDoc.clientInfo.customerName || 'vizag_ivf_client';
    const docTypeLabel = isMsa ? 'Agreement' : 'TaxInvoice';

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const filename = `${clientName.replace(/\s+/g, '_')}_${docTypeLabel}_${new Date().toISOString().split('T')[0]}.json`;
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Reset to Demo
  const handleResetToDemo = () => {
    if (activeTemplate === 'agreement') {
      if (window.confirm('Reset Master Agreement form to sample demonstration data (Kavety Multispeciality Hospital)?')) {
        setDoc(DEFAULT_DOCUMENT_DATA);
        setActiveStep(1);
      }
    } else {
      if (window.confirm('Reset Tax Invoice to sample demonstration data (Vizag IVF Centre)?')) {
        setInvoiceDoc(DEFAULT_INVOICE_DATA);
      }
    }
  };

  // Start New Blank Document
  const handleNewBlank = () => {
    if (activeTemplate === 'agreement') {
      if (window.confirm('Clear all fields to create a fresh new agreement?')) {
        const blank: DocumentData = {
          ...DEFAULT_DOCUMENT_DATA,
          id: `doc-${Date.now()}`,
          clientInfo: {
            ...DEFAULT_DOCUMENT_DATA.clientInfo,
            customerName: '',
            legalEntityName: '',
            representativeName: '',
            representativeTitle: '',
            customerRegisteredAddress: '',
            address: '',
            phone: '',
            email: '',
            effectiveDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          },
          selectedOfferings: {
            socialMedia: true,
            gbp: true,
            paidAds: false,
            website: false,
            seo: false,
            onboardingChecklist: true
          }
        };
        setDoc(blank);
        setActiveStep(1);
      }
    } else {
      if (window.confirm('Clear all fields to create a fresh new tax invoice?')) {
        setInvoiceDoc({
          ...BLANK_INVOICE_DATA,
          id: `inv-${Date.now()}`
        });
      }
    }
  };

  // Template Hub Actions
  const handleHubSelect = (template: 'agreement' | 'invoice') => {
    setActiveTemplate(template);
    setIsLiveEditMode(false);
  };

  const handleHubNewBlankAgreement = () => {
    const blank: DocumentData = {
      ...DEFAULT_DOCUMENT_DATA,
      id: `doc-${Date.now()}`,
      clientInfo: {
        ...DEFAULT_DOCUMENT_DATA.clientInfo,
        customerName: '',
        legalEntityName: '',
        representativeName: '',
        representativeTitle: '',
        customerRegisteredAddress: '',
        address: '',
        phone: '',
        email: '',
        effectiveDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      }
    };
    setDoc(blank);
    setActiveStep(1);
    setActiveTemplate('agreement');
  };

  const handleHubLoadAgreementDemo = () => {
    setDoc(DEFAULT_DOCUMENT_DATA);
    setActiveStep(1);
    setActiveTemplate('agreement');
  };

  const handleHubNewBlankInvoice = () => {
    setInvoiceDoc({
      ...BLANK_INVOICE_DATA,
      id: `inv-${Date.now()}`
    });
    setActiveTemplate('invoice');
  };

  const handleHubLoadInvoiceDemo = () => {
    setInvoiceDoc(DEFAULT_INVOICE_DATA);
    setActiveTemplate('invoice');
  };

  return (
    <div className={`sbloom-app-root ${isDark ? 'dark-theme' : ''}`}>
      {/* 1. INITIAL BLANK / TEMPLATE SELECTION HUB */}
      {activeTemplate === 'hub' ? (
        <div>
          {/* Minimal Top Bar in Hub */}
          <header className="app-header">
            <div className="brand-wrapper">
              <img src="/sbloom-logo.jpg" alt="sBLOOM" className="header-logo-img" />
              <div className="app-title-group">
                <h1>sBLOOM Document Studio</h1>
                <p>Master Contracts & Healthcare Tax Invoices</p>
              </div>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={() => setIsDark((prev) => !prev)}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun size={15} className="text-warning" /> : <Moon size={15} />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </header>

          <main>
            <TemplateHub
              onSelectTemplate={handleHubSelect}
              onNewBlankAgreement={handleHubNewBlankAgreement}
              onLoadAgreementDemo={handleHubLoadAgreementDemo}
              onNewBlankInvoice={handleHubNewBlankInvoice}
              onLoadInvoiceDemo={handleHubLoadInvoiceDemo}
            />
          </main>
        </div>
      ) : (
        /* 2. DOCUMENT WORKSPACE (AGREEMENT OR INVOICE) */
        <div>
          {/* Top Application Bar */}
          <header className="app-header no-print">
            {/* Zone 1: Branding, Hub Navigation & Document Switcher */}
            <div className="header-left-zone">
              <div 
                className="brand-logo-container" 
                onClick={() => setActiveTemplate('hub')} 
                title="Return to Templates Hub"
              >
                <img src="/sbloom-logo.jpg" alt="sBLOOM" className="header-logo-img" />
              </div>

              <button
                type="button"
                className="btn-hub-nav"
                onClick={() => setActiveTemplate('hub')}
                title="Return to Template Hub"
              >
                <LayoutGrid size={14} />
                <span>Hub</span>
              </button>

              <span className="header-vertical-divider" />

              {/* Document Segmented Switcher */}
              <div className="doc-segmented-switcher">
                <button
                  type="button"
                  className={`doc-seg-btn ${activeTemplate === 'agreement' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTemplate('agreement');
                    setIsLiveEditMode(false);
                  }}
                  title="Switch to Master Service Agreement & SOW"
                >
                  <FileText size={13} />
                  <span>Agreement & SOW</span>
                </button>

                <button
                  type="button"
                  className={`doc-seg-btn ${activeTemplate === 'invoice' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTemplate('invoice');
                    setIsLiveEditMode(false);
                  }}
                  title="Switch to Tax Invoice Generator"
                >
                  <Receipt size={13} />
                  <span>Tax Invoice</span>
                </button>
              </div>
            </div>

            {/* Zone 2: Workspace View Toggle (Form / Split / Preview) */}
            <div className="header-center-zone">
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'form' ? 'active' : ''}`}
                  onClick={() => setViewMode('form')}
                  title="Form Wizard Only"
                >
                  <FileText size={13} />
                  <span>Form</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
                  onClick={() => setViewMode('split')}
                  title="Side-by-Side Dual View"
                >
                  <Columns size={13} />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setViewMode('preview')}
                  title="Document Preview Only"
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Zone 3: Document Actions & Primary Export */}
            <div className="header-right-zone">
              {/* Document Actions Group: Sample, New, Save */}
              <div className="header-btn-group">
                <button
                  type="button"
                  className="btn-header-tool"
                  onClick={handleResetToDemo}
                  title="Load Demonstration Sample Data"
                >
                  <RotateCcw size={13} />
                  <span>Sample</span>
                </button>

                <button
                  type="button"
                  className="btn-header-tool"
                  onClick={handleNewBlank}
                  title="Clear fields to start a new blank document"
                >
                  <PlusCircle size={13} />
                  <span>New</span>
                </button>

                <button
                  type="button"
                  className="btn-header-tool"
                  onClick={handleExportJson}
                  title="Download JSON draft backup"
                >
                  <Download size={13} />
                  <span>{saveToast ? 'Saved!' : 'Save'}</span>
                </button>

                {activeTemplate === 'invoice' && (
                  <button
                    type="button"
                    className={`btn-header-tool btn-header-cust-sign ${invoiceDoc.showCustomerSignature ? 'active' : ''}`}
                    onClick={() => setInvoiceDoc((prev) => ({ 
                      ...prev, 
                      showCustomerSignature: !prev.showCustomerSignature 
                    }))}
                    title={invoiceDoc.showCustomerSignature ? "Remove Customer Signature from Invoice" : "Add Customer Signature to Invoice"}
                  >
                    <PenTool size={13} />
                    <span>{invoiceDoc.showCustomerSignature ? 'Client Sign' : '+ Client Sign'}</span>
                  </button>
                )}

                {activeTemplate === 'agreement' && (
                  <>
                    <div className="header-stamp-dropdown-wrap" ref={providerDropdownRef}>
                      <button
                        type="button"
                        className={`btn-header-tool btn-header-stamp ${doc.showProviderStamp !== false ? 'active' : ''}`}
                        onClick={() => setProviderDropdownOpen(prev => !prev)}
                        title="Choose between provider stamps and signatures"
                      >
                        <Stamp size={13} />
                        <span>{getProviderStampBtnText()}</span>
                        <ChevronDown size={11} className={`header-dropdown-chevron ${providerDropdownOpen ? 'open' : ''}`} />
                      </button>

                      {providerDropdownOpen && (
                        <div className="header-stamp-menu">
                          <div className="header-stamp-menu-header">Choose Provider Signature / Stamp</div>
                          
                          <button 
                            type="button" 
                            className={`header-stamp-menu-item ${doc.showProviderStamp !== false && (!doc.providerSignatureData || doc.providerSignatureData === '/invoice-authorized-sign.png') ? 'active' : ''}`}
                            onClick={() => {
                              setDoc(prev => ({ ...prev, showProviderStamp: true, providerSignatureData: '/invoice-authorized-sign.png' }));
                              setProviderDropdownOpen(false);
                            }}
                          >
                            <span className="stamp-item-icon">🏢</span>
                            <div className="stamp-item-text">
                              <strong>Stamp & Signature (Composite)</strong>
                              <small>Director Seal + Bhanu Prasad Bonu Signature</small>
                            </div>
                            {doc.showProviderStamp !== false && (!doc.providerSignatureData || doc.providerSignatureData === '/invoice-authorized-sign.png') && <Check size={14} className="stamp-item-check" />}
                          </button>

                          <button 
                            type="button" 
                            className={`header-stamp-menu-item ${doc.showProviderStamp !== false && doc.providerSignatureData === '/invoice-signature.png' ? 'active' : ''}`}
                            onClick={() => {
                              setDoc(prev => ({ ...prev, showProviderStamp: true, providerSignatureData: '/invoice-signature.png' }));
                              setProviderDropdownOpen(false);
                            }}
                          >
                            <span className="stamp-item-icon">✍️</span>
                            <div className="stamp-item-text">
                              <strong>Executive Signature Only</strong>
                              <small>Bhanu Prasad Bonu (Royal Blue Pen)</small>
                            </div>
                            {doc.showProviderStamp !== false && doc.providerSignatureData === '/invoice-signature.png' && <Check size={14} className="stamp-item-check" />}
                          </button>

                          <button 
                            type="button" 
                            className={`header-stamp-menu-item ${doc.showProviderStamp !== false && doc.providerSignatureData === '/invoice-stamp.png' ? 'active' : ''}`}
                            onClick={() => {
                              setDoc(prev => ({ ...prev, showProviderStamp: true, providerSignatureData: '/invoice-stamp.png' }));
                              setProviderDropdownOpen(false);
                            }}
                          >
                            <span className="stamp-item-icon">⭕</span>
                            <div className="stamp-item-text">
                              <strong>Official Seal Only</strong>
                              <small>Medcy Director Circular Ink Stamp</small>
                            </div>
                            {doc.showProviderStamp !== false && doc.providerSignatureData === '/invoice-stamp.png' && <Check size={14} className="stamp-item-check" />}
                          </button>

                          <div className="header-stamp-menu-divider" />

                          <button 
                            type="button" 
                            className="header-stamp-menu-item"
                            onClick={() => {
                              setProviderDropdownOpen(false);
                              setProviderModalOpen(true);
                            }}
                          >
                            <span className="stamp-item-icon">✨</span>
                            <div className="stamp-item-text">
                              <strong>Custom / Draw / Upload...</strong>
                              <small>Open full signature studio</small>
                            </div>
                          </button>

                          <button 
                            type="button" 
                            className={`header-stamp-menu-item text-danger ${doc.showProviderStamp === false ? 'active' : ''}`}
                            onClick={() => {
                              setDoc(prev => ({ ...prev, showProviderStamp: false }));
                              setProviderDropdownOpen(false);
                            }}
                          >
                            <span className="stamp-item-icon">🗑️</span>
                            <div className="stamp-item-text">
                              <strong>Blank Line (No Stamp)</strong>
                              <small>Leave line for manual signing</small>
                            </div>
                            {doc.showProviderStamp === false && <Check size={14} className="stamp-item-check" />}
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`btn-header-tool btn-header-cust-sign ${doc.showCustomerSignature !== false ? 'active' : ''}`}
                      onClick={() => setDoc((prev) => ({ 
                        ...prev, 
                        showCustomerSignature: prev.showCustomerSignature === false ? true : false 
                      }))}
                      title={doc.showCustomerSignature !== false ? "Remove Customer Signature from Agreement & SOW" : "Add Customer Signature to Agreement & SOW"}
                    >
                      <PenTool size={13} />
                      <span>{doc.showCustomerSignature !== false ? 'Client Sign' : '+ Client Sign'}</span>
                    </button>
                  </>
                )}
              </div>

              <span className="header-vertical-divider" />

              {/* WYSIWYG Direct Edit Toggle */}
              <button
                type="button"
                className={`btn-header-edit-toggle ${isLiveEditMode ? 'active' : ''}`}
                onClick={() => setIsLiveEditMode((prev) => !prev)}
                title={isLiveEditMode ? "Exit edit mode and lock document" : "Enable direct on-page editing"}
              >
                {isLiveEditMode ? <Unlock size={13} /> : <Edit3 size={13} />}
                <span>{isLiveEditMode ? 'Edit: ON' : 'Edit Text'}</span>
              </button>

              {/* Theme Toggle (Compact Icon Button) */}
              <button
                type="button"
                className="theme-icon-btn"
                onClick={() => setIsDark((prev) => !prev)}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={14} className="text-warning" /> : <Moon size={14} />}
              </button>

              <span className="header-vertical-divider" />

              {/* Primary CTA: Print / Export PDF */}
              <button
                type="button"
                className="btn-header-primary"
                onClick={handlePrint}
                title="Print or Export PDF"
              >
                <Printer size={14} />
                <span>Print / PDF</span>
              </button>
            </div>
          </header>

          {/* Main Dual-Column Content */}
          <main className={`app-layout ${viewMode}-view`}>
            {/* LEFT COLUMN: EDITOR */}
            <section className="editor-column">
              {activeTemplate === 'agreement' ? (
                /* MASTER AGREEMENT WIZARD */
                <>
                  <nav className="wizard-nav">
                    <button
                      type="button"
                      className={`wizard-nav-step ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}
                      onClick={() => setActiveStep(1)}
                    >
                      <div className="step-number">{activeStep > 1 ? <Check size={13} /> : '1'}</div>
                      <span className="step-label">Client Details</span>
                    </button>

                    <button
                      type="button"
                      className={`wizard-nav-step ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}
                      onClick={() => setActiveStep(2)}
                    >
                      <div className="step-number">{activeStep > 2 ? <Check size={13} /> : '2'}</div>
                      <span className="step-label">Select Offerings</span>
                    </button>

                    <button
                      type="button"
                      className={`wizard-nav-step ${activeStep === 3 ? 'active' : ''} ${activeStep > 3 ? 'completed' : ''}`}
                      onClick={() => setActiveStep(3)}
                    >
                      <div className="step-number">{activeStep > 3 ? <Check size={13} /> : '3'}</div>
                      <span className="step-label">Configure Scope</span>
                    </button>

                    <button
                      type="button"
                      className={`wizard-nav-step ${activeStep === 4 ? 'active' : ''}`}
                      onClick={() => setActiveStep(4)}
                    >
                      <div className="step-number">4</div>
                      <span className="step-label">Review & Totals</span>
                    </button>
                  </nav>

                  {/* Wizard Step Panes */}
                  {activeStep === 1 && (
                    <Step1ClientInfo
                      clientInfo={doc.clientInfo}
                      onChange={(updated) => setDoc({ ...doc, clientInfo: updated, updatedAt: new Date().toISOString() })}
                    />
                  )}

                  {activeStep === 2 && (
                    <Step2Offerings
                      selected={doc.selectedOfferings}
                      onChange={(updated) => setDoc({ ...doc, selectedOfferings: updated, updatedAt: new Date().toISOString() })}
                    />
                  )}

                  {activeStep === 3 && (
                    <Step3OfferingDetails
                      doc={doc}
                      onChange={(updated) => setDoc({ ...updated, updatedAt: new Date().toISOString() })}
                    />
                  )}

                  {activeStep === 4 && (
                    <Step4Review
                      doc={doc}
                      onPreviewClick={() => setViewMode('preview')}
                      onPrintClick={handlePrint}
                      onExportJson={handleExportJson}
                      onUpdateDoc={setDoc}
                      onOpenCustomerSigModal={() => setAgreementCustModalOpen(true)}
                      onOpenProviderStampModal={() => setProviderModalOpen(true)}
                    />
                  )}

                  {/* Footer Navigation */}
                  <div className="wizard-footer-nav">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    >
                      <ArrowLeft size={15} /> Back
                    </button>

                    {activeStep < 4 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                      >
                        Continue <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handlePrint}
                      >
                        <Printer size={15} /> Finalize & Print PDF
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* TAX INVOICE STRUCTURED FORM EDITOR */
                <InvoiceFormEditor
                  doc={invoiceDoc}
                  onChange={(updated) => setInvoiceDoc({ ...updated, updatedAt: new Date().toISOString() })}
                />
              )}
            </section>

            {/* RIGHT COLUMN: LIVE DOCUMENT PREVIEW */}
            <section className="preview-column">
              <div className="preview-toolbar no-print">
                <div className="preview-toolbar-left">
                  <button
                    type="button"
                    className={`preview-toolbar-btn ${isLiveEditMode ? 'active-edit' : ''}`}
                    onClick={() => setIsLiveEditMode((prev) => !prev)}
                    title={isLiveEditMode ? "Exit edit mode and lock document" : "Click to edit document text directly"}
                  >
                    {isLiveEditMode ? (
                      <>
                        <Unlock size={14} className="edit-active-icon" />
                        <span>Direct Edit Mode: <strong>ON</strong></span>
                      </>
                    ) : (
                      <>
                        <Edit3 size={14} />
                        <span>Direct Edit Mode</span>
                      </>
                    )}
                  </button>

                  {isLiveEditMode && (
                    <button
                      type="button"
                      className="preview-toolbar-btn btn-ghost-revert"
                      onClick={() => {
                        if (window.confirm('Discard manual text edits and re-sync document with form data?')) {
                          setPreviewResetKey((k) => k + 1);
                        }
                      }}
                      title="Revert manual text edits back to form values"
                    >
                      <RefreshCw size={13} /> Re-sync from Form
                    </button>
                  )}
                </div>

                <div className="preview-toolbar-right">
                  {isLiveEditMode ? (
                    <span className="live-edit-status-badge">
                      <span className="live-edit-pulse-dot"></span>
                      Click any field, table cell or line to edit directly
                    </span>
                  ) : (
                    <span className="preview-mode-hint">
                      <Lock size={13} /> {activeTemplate === 'agreement' ? 'MSA Contract' : 'A4 Tax Invoice'} (Print Ready)
                    </span>
                  )}
                </div>
              </div>

              {/* RENDER LIVE PREVIEW CANVAS */}
              {activeTemplate === 'agreement' ? (
                <DocumentContainer 
                  key={`msa-${previewResetKey}`} 
                  doc={doc} 
                  isEditable={isLiveEditMode} 
                  onCustomerSignatureChange={(sigData) => {
                    setDoc(prev => ({ ...prev, customerSignatureData: sigData }));
                  }}
                  onProviderSignatureChange={(sigData) => {
                    setDoc(prev => ({ ...prev, showProviderStamp: true, providerSignatureData: sigData }));
                  }}
                  onRemoveProviderSignature={() => {
                    setDoc(prev => ({ ...prev, showProviderStamp: false }));
                  }}
                />
              ) : (
                <InvoiceDocument 
                  key={`inv-${previewResetKey}`} 
                  doc={invoiceDoc} 
                  isEditable={isLiveEditMode}
                  onCustomerSignatureChange={(sigData) => {
                    setInvoiceDoc(prev => ({ ...prev, customerSignatureData: sigData }));
                  }}
                />
              )}
            </section>
          </main>
        </div>
      )}

      {/* Customer Signature Modal for Agreement Wizard */}
      <CustomerSignatureModal
        isOpen={agreementCustModalOpen}
        onClose={() => setAgreementCustModalOpen(false)}
        onSave={(sigDataUrl) => {
          setDoc(prev => ({ ...prev, customerSignatureData: sigDataUrl }));
        }}
        initialSignature={doc.customerSignatureData || '/customer-signature-radhika.png'}
        customerName={doc.clientInfo.representativeName || doc.clientInfo.customerName}
      />

      {/* Provider Stamp & Signature Modal for Agreement Wizard */}
      <ProviderSignatureModal
        isOpen={providerModalOpen}
        onClose={() => setProviderModalOpen(false)}
        onSave={(sigDataUrl) => {
          setDoc(prev => ({ ...prev, showProviderStamp: true, providerSignatureData: sigDataUrl }));
        }}
        onRemove={() => {
          setDoc(prev => ({ ...prev, showProviderStamp: false }));
        }}
        initialSignature={doc.providerSignatureData || '/invoice-authorized-sign.png'}
        providerName={`${doc.clientInfo.serviceProviderRep} (${doc.clientInfo.serviceProviderTitle})`}
      />
    </div>
  );
};

export default App;
