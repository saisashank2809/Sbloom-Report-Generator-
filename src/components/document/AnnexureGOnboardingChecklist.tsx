import React from 'react';
import type { DocumentData } from '../../types/document';

interface Props {
  doc: DocumentData;
  annexureLetter?: string;
}

export const AnnexureGOnboardingChecklist: React.FC<Props> = ({ doc, annexureLetter = 'G' }) => {
  const { clientInfo, onboarding } = doc;

  const checklistItems = [
    {
      title: 'Legal & Entity Details',
      desc: 'Exact legal entity name, registered office address, CIN/GSTIN details and designated authorised signatory.'
    },
    {
      title: 'Key Communication Contacts',
      desc: 'Primary project coordinator, escalation contact, formal notice email, and accounts/billing representative.'
    },
    {
      title: 'Business & Value Propositions',
      desc: 'Business profile, locations covered, key services, core target audience, key differentiators and approved claims.'
    },
    {
      title: 'Brand Assets & Media Repository',
      desc: 'Vector logos, brand style guidelines, fonts, approved marketing copy, high-resolution facility photos and raw footage.'
    },
    {
      title: 'Web & Hosting Credentials',
      desc: 'Website CMS administrator access, domain registrar login, DNS management, and technical hosting point-of-contact.'
    },
    {
      title: 'Marketing Platform Delegated Access',
      desc: 'Delegated manager access to Google Business Profile, Meta Business Portfolio (Business Manager), Google Ads MCC, GA4, and Search Console.'
    },
    {
      title: 'Paid Media Budget Authority',
      desc: 'Customer credit card / billing method configured directly in Meta & Google Ad accounts, approved daily spend ceiling, and campaign approval lead.'
    },
    {
      title: 'Content Review & Approval Cadence',
      desc: 'Designated content reviewer, commitment to 2 Business Days feedback turnaround, and escalation protocol.'
    },
    {
      title: 'Media Releases & Patient / Testimonial Consents',
      desc: 'Signed photo/video consent releases for all identifiable persons, doctors, employees, students, or patients appearing in content.'
    },
    {
      title: 'Data Protection & CRM Workflow',
      desc: 'Privacy policy compliance on landing pages, DPDPA 2023 lead handling protocol, retention schedules, and approved CRM integration destination.'
    }
  ];

  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">
          ANNEXURE {annexureLetter} — CUSTOMER ONBOARDING CHECKLIST
        </h2>
        <p className="annexure-subtitle">
          Readiness prerequisites for project kickoff and operational onboarding.
        </p>
      </div>

      <p className="doc-clause-p" style={{ marginBottom: '14px' }}>
        To ensure smooth delivery and eliminate operational roadblocks, the following items must be verified prior to campaign flight or content release for <strong>{clientInfo.customerName}</strong>:
      </p>

      {/* 10-Point Checklist Table */}
      <table className="doc-table doc-deliverables-table doc-compact-table">
        <thead>
          <tr>
            <th style={{ width: '8%', textAlign: 'center' }}>Status</th>
            <th style={{ width: '28%' }}>Readiness Category</th>
            <th>Required Verification / Deliverable Item</th>
          </tr>
        </thead>
        <tbody>
          {checklistItems.map((item, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: 'center', fontSize: '9pt', color: '#047857' }}>
                ☑
              </td>
              <td className="doc-td-bold">{item.title}</td>
              <td>{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Kickoff Conditions Callout */}
      <div className="doc-card-callout doc-compact-callout">
        <h4 className="callout-heading">Project Kickoff Conditions:</h4>
        <p className="doc-clause-p" style={{ margin: 0 }}>
          Project kickoff will occur after: (1) Execution of the Master Services Agreement and selected annexures; (2) Receipt of any agreed advance or milestone payment; (3) Completion of onboarding checklist requirements; and (4) Provision of necessary delegated platform access and brand materials.
        </p>
        <p className="doc-clause-p" style={{ marginTop: '4px', fontWeight: 600, color: '#1e3a5f' }}>
          Target Kickoff Schedule: {onboarding?.targetKickoffDate || 'Within 3 Business Days of access provisioning and onboarding completion.'}
        </p>
      </div>

      {/* Signature block */}
      <table className="doc-table doc-execution-table doc-compact-sig-table">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Onboarding Verified By (sBLOOM)</th>
            <th style={{ width: '50%' }}>Customer Onboarding Lead</th>
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
              Signature:
            </td>
            <td className="doc-compact-sig-cell">
              <div className="sig-line" style={{ marginBottom: '4px' }}></div>
              Signature:
            </td>
          </tr>
          <tr>
            <td>Date: {clientInfo.effectiveDate}</td>
            <td>Date: {clientInfo.effectiveDate}</td>
          </tr>
        </tbody>
      </table>

      <div className="doc-page-footer">PRIVATE & CONFIDENTIAL | Annexure {annexureLetter} — Customer Onboarding Checklist</div>
    </div>
  );
};
