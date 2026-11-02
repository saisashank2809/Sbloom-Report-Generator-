import React from 'react';
import type { DocumentData } from '../../types/document';
import { formatINR } from '../../utils/pricingEngine';
import { ExecutionSignaturesTable } from './ExecutionSignaturesTable';

interface Props {
  doc: DocumentData;
  annexureLetter?: string;
  isComplimentaryBenefit?: boolean;
  onCustomerSignatureClick?: () => void;
  onProviderStampClick?: () => void;
}

export const GbpAnnexure: React.FC<Props> = ({ 
  doc, 
  annexureLetter = 'B', 
  isComplimentaryBenefit,
  onCustomerSignatureClick,
  onProviderStampClick
}) => {
  const { gbp } = doc;
  const isFree = isComplimentaryBenefit !== undefined 
    ? isComplimentaryBenefit 
    : Boolean(doc.selectedOfferings.socialMedia);

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — GOOGLE BUSINESS PROFILE (GBP) MANAGEMENT
        </h2>
        <p className="annexure-subtitle">
          This Annexure applies only when selected and signed/accepted by the Parties.
        </p>
      </div>

      {isFree && (
        <div className="doc-badge-pill" style={{ marginBottom: '14px' }}>
          ★ AGREED COMPLIMENTARY BENEFIT (INCLUDED WITH SOCIAL MEDIA PACKAGE AT ₹0)
        </div>
      )}

      <table className="doc-table doc-meta-table">
        <thead>
          <tr>
            <th className="doc-th-dark" style={{ width: '35%' }}>Commercial / scope item</th>
            <th className="doc-th-dark">Agreed details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="doc-td-bold">Business name and exact location(s)</td>
            <td>{gbp.coveredLocations}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Monthly fee + taxes</td>
            <td className={isFree ? 'doc-td-free' : 'doc-td-highlight'}>
              {isFree ? 'COMPLIMENTARY (₹0 / month)' : `${formatINR(gbp.monthlyFee)} + applicable taxes / month`}
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Complimentary benefit / duration</td>
            <td>
              {isFree 
                ? 'Included complimentary with Social Media & Content Services engagement' 
                : 'None (Billed as standalone service)'}
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Initial audit and optimisation</td>
            <td>{gbp.initialAuditTimeline} (Categories, hours, service menus & primary attributes)</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Profile posts</td>
            <td>{gbp.weeklyPosts}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Q&A / services / attributes</td>
            <td>{gbp.qnaTurnaround}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Review monitoring and response</td>
            <td>{gbp.reviewMonitoring}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Reporting</td>
            <td>{gbp.reporting}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Customer responsibilities</td>
            <td>Manager access within 48h, accurate hours/details, verification completion, and ethical review collection.</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Exclusions & Ethics</td>
            <td>No guarantee of map rankings; strictly no fake reviews, review gating, incentives, or policy-violating practices.</td>
          </tr>
        </tbody>
      </table>

      {/* Ethical Warning Callout */}
      <div className="doc-card-callout" style={{ marginTop: '16px' }}>
        <h4 className="callout-heading">Ethical Review Practice Guarantee:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          The Service Provider will not create, procure or post fake reviews, misrepresent the business, or engage in review manipulation. The Customer remains responsible for accurate business information and completing any location verification required by Google.
        </p>
      </div>

      {/* Annexure Signatures */}
      <ExecutionSignaturesTable 
        doc={doc} 
        onCustomerSignatureClick={onCustomerSignatureClick} 
        onProviderStampClick={onProviderStampClick}
      />

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Google Business Profile Management</div>
    </div>
  );
};
