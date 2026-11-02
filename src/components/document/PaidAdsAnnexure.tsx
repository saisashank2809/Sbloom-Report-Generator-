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

export const PaidAdsAnnexure: React.FC<Props> = ({ 
  doc, 
  annexureLetter = 'C',
  onCustomerSignatureClick,
  onProviderStampClick 
}) => {
  const { paidAds } = doc;

  const platformList = [
    paidAds.platforms.googleSearch ? 'Google Search Ads' : null,
    paidAds.platforms.googleDisplayYouTube ? 'Google Display / YouTube' : null,
    paidAds.platforms.metaFbInsta ? 'Meta (Facebook & Instagram)' : null,
    paidAds.platforms.linkedIn ? 'LinkedIn Ads' : null,
    paidAds.platforms.other ? paidAds.platforms.other : null,
  ].filter(Boolean).join(', ');

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — PAID ADVERTISING MANAGEMENT (META / GOOGLE / OTHER)
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
            <td className="doc-td-bold">Platforms and campaign types</td>
            <td>{platformList || 'Meta (Facebook & Instagram), Google Search Ads'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Agency management fee + taxes</td>
            <td className="doc-td-highlight">
              {formatINR(paidAds.agencyManagementFee)} + applicable taxes / month
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Customer-approved media budget</td>
            <td>{paidAds.paidMediaBudget}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Who pays platform</td>
            <td>{paidAds.whoPaysPlatform || 'Customer direct to Meta / Google'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Accounts and access</td>
            <td>
              {paidAds.accountStatus === 'existing_account'
                ? 'Existing account (delegated access via Meta Business Manager & Google MCC)'
                : 'New account setup required (configured under Customer ownership)'}
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">Campaign setup & launch timeline</td>
            <td>{paidAds.launchTimeline || '3-4 Business Days per platform (subject to access and budget)'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Creative / copy quantities</td>
            <td>{paidAds.creativesCount}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Revision rounds</td>
            <td>Up to 3 rounds per creative asset, within approved campaign objectives</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Monitoring and optimisation</td>
            <td>Daily monitoring of pacing, click-through rates, cost-per-lead and negative keywords</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Lead delivery / CRM integration</td>
            <td>{paidAds.leadDelivery}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Conversion tracking</td>
            <td>{paidAds.conversionTracking}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Reporting and review</td>
            <td>Monthly analytics report shared between 1st–7th of each month, with platform invoices</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Excluded costs</td>
            <td>Direct media spend paid to ad networks, third-party CRM fees, external landing page software</td>
          </tr>
        </tbody>
      </table>

      {/* Ad Policy Callout */}
      <div className="doc-card-callout" style={{ marginTop: '16px' }}>
        <h4 className="callout-heading">Media Budget Approval & Disclaimer:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          No campaign will be launched and no material budget increase will be made without written Customer approval. Advertising results are not guaranteed. The Customer is responsible for lawful claims, required permissions, privacy notices and lawful collection/use of lead data.
        </p>
      </div>

      {/* Annexure Signatures */}
      <ExecutionSignaturesTable 
        doc={doc} 
        onCustomerSignatureClick={onCustomerSignatureClick} 
        onProviderStampClick={onProviderStampClick}
      />

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Paid Advertising Management</div>
    </div>
  );
};
