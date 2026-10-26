import { useState, useEffect } from 'react';
import type { DocumentData } from './types/document';
import { DEFAULT_DOCUMENT_DATA } from './config/offerings.config';
import { Step1ClientInfo } from './components/wizard/Step1ClientInfo';
import { Step2Offerings } from './components/wizard/Step2Offerings';
import { Step3OfferingDetails } from './components/wizard/Step3OfferingDetails';
import { Step4Review } from './components/wizard/Step4Review';
import { DocumentContainer } from './components/document/DocumentContainer';
import { 
  FileText, 
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
  RefreshCw
} from 'lucide-react';

const STORAGE_KEY = 'sbloom_document_state_v1';
const THEME_KEY = 'sbloom_theme_mode';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(THEME_KEY) === 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);
  // Load initial state from LocalStorage or fall back to default
  const [doc, setDoc] = useState<DocumentData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
    return DEFAULT_DOCUMENT_DATA;
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'form' | 'preview'>('split');
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const [previewResetKey, setPreviewResetKey] = useState<number>(0);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [doc]);

  const handleDocumentChange = (updated: DocumentData) => {
    setDoc({
      ...updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const filename = `${doc.clientInfo.customerName || 'sbloom_client'}_Agreement_${new Date().toISOString().split('T')[0]}.json`;
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetToDemo = () => {
    if (window.confirm('Reset form to the sample demonstration data (Kavety Multispeciality Hospital)?')) {
      setDoc(DEFAULT_DOCUMENT_DATA);
      setActiveStep(1);
    }
  };

  const handleNewBlank = () => {
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
  };

  return (
    <div className={`sbloom-app-root ${isDark ? 'dark-theme' : ''}`}>
      {/* Top Application Bar */}
      <header className="app-header">
        <div className="brand-wrapper">
          <img src="/sbloom-logo.jpg" alt="sBLOOM" className="header-logo-img" />
          <div className="app-title-group">
            <h1>Agreement & SOW Generator</h1>
            <p>Configurable Master Service Agreement & Modular Annexures</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'form' ? 'active' : ''}`}
            onClick={() => setViewMode('form')}
            title="Form Wizard Only"
          >
            <FileText size={15} /> Form
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Side-by-Side Dual View"
          >
            <Columns size={15} /> Split View
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
            title="Document Preview Only"
          >
            <Eye size={15} /> Preview
          </button>
        </div>

        {/* Header Actions */}
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

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetToDemo}
            title="Reset to Sample Data"
          >
            <RotateCcw size={15} /> Load Sample
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNewBlank}
            title="Start New Agreement"
          >
            New Document
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportJson}
          >
            <Download size={15} /> {saveToast ? 'Saved!' : 'Save Draft'}
          </button>
          <button
            type="button"
            className={`btn ${isLiveEditMode ? 'btn-live-edit-header active' : 'btn-secondary'}`}
            onClick={() => setIsLiveEditMode((prev) => !prev)}
            title={isLiveEditMode ? "Exit edit mode and lock document" : "Enable direct on-page editing"}
          >
            {isLiveEditMode ? <Unlock size={15} /> : <Edit3 size={15} />}
            <span>{isLiveEditMode ? 'Editing Mode: ON' : 'Edit Document Text'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <Printer size={15} /> Print / Export PDF
          </button>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className={`app-layout ${viewMode}-view`}>
        {/* Editor Column (Wizard) */}
        <section className="editor-column">
          {/* Step Indicator Bar */}
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
              onChange={(updated) => handleDocumentChange({ ...doc, clientInfo: updated })}
            />
          )}

          {activeStep === 2 && (
            <Step2Offerings
              selected={doc.selectedOfferings}
              onChange={(updated) => handleDocumentChange({ ...doc, selectedOfferings: updated })}
            />
          )}

          {activeStep === 3 && (
            <Step3OfferingDetails
              doc={doc}
              onChange={handleDocumentChange}
            />
          )}

          {activeStep === 4 && (
            <Step4Review
              doc={doc}
              onPreviewClick={() => setViewMode('preview')}
              onPrintClick={handlePrint}
              onExportJson={handleExportJson}
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
        </section>

        {/* Live Document Preview Column */}
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
                    if (window.confirm('Discard manual text edits and re-sync document with wizard form data?')) {
                      setPreviewResetKey((k) => k + 1);
                    }
                  }}
                  title="Revert manual text edits back to wizard form values"
                >
                  <RefreshCw size={13} /> Re-sync from Form
                </button>
              )}
            </div>

            <div className="preview-toolbar-right">
              {isLiveEditMode ? (
                <span className="live-edit-status-badge">
                  <span className="live-edit-pulse-dot"></span>
                  Click any line, clause, or table cell to edit directly
                </span>
              ) : (
                <span className="preview-mode-hint">
                  <Lock size={13} /> Preview Mode (Print Ready)
                </span>
              )}
            </div>
          </div>

          <DocumentContainer key={previewResetKey} doc={doc} isEditable={isLiveEditMode} />
        </section>
      </main>
    </div>
  );
};

export default App;
