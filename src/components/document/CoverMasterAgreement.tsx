import React from 'react';
import type { DocumentData } from '../../types/document';
import { MASTER_AGREEMENT_SECTIONS_V2 } from '../../config/masterAgreementTerms';
import { PenTool, Stamp } from 'lucide-react';

interface Props {
  doc: DocumentData;
  attachedAnnexuresList: string[];
  onCustomerSignatureClick?: () => void;
  onProviderStampClick?: () => void;
}

export const CoverMasterAgreement: React.FC<Props> = ({ 
  doc, 
  attachedAnnexuresList,
  onCustomerSignatureClick,
  onProviderStampClick 
}) => {
  const { clientInfo } = doc;

  const annexuresText = attachedAnnexuresList.length > 0
    ? attachedAnnexuresList.join(', ')
    : 'None Selected';

  return (
    <>
      {/* Page 1: Header Cover Block + Sections 1-2 */}
      <div className="doc-section doc-page-break">
        <div className="doc-main-header">
          <h1 className="doc-company-title">sBLOOM</h1>
          <h2 className="doc-title">MASTER SERVICES AGREEMENT</h2>
          <p className="annexure-subtitle" style={{ fontSize: '9.5pt', marginTop: '3px', fontWeight: 600 }}>
            {doc.subtitle || 'Digital Presence, Marketing, Website & Growth Services'}
          </p>
        </div>

        {/* Cover Details Table (Exact Match to V2.0 Template) */}
        <table className="doc-table doc-meta-table">
          <thead>
            <tr>
              <th className="doc-th-dark" style={{ width: '34%' }}>Agreement detail</th>
              <th className="doc-th-dark">Information to complete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="doc-td-bold">Version</td>
              <td>{doc.version}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Service Provider</td>
              <td>{clientInfo.serviceProviderName}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Registered / principal address</td>
              <td>{clientInfo.providerRegisteredAddress}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Provider CIN / GSTIN</td>
              <td>{clientInfo.providerCinGstin}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Customer legal name</td>
              <td className="doc-td-bold">{clientInfo.legalEntityName || clientInfo.customerName}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Customer registered address / ID</td>
              <td>
                {clientInfo.customerRegisteredAddress || clientInfo.address}
                {clientInfo.customerCinGstin ? ` | GSTIN/CIN: ${clientInfo.customerCinGstin}` : ''}
              </td>
            </tr>
            <tr>
              <td className="doc-td-bold">Effective date</td>
              <td>{clientInfo.effectiveDate}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Selected service annexures</td>
              <td className="doc-td-highlight">{annexuresText}</td>
            </tr>
            <tr>
              <td className="doc-td-bold">Primary contacts & notice emails</td>
              <td>
                Provider: <strong>{clientInfo.noticeEmailProvider}</strong><br />
                Customer: <strong>{clientInfo.noticeEmailCustomer || clientInfo.email}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Sections 1 and 2 */}
        {MASTER_AGREEMENT_SECTIONS_V2.slice(0, 2).map((section) => (
          <div key={section.id} className="doc-clause-group" style={{ marginTop: '12px' }}>
            <h3 className="doc-section-heading">{section.title}</h3>
            {section.id === 'section-2' ? (
              <table className="doc-table doc-definitions-table doc-compact-table" style={{ marginTop: '6px' }}>
                <tbody>
                  {section.clauses.map((c) => (
                    <tr key={c.number}>
                      <th style={{ width: '28%' }} className="doc-def-title">{c.heading}</th>
                      <td className="doc-def-desc">{c.body as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="doc-subsections-flow">
                {section.clauses.map((c) => (
                  <div key={c.number} className="doc-subsection-item">
                    <p className="doc-clause-p">
                      <strong>{c.number} </strong>{c.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | sBLOOM Master Services Agreement V2.0</div>
      </div>

      {/* Page 2: Sections 3 through 7 */}
      <div className="doc-section doc-page-break">
        {MASTER_AGREEMENT_SECTIONS_V2.slice(2, 7).map((section) => (
          <div key={section.id} className="doc-clause-group" style={{ marginBottom: '12px' }}>
            <h3 className="doc-section-heading">{section.title}</h3>
            <div className="doc-subsections-flow">
              {section.clauses.map((c) => (
                <div key={c.number} className="doc-subsection-item">
                  {Array.isArray(c.body) ? (
                    <div className="doc-clause-multiline">
                      {c.body.map((line, idx) => (
                        <p key={idx} className="doc-clause-p">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p className={`doc-clause-p ${c.isHighlighted ? 'doc-highlight-clause' : ''}`}>
                      <strong>{c.number} </strong>{c.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | sBLOOM Master Services Agreement V2.0</div>
      </div>

      {/* Page 3: Section 8 (SLA Table) and Sections 9 through 12 */}
      <div className="doc-section doc-page-break">
        {/* Section 8: SLA and Support */}
        <div className="doc-clause-group" style={{ marginBottom: '12px' }}>
          <h3 className="doc-section-heading">8. SERVICE LEVEL AND SUPPORT</h3>
          <p className="doc-clause-p" style={{ marginBottom: '6px' }}>
            {MASTER_AGREEMENT_SECTIONS_V2[7].clauses[0].body}
          </p>

          <table className="doc-table doc-deliverables-table doc-compact-table" style={{ margin: '6px 0 10px 0' }}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Issue category</th>
                <th style={{ width: '28%' }}>Initial response target</th>
                <th>Target next step</th>
              </tr>
            </thead>
            <tbody>
              {MASTER_AGREEMENT_SECTIONS_V2[7].slaTable?.map((row, idx) => (
                <tr key={idx}>
                  <td className="doc-td-bold">{row.category}</td>
                  <td>{row.responseTarget}</td>
                  <td>{row.nextStepTarget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sections 9 through 12 */}
        {MASTER_AGREEMENT_SECTIONS_V2.slice(8, 12).map((section) => (
          <div key={section.id} className="doc-clause-group" style={{ marginBottom: '12px' }}>
            <h3 className="doc-section-heading">{section.title}</h3>
            <div className="doc-subsections-flow">
              {section.clauses.map((c) => (
                <div key={c.number} className="doc-subsection-item">
                  <p className={`doc-clause-p ${c.isHighlighted ? 'doc-highlight-clause' : ''}`}>
                    <strong>{c.number} </strong>{c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | sBLOOM Master Services Agreement V2.0</div>
      </div>

      {/* Page 4: Sections 13 through 19 + Execution Signatures */}
      <div className="doc-section doc-page-break">
        {MASTER_AGREEMENT_SECTIONS_V2.slice(12).map((section) => (
          <div key={section.id} className="doc-clause-group" style={{ marginBottom: '10px' }}>
            <h3 className="doc-section-heading">{section.title}</h3>
            <div className="doc-subsections-flow">
              {section.clauses.map((c) => (
                <div key={c.number} className="doc-subsection-item">
                  <p className={`doc-clause-p ${c.isHighlighted ? 'doc-highlight-clause' : ''}`}>
                    <strong>{c.number} {c.heading ? `${c.heading}: ` : ''}</strong>{c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Section 19: Signatures Table */}
        <div style={{ marginTop: '12px' }}>
          <h3 className="doc-section-heading">19. SIGNATURES</h3>
          <p className="doc-clause-p" style={{ marginBottom: '6px' }}>
            The Parties have read and understood this Agreement and agree to be bound by it, together with the selected annexures/SOWs.
          </p>

          <table className="doc-table doc-execution-table doc-compact-sig-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>FOR THE SERVICE PROVIDER</th>
                <th style={{ width: '50%' }}>FOR THE CUSTOMER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Legal name:</strong> {clientInfo.serviceProviderName}</td>
                <td><strong>Legal name:</strong> {clientInfo.legalEntityName || clientInfo.customerName}</td>
              </tr>
              <tr>
                <td><strong>Brand:</strong> {clientInfo.serviceProviderBrand || 'sBLOOM'}</td>
                <td><strong>Entity / trading name:</strong> {clientInfo.customerName}</td>
              </tr>
              <tr>
                <td><strong>Authorised signatory:</strong> {clientInfo.serviceProviderRep}</td>
                <td><strong>Authorised signatory:</strong> {clientInfo.representativeName}</td>
              </tr>
              <tr>
                <td><strong>Title:</strong> {clientInfo.serviceProviderTitle}</td>
                <td><strong>Title:</strong> {clientInfo.representativeTitle}</td>
              </tr>
              <tr>
                <td className="doc-execution-sig-cell">
                  <div 
                    className="doc-sig-stamp-container doc-provider-sig-target is-clickable"
                    onClick={onProviderStampClick}
                    title="Click to choose between official provider stamps and signatures"
                  >
                    {doc.showProviderStamp !== false ? (
                      <div className="doc-provider-stamp-box">
                        <img 
                          src={doc.providerSignatureData || '/invoice-authorized-sign.png'} 
                          alt="Provider Official Seal & Signature" 
                          className="doc-provider-stamp-img"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
                  <div className="sig-line" style={{ marginBottom: '4px' }}></div>
                  <strong>Signature:</strong>
                </td>
                <td className="doc-execution-sig-cell">
                  <div 
                    className={`doc-sig-stamp-container doc-cust-sig-target ${doc.showCustomerSignature !== false ? 'is-clickable' : ''}`}
                    onClick={doc.showCustomerSignature !== false ? onCustomerSignatureClick : undefined}
                    title={doc.showCustomerSignature !== false ? (doc.customerSignatureData ? "Click to change or re-sign" : "Click to sign digitally") : undefined}
                  >
                    {doc.showCustomerSignature !== false ? (
                      doc.customerSignatureData ? (
                        <div className="doc-customer-sig-box">
                          <img 
                            src={doc.customerSignatureData} 
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
                  <div className="sig-line" style={{ marginBottom: '4px' }}></div>
                  <strong>Signature:</strong>
                </td>
              </tr>
              <tr>
                <td><strong>Date:</strong> {clientInfo.effectiveDate}</td>
                <td><strong>Date:</strong> {clientInfo.effectiveDate}</td>
              </tr>
              <tr>
                <td><strong>Notice email:</strong> {clientInfo.noticeEmailProvider}</td>
                <td><strong>Notice email:</strong> {clientInfo.noticeEmailCustomer || clientInfo.email}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | sBLOOM Master Services Agreement V2.0</div>
      </div>
    </>
  );
};
