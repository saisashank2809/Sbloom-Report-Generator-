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

export const WebsiteAnnexure: React.FC<Props> = ({ 
  doc, 
  annexureLetter = 'D',
  onCustomerSignatureClick,
  onProviderStampClick 
}) => {
  const { website } = doc;

  const projectTypeText = website.projectType === 'both'
    ? 'One-time build + Ongoing monthly maintenance'
    : website.projectType === 'maintenance'
    ? 'Monthly website maintenance'
    : 'One-time custom design & development build';

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — WEBSITE DESIGN, DEVELOPMENT & MANAGEMENT
        </h2>
        <p className="annexure-subtitle">
          This Annexure applies only when selected and signed/accepted by the Parties.
        </p>
      </div>

      <table className="doc-table doc-meta-table">
        <thead>
          <tr>
            <th className="doc-th-dark" style={{ width: '35%' }}>Commercial / scope item</th>
            <th className="doc-th-dark">Agreed details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="doc-td-bold">Domain / target URL</td>
            <td>{website.domainUrl || 'To be registered / provided by Customer'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Project type</td>
            <td>{projectTypeText}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Platform / CMS</td>
            <td>{website.cmsPlatform}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Pages and functionality</td>
            <td>{website.pageCount} (clean HTML5 semantics, responsive UI, contact forms & WhatsApp trigger)</td>
          </tr>
          <tr>
            <td className="doc-td-bold">One-time development fee + taxes</td>
            <td className="doc-td-highlight">
              {website.oneTimeFee > 0 ? `${formatINR(website.oneTimeFee)} + applicable taxes` : 'Not Applicable'}
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Monthly maintenance fee + taxes</td>
            <td>
              {website.monthlyMaintenanceFee > 0 
                ? `${formatINR(website.monthlyMaintenanceFee)} + taxes / month` 
                : 'Not Applicable (Optional standalone maintenance)'}
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Payment milestones</td>
            <td>
              {website.m1KickoffPercent}% kickoff / {website.m2MockupPercent}% design approval / {website.m3GoLivePercent}% UAT and go-live
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Target timeline and dependencies</td>
            <td>{website.deliveryTime}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Customer-supplied content</td>
            <td>Copywriting input, brand assets, doctor/faculty profiles, and formal legal notices</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Hosting / domain / SSL</td>
            <td>Customer purchases and maintains direct hosting and domain accounts; Agency assists with SSL & DNS setup</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Plugins / licences</td>
            <td>Standard open-source plugins included; premium third-party licenses billed directly to Customer</td>
          </tr>
          <tr>
            <td className="doc-td-bold">UAT & defect correction</td>
            <td>{website.uatPeriod || '5 Business Days for client review and defect logging'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Post-launch support</td>
            <td>{website.postLaunchSupport || '30 Days post-launch warranty defect resolution included'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Handover / source files</td>
            <td>Administrator CMS credentials and site backup files transferred upon receipt of full milestone payment</td>
          </tr>
        </tbody>
      </table>

      {/* Exclusions Callout */}
      <div className="doc-card-callout" style={{ marginTop: '16px' }}>
        <h4 className="callout-heading">Scope Exclusions & Responsibilities:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          Unless expressly included, website scope excludes hosting server fees, domain registration/renewal, premium plugin licences, paid themes, copywriting beyond agreed pages, commercial stock assets, and custom API integrations. The Customer is responsible for backups and hosting unless expressly assigned to Service Provider.
        </p>
      </div>

      {/* Annexure Signatures */}
      <ExecutionSignaturesTable 
        doc={doc} 
        onCustomerSignatureClick={onCustomerSignatureClick} 
        onProviderStampClick={onProviderStampClick}
      />

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Website Design, Development & Management</div>
    </div>
  );
};
