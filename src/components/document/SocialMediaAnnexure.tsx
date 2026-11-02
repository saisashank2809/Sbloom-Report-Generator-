import React from 'react';
import type { DocumentData } from '../../types/document';
import { formatINR } from '../../utils/pricingEngine';
import { ExecutionSignaturesTable } from './ExecutionSignaturesTable';

interface Props {
  doc: DocumentData;
  annexureLetter?: string;
  onCustomerSignatureClick?: () => void;
  onProviderStampClick?: () => void;
}

export const SocialMediaAnnexure: React.FC<Props> = ({ 
  doc, 
  annexureLetter = 'A',
  onCustomerSignatureClick,
  onProviderStampClick 
}) => {
  const { socialMedia, clientInfo } = doc;

  const filmingModelText = socialMedia.videoSupplier === 'agency_shoots'
    ? 'Agency on-site production shoot (filming, lighting, direction & equipment)'
    : 'Client-supplied raw footage (editing, color grading, pacing & captions by Agency)';

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — SOCIAL MEDIA & CONTENT SERVICES
        </h2>
        <p className="annexure-subtitle">
          This Annexure applies only when selected and signed/accepted by the Parties. Complete all fields; quantities below are proposed template fields, not automatic commitments.
        </p>
      </div>

      <table className="doc-table doc-meta-table doc-compact-table">
        <thead>
          <tr>
            <th className="doc-th-dark" style={{ width: '34%' }}>Commercial / scope item</th>
            <th className="doc-th-dark">Agreed details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="doc-td-bold">Customer / brand / locations</td>
            <td>{clientInfo.customerName} { (clientInfo.customerRegisteredAddress || clientInfo.address) ? `(${clientInfo.customerRegisteredAddress || clientInfo.address})` : '' }</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Platforms</td>
            <td>{socialMedia.platforms || 'Instagram / Facebook / LinkedIn / YouTube'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Monthly fee + taxes</td>
            <td className="doc-td-highlight">
              {formatINR(socialMedia.monthlyFee)} + applicable taxes / month ({socialMedia.billingCycle})
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Trial / introductory period</td>
            <td>{socialMedia.trialPeriod || 'First 1 month complimentary introductory period'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Reels/videos per month</td>
            <td>{socialMedia.reelsCount}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Static posts per month</td>
            <td>{socialMedia.staticPostsCount}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Stories / other assets</td>
            <td>{socialMedia.storiesAssets || 'Included within approved monthly content plan'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Content planning and calendar</td>
            <td>{socialMedia.contentPlanning}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Filming model</td>
            <td>{filmingModelText}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">On-site production</td>
            <td>{socialMedia.contentShoot}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Captions, copy and publishing</td>
            <td>Included for agreed platforms; copywriting, hashtags and scheduled publishing support</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Reporting and review meeting</td>
            <td>{socialMedia.reporting}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Revisions</td>
            <td>{socialMedia.revisionRounds || 'Default: up to 3 rounds per Deliverable, subject to master terms'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Excluded items</td>
            <td>{socialMedia.excludedItems || 'Influencer fees, paid ad spend, models, travel, props'}</td>
          </tr>
        </tbody>
      </table>

      {/* Customer Duties Callout */}
      <div className="doc-card-callout doc-compact-callout">
        <h4 className="callout-heading">Customer Duties & Content Permissions:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          Customer must provide accurate information, access, timely footage, permissions and approvals within two (2) Business Days. No patient, student, employee or other identifiable person may be filmed or published without all required written consent releases. Any additional quantity or rework requires an approved Change Order.
        </p>
      </div>

      {/* Annexure Signatures */}
      <ExecutionSignaturesTable 
        doc={doc} 
        onCustomerSignatureClick={onCustomerSignatureClick} 
        onProviderStampClick={onProviderStampClick}
      />

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Social Media & Content Services</div>
    </div>
  );
};
