import React, { useRef, useState, useEffect } from 'react';
import { X, PenTool, Type, Upload, Trash2, Check, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface CustomerSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  initialSignature?: string;
  customerName?: string;
  targetName?: string;
}

export const CustomerSignatureModal: React.FC<CustomerSignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSignature = '',
  customerName = 'Authorized Signatory',
  targetName = 'Document'
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'draw' | 'type' | 'upload'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>(
    initialSignature || '/customer-signature-radhika.png'
  );
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Royal blue default
  const [typedName, setTypedName] = useState<string>(customerName || 'Authorized Signatory');
  const [selectedFontStyle, setSelectedFontStyle] = useState<'cursive1' | 'cursive2' | 'formal'>('cursive1');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const hasDrawn = useRef<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle DPI scaling
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = penColor;

      // If initial signature exists, draw it
      if (initialSignature && !hasDrawn.current) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, (rect.width - 240) / 2, (rect.height - 100) / 2, 240, 100);
          hasDrawn.current = true;
        };
        img.src = initialSignature;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, penColor]);

  // Pointer event handlers for drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    hasDrawn.current = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = penColor;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    hasDrawn.current = false;
  };

  // Generate typed signature image data URL
  const generateTypedSignatureData = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, 500, 180);
    ctx.fillStyle = penColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (selectedFontStyle === 'cursive1') {
      ctx.font = 'italic 52px "Brush Script MT", "Caveat", "Segoe Script", cursive';
    } else if (selectedFontStyle === 'cursive2') {
      ctx.font = 'italic 46px "Dancing Script", "Lucida Handwriting", cursive';
    } else {
      ctx.font = 'italic 42px "Playfair Display", "Georgia", serif';
    }

    ctx.fillText(typedName || 'Customer Signature', 250, 85);

    // Subtle underline flourish
    ctx.beginPath();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.moveTo(110, 125);
    ctx.bezierCurveTo(200, 132, 320, 122, 390, 128);
    ctx.stroke();

    return canvas.toDataURL('image/png');
  };

  // Handle file upload with white-background removal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Process on hidden canvas to remove white background
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Make pure white/near white transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 210) {
            data[i + 3] = 0; // Transparent
          } else if (brightness > 170) {
            // Smooth alpha falloff
            data[i + 3] = Math.round(((210 - brightness) / 40) * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');
        setUploadPreview(transparentDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (activeTab === 'presets') {
      if (selectedPreset) {
        onSave(selectedPreset);
      }
    } else if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn.current) {
        onSave('');
        onClose();
        return;
      }
      onSave(canvas.toDataURL('image/png'));
    } else if (activeTab === 'type') {
      const typedData = generateTypedSignatureData();
      onSave(typedData);
    } else if (activeTab === 'upload') {
      if (uploadPreview) {
        onSave(uploadPreview);
      }
    }
    onClose();
  };

  const handleClear = () => {
    if (activeTab === 'draw') {
      clearCanvas();
    } else if (activeTab === 'type') {
      setTypedName('');
    } else if (activeTab === 'upload') {
      setUploadPreview(null);
    }
    onSave('');
  };

  if (!isOpen) return null;

  return (
    <div className="sig-modal-backdrop" onClick={onClose}>
      <div className="sig-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sig-modal-header">
          <div className="sig-modal-title-group">
            <div className="sig-modal-icon-badge">
              <PenTool size={18} />
            </div>
            <div>
              <h3>Customer Digital Signature</h3>
              <p>Sign digitally or choose a stamp for the {targetName}</p>
            </div>
          </div>
          <button className="sig-modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="sig-modal-tabs">
          <button 
            type="button"
            className={`sig-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Sparkles size={15} />
            <span>Saved Presets</span>
          </button>

          <button 
            type="button"
            className={`sig-tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            <PenTool size={15} />
            <span>Draw</span>
          </button>

          <button 
            type="button"
            className={`sig-tab-btn ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            <Type size={15} />
            <span>Type Name</span>
          </button>

          <button 
            type="button"
            className={`sig-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={15} />
            <span>Upload</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="sig-modal-body">
          {activeTab === 'presets' && (
            <div className="sig-presets-pane">
              <div className="sig-presets-instruction">
                Choose a pre-extracted, high-resolution transparent digital signature:
              </div>

              <div className="sig-preset-grid">
                {/* Preset 1: B. Radhika */}
                <div 
                  className={`sig-preset-card ${selectedPreset === '/customer-signature-radhika.png' ? 'active' : ''}`}
                  onClick={() => setSelectedPreset('/customer-signature-radhika.png')}
                  onDoubleClick={() => {
                    onSave('/customer-signature-radhika.png');
                    onClose();
                  }}
                >
                  <div className="sig-preset-badge">
                    {selectedPreset === '/customer-signature-radhika.png' && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="sig-preset-img-frame">
                    <img 
                      src="/customer-signature-radhika.png" 
                      alt="B. Radhika Signature" 
                      className="sig-preset-thumbnail"
                    />
                  </div>
                  <div className="sig-preset-meta">
                    <h4>B. Radhika</h4>
                    <p>Client / Customer Signatory (Royal Blue Pen)</p>
                  </div>
                  <button 
                    type="button"
                    className="btn-preset-choose"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave('/customer-signature-radhika.png');
                      onClose();
                    }}
                  >
                    Apply B. Radhika
                  </button>
                </div>

                {/* Preset 2: Executive Signature */}
                <div 
                  className={`sig-preset-card ${selectedPreset === '/invoice-signature.png' ? 'active' : ''}`}
                  onClick={() => setSelectedPreset('/invoice-signature.png')}
                  onDoubleClick={() => {
                    onSave('/invoice-signature.png');
                    onClose();
                  }}
                >
                  <div className="sig-preset-badge">
                    {selectedPreset === '/invoice-signature.png' && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="sig-preset-img-frame">
                    <img 
                      src="/invoice-signature.png" 
                      alt="Executive Signature" 
                      className="sig-preset-thumbnail"
                    />
                  </div>
                  <div className="sig-preset-meta">
                    <h4>Executive Signature</h4>
                    <p>Official Extracted Navy Pen Sign-Off</p>
                  </div>
                  <button 
                    type="button"
                    className="btn-preset-choose"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave('/invoice-signature.png');
                      onClose();
                    }}
                  >
                    Apply Executive Sign
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="sig-draw-pane">
              <div className="sig-canvas-toolbar">
                <div className="sig-color-options">
                  <span className="sig-tool-label">Ink:</span>
                  {[
                    { color: '#1e3a8a', label: 'Royal Blue' },
                    { color: '#0f172a', label: 'Navy Black' },
                    { color: '#000000', label: 'Pure Black' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      className={`sig-color-swatch ${penColor === c.color ? 'active' : ''}`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                      onClick={() => setPenColor(c.color)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="sig-clear-btn"
                  onClick={clearCanvas}
                >
                  <RefreshCw size={13} />
                  <span>Clear Pad</span>
                </button>
              </div>

              <div className="sig-canvas-wrapper">
                <canvas
                  ref={canvasRef}
                  className="sig-draw-canvas"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                />
                <div className="sig-baseline-guide">
                  <span>Sign on the line above</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="sig-type-pane">
              <div className="sig-type-input-wrap">
                <label>Signer Name or Initials</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter name to sign..."
                  className="sig-type-field"
                />
              </div>

              <div className="sig-type-styles">
                <label>Select Handwriting Script Style:</label>
                <div className="sig-style-grid">
                  {[
                    { id: 'cursive1', name: 'Script Brush', sample: typedName || 'Signature', font: 'italic 24px "Brush Script MT", cursive' },
                    { id: 'cursive2', name: 'Elegant Flow', sample: typedName || 'Signature', font: 'italic 22px "Dancing Script", cursive' },
                    { id: 'formal', name: 'Executive Calligraphy', sample: typedName || 'Signature', font: 'italic 20px "Playfair Display", serif' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className={`sig-style-card ${selectedFontStyle === st.id ? 'active' : ''}`}
                      onClick={() => setSelectedFontStyle(st.id as any)}
                    >
                      <div className="sig-style-sample" style={{ font: st.font, color: penColor }}>
                        {st.sample}
                      </div>
                      <span className="sig-style-name">{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="sig-upload-pane">
              <label className="sig-dropzone">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={32} className="sig-drop-icon" />
                <span className="sig-drop-main">Click or drop customer signature image here</span>
                <span className="sig-drop-sub">PNG, JPG with automatic white background removal</span>
              </label>

              {uploadPreview && (
                <div className="sig-upload-preview-box">
                  <div className="sig-preview-label">Signature Preview (Transparent):</div>
                  <div className="sig-preview-frame">
                    <img src={uploadPreview} alt="Uploaded signature preview" />
                  </div>
                  <button
                    type="button"
                    className="sig-clear-btn"
                    onClick={() => setUploadPreview(null)}
                  >
                    <Trash2 size={13} />
                    <span>Remove Upload</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sig-modal-footer">
          <button
            type="button"
            className="sig-btn-ghost"
            onClick={handleClear}
          >
            <Trash2 size={14} />
            <span>Clear / Leave Blank</span>
          </button>

          <div className="sig-footer-right">
            <button
              type="button"
              className="sig-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="sig-btn-primary"
              onClick={handleApply}
            >
              <Check size={15} />
              <span>Apply Signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

