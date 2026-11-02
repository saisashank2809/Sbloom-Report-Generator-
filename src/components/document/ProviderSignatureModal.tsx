import React, { useRef, useState, useEffect } from 'react';
import { X, Stamp, PenTool, Type, Upload, Trash2, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProviderSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  onRemove?: () => void;
  initialSignature?: string;
  providerName?: string;
}

export const ProviderSignatureModal: React.FC<ProviderSignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onRemove,
  initialSignature = '/invoice-authorized-sign.png',
  providerName = 'Bhanu Prasad Bonu (Director)'
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'draw' | 'type' | 'upload'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>(
    initialSignature || '/invoice-authorized-sign.png'
  );
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Royal blue default
  const [typedName, setTypedName] = useState<string>(providerName || 'Bhanu Prasad Bonu');
  const [selectedFontStyle, setSelectedFontStyle] = useState<'cursive1' | 'cursive2' | 'formal'>('formal');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const hasDrawn = useRef<boolean>(false);

  useEffect(() => {
    if (initialSignature) {
      setSelectedPreset(initialSignature);
    }
  }, [initialSignature]);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = penColor;

      if (initialSignature && initialSignature.startsWith('data:image') && !hasDrawn.current) {
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

  // Drawing event handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    hasDrawn.current = true;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
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

  // Generate typed signature image
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
      ctx.font = 'italic 44px "Playfair Display", "Georgia", serif';
    }

    ctx.fillText(typedName || 'Bhanu Prasad Bonu', 250, 85);

    ctx.beginPath();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.moveTo(110, 125);
    ctx.bezierCurveTo(200, 132, 320, 122, 390, 128);
    ctx.stroke();

    return canvas.toDataURL('image/png');
  };

  // Upload handler with white background removal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 215) {
            data[i + 3] = 0;
          } else if (brightness > 175) {
            data[i + 3] = Math.round(((215 - brightness) / 40) * 255);
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
      if (canvas && hasDrawn.current) {
        onSave(canvas.toDataURL('image/png'));
      }
    } else if (activeTab === 'type') {
      const dataUrl = generateTypedSignatureData();
      if (dataUrl) {
        onSave(dataUrl);
      }
    } else if (activeTab === 'upload') {
      if (uploadPreview) {
        onSave(uploadPreview);
      }
    }
    onClose();
  };

  const handleClear = () => {
    onRemove?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sig-modal-backdrop" onClick={onClose}>
      <div className="sig-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sig-modal-header">
          <div className="sig-modal-title-group">
            <div className="sig-modal-icon-badge">
              <Stamp size={18} />
            </div>
            <div>
              <h3>Choose Provider Stamp & Signature</h3>
              <p>Select which official corporate seal or signature to stamp on Provider approval</p>
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
            <span>Saved Signatures ({3})</span>
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
            <span>Upload Scan</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="sig-modal-body">
          {activeTab === 'presets' && (
            <div className="sig-presets-pane">
              <div className="sig-presets-instruction">
                Click any signature or seal below to stamp it on the agreement & SOW:
              </div>

              <div className="sig-preset-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {/* Preset 1: Composite Stamp + Signature */}
                <div 
                  className={`sig-preset-card ${selectedPreset === '/invoice-authorized-sign.png' ? 'active' : ''}`}
                  onClick={() => setSelectedPreset('/invoice-authorized-sign.png')}
                  onDoubleClick={() => {
                    onSave('/invoice-authorized-sign.png');
                    onClose();
                  }}
                >
                  <div className="sig-preset-badge">
                    {selectedPreset === '/invoice-authorized-sign.png' && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="sig-preset-img-frame" style={{ height: '90px' }}>
                    <img 
                      src="/invoice-authorized-sign.png" 
                      alt="Composite Stamp & Signature" 
                      className="sig-preset-thumbnail"
                      style={{ maxHeight: '80px', width: 'auto' }}
                    />
                  </div>
                  <div className="sig-preset-meta">
                    <h4>Stamp & Signature (Composite)</h4>
                    <p>Director Seal + Bhanu Prasad Bonu Signature (Full Corporate Seal)</p>
                  </div>
                  <button 
                    type="button"
                    className="btn-preset-choose"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave('/invoice-authorized-sign.png');
                      onClose();
                    }}
                  >
                    Select Stamp & Signature
                  </button>
                </div>

                {/* Preset 2: Signature Only */}
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
                  <div className="sig-preset-img-frame" style={{ height: '90px' }}>
                    <img 
                      src="/invoice-signature.png" 
                      alt="Executive Signature" 
                      className="sig-preset-thumbnail"
                      style={{ maxHeight: '72px', width: 'auto' }}
                    />
                  </div>
                  <div className="sig-preset-meta">
                    <h4>Executive Signature Only</h4>
                    <p>Bhanu Prasad Bonu (Director) Royal Blue Pen Signature</p>
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
                    Select Signature Only
                  </button>
                </div>

                {/* Preset 3: Circular Stamp Only */}
                <div 
                  className={`sig-preset-card ${selectedPreset === '/invoice-stamp.png' ? 'active' : ''}`}
                  onClick={() => setSelectedPreset('/invoice-stamp.png')}
                  onDoubleClick={() => {
                    onSave('/invoice-stamp.png');
                    onClose();
                  }}
                >
                  <div className="sig-preset-badge">
                    {selectedPreset === '/invoice-stamp.png' && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="sig-preset-img-frame" style={{ height: '90px' }}>
                    <img 
                      src="/invoice-stamp.png" 
                      alt="Circular Stamp Only" 
                      className="sig-preset-thumbnail"
                      style={{ maxHeight: '72px', width: 'auto' }}
                    />
                  </div>
                  <div className="sig-preset-meta">
                    <h4>Official Circular Seal Only</h4>
                    <p>Medcy Health Tech Director Seal (Stamp Only)</p>
                  </div>
                  <button 
                    type="button"
                    className="btn-preset-choose"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave('/invoice-stamp.png');
                      onClose();
                    }}
                  >
                    Select Seal Only
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="sig-draw-pane">
              <div className="sig-draw-tools">
                <span className="tool-label">Pen Color:</span>
                <div className="color-options">
                  <button
                    type="button"
                    className={`color-btn ${penColor === '#1e3a8a' ? 'active' : ''}`}
                    style={{ background: '#1e3a8a' }}
                    onClick={() => setPenColor('#1e3a8a')}
                    title="Royal Blue Pen"
                  />
                  <button
                    type="button"
                    className={`color-btn ${penColor === '#0f172a' ? 'active' : ''}`}
                    style={{ background: '#0f172a' }}
                    onClick={() => setPenColor('#0f172a')}
                    title="Navy / Midnight Pen"
                  />
                  <button
                    type="button"
                    className={`color-btn ${penColor === '#18181b' ? 'active' : ''}`}
                    style={{ background: '#18181b' }}
                    onClick={() => setPenColor('#18181b')}
                    title="Dark Charcoal"
                  />
                </div>

                <button
                  type="button"
                  className="sig-clear-btn"
                  onClick={clearCanvas}
                >
                  <Trash2 size={13} />
                  <span>Clear Pad</span>
                </button>
              </div>

              <div className="sig-canvas-frame">
                <canvas
                  ref={canvasRef}
                  className="sig-canvas"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                />
                <div className="canvas-guideline" />
                <span className="canvas-hint">Sign above with your mouse, trackpad or stylus</span>
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="sig-type-pane">
              <div className="sig-input-group">
                <label>Signatory Name:</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter Signatory Name"
                  className="sig-text-input"
                />
              </div>

              <div className="sig-font-options">
                <span className="tool-label">Font Style:</span>
                <div className="font-choice-row">
                  <button
                    type="button"
                    className={`font-btn ${selectedFontStyle === 'formal' ? 'active' : ''}`}
                    onClick={() => setSelectedFontStyle('formal')}
                  >
                    Formal Serif
                  </button>
                  <button
                    type="button"
                    className={`font-btn ${selectedFontStyle === 'cursive1' ? 'active' : ''}`}
                    onClick={() => setSelectedFontStyle('cursive1')}
                  >
                    Brush Script
                  </button>
                  <button
                    type="button"
                    className={`font-btn ${selectedFontStyle === 'cursive2' ? 'active' : ''}`}
                    onClick={() => setSelectedFontStyle('cursive2')}
                  >
                    Dancing Script
                  </button>
                </div>
              </div>

              <div className="sig-type-preview-box">
                <div 
                  className="typed-preview-text"
                  style={{
                    color: penColor,
                    fontFamily: selectedFontStyle === 'cursive1' 
                      ? '"Brush Script MT", "Caveat", cursive' 
                      : selectedFontStyle === 'cursive2'
                      ? '"Dancing Script", cursive'
                      : '"Playfair Display", Georgia, serif'
                  }}
                >
                  {typedName || 'Bhanu Prasad Bonu'}
                </div>
                <div className="typed-preview-flourish" style={{ borderColor: penColor }} />
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="sig-upload-pane">
              <label className="sig-dropzone">
                <Upload size={24} className="upload-icon" />
                <span className="upload-main-text">Upload Physical Stamp or Signature</span>
                <span className="upload-sub-text">PNG, JPG or scanned image (auto background removal)</span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handleFileUpload}
                  className="file-input-hidden"
                />
              </label>

              {uploadPreview && (
                <div className="sig-upload-preview-wrap">
                  <div className="sig-preview-label">Stamp Preview (Transparent Background):</div>
                  <div className="sig-preview-frame">
                    <img src={uploadPreview} alt="Uploaded stamp preview" />
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
            <span>Clear / Blank Line</span>
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
              <span>Apply Stamp / Signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

