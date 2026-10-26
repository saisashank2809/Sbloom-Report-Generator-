import React from 'react';
import type { DocumentData } from '../../types/document';
import { formatINR } from '../../utils/pricingEngine';

interface Props {
  doc: DocumentData;
  annexureLetter?: string;
}

export const SeoAnnexure: React.FC<Props> = ({ doc, annexureLetter = 'E' }) => {
  const { seo, clientInfo } = doc;

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — SEARCH ENGINE OPTIMISATION (SEO)
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
            <td className="doc-td-bold">Target website(s) and locations</td>
            <td>{seo.scopeUrls || 'To be specified by Customer'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Monthly retainer + taxes</td>
            <td className="doc-td-highlight">
              {formatINR(seo.monthlyRetainer)} + applicable taxes / month
            </td>
          </tr>
          <tr>
            <td className="doc-td-bold">One-time audit fee</td>
            <td>{seo.oneTimeSetupFee || 'Complimentary technical audit'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Technical audit scope</td>
            <td>{seo.technicalAuditScope || 'Crawl, indexation, speed, broken links, schema & site architecture'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Keyword research</td>
            <td>{seo.primaryKeywordsCount} primary high-intent keywords + quarterly review</td>
          </tr>
          <tr>
            <td className="doc-td-bold">On-page optimisation</td>
            <td>{seo.pagesOptimisedPerMonth} (metadata, headings, schema, internal linking)</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Technical changes</td>
            <td>Recommendations log provided; CMS implementation included subject to Customer approval</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Local SEO / GBP coordination</td>
            <td>{seo.localSeoCoordination || 'Coordinated with Google Business Profile (avoiding duplicate charges)'}</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Analytics / Search Console</td>
            <td>Verification and configuration of Google Search Console & GA4</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Link building / off-page SEO</td>
            <td>White-hat local citations, directory syndication and ethical outreach within guidelines</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Reporting</td>
            <td>Monthly keyword positions, organic impressions and click trajectory shared by 5th of each month</td>
          </tr>
          <tr>
            <td className="doc-td-bold">Timeline assumptions</td>
            <td>SEO outcomes typically require 60–120 days for algorithmic propagation; no rankings or traffic volumes are guaranteed</td>
          </tr>
        </tbody>
      </table>

      {/* Prohibited Practices Callout */}
      <div className="doc-card-callout" style={{ marginTop: '16px' }}>
        <h4 className="callout-heading">Ethical Search Compliance:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          The Service Provider will not knowingly use deceptive, cloaking, spam or prohibited black-hat SEO practices. Search engines control crawling, indexing and rankings. The Customer is responsible for website claims, legal notices and prompt approval of material changes.
        </p>
      </div>

      {/* Annexure Signatures */}
      <table className="doc-table doc-execution-table" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Provider approval</th>
            <th style={{ width: '50%' }}>Customer approval</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name / title: <strong>{clientInfo.serviceProviderRep}</strong> ({clientInfo.serviceProviderTitle})</td>
            <td>Name / title: <strong>{clientInfo.representativeName}</strong> ({clientInfo.representativeTitle})</td>
          </tr>
          <tr>
            <td style={{ height: '55px', verticalAlign: 'bottom' }}>
              <div className="sig-line"></div>
              Signature / written acceptance:
            </td>
            <td style={{ height: '55px', verticalAlign: 'bottom' }}>
              <div className="sig-line"></div>
              Signature / written acceptance:
            </td>
          </tr>
          <tr>
            <td>Date: {clientInfo.effectiveDate}</td>
            <td>Date: {clientInfo.effectiveDate}</td>
          </tr>
        </tbody>
      </table>

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Search Engine Optimisation (SEO)</div>
    </div>
  );
};
