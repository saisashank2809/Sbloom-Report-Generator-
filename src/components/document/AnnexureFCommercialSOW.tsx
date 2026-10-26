import React from 'react';
import type { DocumentData } from '../../types/document';
import { type PricingSummary, formatINR } from '../../utils/pricingEngine';

interface Props {
  doc: DocumentData;
  pricing: PricingSummary;
  annexureLetter?: string;
}

export const AnnexureFCommercialSOW: React.FC<Props> = ({ doc, pricing, annexureLetter = 'F' }) => {
  const { clientInfo, selectedOfferings, socialMedia, gbp, paidAds, website, seo } = doc;

  const isGbpFree = Boolean(selectedOfferings.socialMedia);

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — CONSOLIDATED COMMERCIAL SCHEDULE / SOW
        </h2>
        <p className="annexure-subtitle">
          This schedule is intended to prevent inconsistent prices, trial terms, media budgets and payment milestones across separate annexures.
        </p>
      </div>

      {/* Primary Commercial SOW Table */}
      <table className="doc-table doc-deliverables-table doc-compact-table" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ width: '28%' }}>Service module</th>
            <th style={{ width: '22%' }}>Billing basis</th>
            <th style={{ width: '20%' }}>Fee before tax</th>
            <th style={{ width: '20%' }}>Start / trial / term</th>
            <th style={{ width: '10%', textAlign: 'center' }}>Selected?</th>
          </tr>
        </thead>
        <tbody>
          {/* 1. Social Media */}
          <tr>
            <td className="doc-td-bold">Social media & content</td>
            <td>Monthly retainer</td>
            <td className="doc-td-highlight">
              {selectedOfferings.socialMedia ? formatINR(socialMedia.monthlyFee) : '—'}
            </td>
            <td>{selectedOfferings.socialMedia ? socialMedia.trialPeriod : '—'}</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.socialMedia ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 2. GBP */}
          <tr>
            <td className="doc-td-bold">GBP management</td>
            <td>{isGbpFree ? 'Complimentary' : 'Monthly retainer'}</td>
            <td className={selectedOfferings.gbp && isGbpFree ? 'doc-td-free' : 'doc-td-highlight'}>
              {selectedOfferings.gbp 
                ? (isGbpFree ? 'COMPLIMENTARY (₹0)' : formatINR(gbp.monthlyFee))
                : '—'}
            </td>
            <td>
              {selectedOfferings.gbp 
                ? (isGbpFree ? 'Complimentary with Social Media bundle' : '12 Months')
                : '—'}
            </td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.gbp ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 3. Paid Ads Management */}
          <tr>
            <td className="doc-td-bold">Paid ads management</td>
            <td>Monthly retainer</td>
            <td className="doc-td-highlight">
              {selectedOfferings.paidAds ? formatINR(paidAds.agencyManagementFee) : '—'}
            </td>
            <td>{selectedOfferings.paidAds ? '12 Months' : '—'}</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.paidAds ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 4. Advertising Media Spend */}
          <tr>
            <td className="doc-td-bold">Advertising media spend</td>
            <td>Customer-funded budget</td>
            <td>{selectedOfferings.paidAds ? paidAds.paidMediaBudget : '—'}</td>
            <td>Paid directly to platforms</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.paidAds ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 5. Website Development */}
          <tr>
            <td className="doc-td-bold">Website development</td>
            <td>Milestone / project</td>
            <td className="doc-td-highlight">
              {selectedOfferings.website && website.oneTimeFee > 0 ? formatINR(website.oneTimeFee) : '—'}
            </td>
            <td>{selectedOfferings.website ? '50% / 25% / 25% milestones' : '—'}</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.website && website.oneTimeFee > 0 ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 6. Website Maintenance */}
          <tr>
            <td className="doc-td-bold">Website maintenance</td>
            <td>Monthly retainer</td>
            <td>
              {selectedOfferings.website && website.monthlyMaintenanceFee > 0 ? formatINR(website.monthlyMaintenanceFee) : '—'}
            </td>
            <td>{selectedOfferings.website && website.monthlyMaintenanceFee > 0 ? 'Monthly' : '—'}</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.website && website.monthlyMaintenanceFee > 0 ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>

          {/* 7. SEO */}
          <tr>
            <td className="doc-td-bold">Search engine optimisation</td>
            <td>Monthly retainer</td>
            <td className="doc-td-highlight">
              {selectedOfferings.seo ? formatINR(seo.monthlyRetainer) : '—'}
            </td>
            <td>{selectedOfferings.seo ? `${seo.primaryKeywordsCount} Keywords | 12 Mo` : '—'}</td>
            <td style={{ textAlign: 'center' }}>
              <strong>{selectedOfferings.seo ? 'YES [✓]' : 'NO [ ]'}</strong>
            </td>
          </tr>
        </tbody>

        <tfoot>
          {pricing.totalMonthlySavings > 0 && (
            <tr className="doc-tfoot-savings">
              <td colSpan={3}><strong>Total Monthly Package Savings (e.g. Complimentary GBP)</strong></td>
              <td colSpan={2} className="doc-td-free">
                <strong>- {formatINR(pricing.totalMonthlySavings)} / month</strong>
              </td>
            </tr>
          )}
          {pricing.oneTimeTotal > 0 && (
            <tr className="doc-tfoot-row">
              <td colSpan={3}><strong>Total One-Time Project Deliverables</strong></td>
              <td colSpan={2} className="doc-td-bold">{formatINR(pricing.oneTimeTotal)}</td>
            </tr>
          )}
          <tr className="doc-tfoot-total">
            <td colSpan={3}>
              <strong>NET MONTHLY RECURRING TOTAL [Before statutory taxes]</strong>
            </td>
            <td colSpan={2} className="doc-total-amount">
              {formatINR(pricing.monthlyRecurringTotal)} / month
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Commercial Terms Breakdown Paragraphs (From Template) */}
      <div className="doc-card-callout doc-compact-callout">
        <h4 className="callout-heading">Commercial Conditions & Invoicing Notes:</h4>
        <ul className="doc-bullet-list">
          <li><strong>Taxes:</strong> All fees exclusive of GST @ 18%, invoiced in addition.</li>
          <li><strong>Invoicing & Net 5:</strong> Monthly retainers invoiced on or around 1st of month in advance, payable within 5 Business Days.</li>
          <li><strong>Direct Ad Spend:</strong> Media spend is paid directly by Customer to Meta / Google.</li>
          <li><strong>Complimentary Conditions:</strong> GBP is ₹0 complimentary benefit solely while Social Media remains active.</li>
          <li><strong>Special Terms:</strong> {doc.specialTerms || 'None. Standard terms apply without variation.'}</li>
        </ul>
      </div>

      {/* Signatures Table */}
      <table className="doc-table doc-execution-table doc-compact-sig-table">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>For Service Provider</th>
            <th style={{ width: '50%' }}>For Customer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name / title: <strong>{clientInfo.serviceProviderRep}</strong> ({clientInfo.serviceProviderTitle})</td>
            <td>Name / title: <strong>{clientInfo.representativeName}</strong> ({clientInfo.representativeTitle})</td>
          </tr>
          <tr>
            <td className="doc-compact-sig-cell">
              <div className="sig-line" style={{ marginBottom: '4px' }}></div>
              Signature / written acceptance:
            </td>
            <td className="doc-compact-sig-cell">
              <div className="sig-line" style={{ marginBottom: '4px' }}></div>
              Signature / written acceptance:
            </td>
          </tr>
          <tr>
            <td>Date: {clientInfo.effectiveDate}</td>
            <td>Date: {clientInfo.effectiveDate}</td>
          </tr>
        </tbody>
      </table>

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Consolidated Commercial Schedule / SOW</div>
    </div>
  );
};
