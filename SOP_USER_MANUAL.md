# sBLOOM Master Services Agreement (MSA) & SOW Generator
## Standard Operating Procedure (SOP) & Developer/Administrator Manual

---

## 1. System Overview & Architecture

### 1.1 Purpose
The **sBLOOM Report Generator** is an enterprise-grade document creation and contract automation tool. It allows business development, client operations, and legal teams to configure, generate, preview, customize, and print/export legally binding Master Services Agreements (MSA) and Statements of Work (SOW) with modular service annexures.

### 1.2 Technology Stack
* **Framework:** React 19 + TypeScript (Strict typing enabled)
* **Build Tool:** Vite 8 (Hot Module Replacement, fast bundling)
* **Styling:** Custom Vanilla CSS (`src/index.css`, `src/App.css`) with light/dark theme support and strict print-media stylesheets (`@media print` formatted for standard A4 paper dimensions)
* **Iconography:** `lucide-react`
* **Data Storage:** Client-side persistent storage via browser `localStorage` (Keys: `sbloom_document_state_v1`, `sbloom_theme_mode`)
* **Output Medium:** High-resolution vector PDF export via native browser print engine (`window.print()`), plus JSON backup/import.

---

## 2. User Operating Manual (End-User Guide)

### 2.0 Template Hub (Document Studio Starting Screen)
When you first open the application, or when you click **`Templates Hub`** in the top navigation bar, you are presented with the **Template Selection Hub**:
1. **Master Services Agreement (MSA) & SOW:** Multi-page contract with modular annexures (Social Media, GBP, Paid Ads, Website, SEO, SOW schedule, Onboarding checklist). Quick actions to **Open Agreement**, **New Blank**, or **Load Demo** (Kavety Multispeciality Hospital).
2. **Tax Invoice Generator:** Single-page A4 commercial invoice formatted for healthcare clients with itemized services, editable branch locations, tax calculations, and bank payment instructions. Quick actions to **Open Tax Invoice**, **New Blank**, or **Load Demo** (Vizag IVF Centre).

---

### 2.1 Workspace Views
The application provides three operational layouts selectable from the top navigation bar:
1. **Split View (Default):** Dual-pane interface with the 4-step configuration wizard on the left and the live document preview on the right.
2. **Form Only:** Focuses entirely on data input and scope selection (ideal for laptops or smaller screens).
3. **Preview Only:** Expands the document canvas to full width for page-by-page review, proofreading, and final client presentations.

---

### 2.2 Standard Workflow (Generating an Agreement in 4 Steps)

```
[ Step 1: Client Info ] ──▶ [ Step 2: Select Offerings ] ──▶ [ Step 3: Configure Scope ] ──▶ [ Step 4: Review & Export ]
```

#### Step 1: Client Information
* **Customer Legal Name & Registered Entity:** Enter the official legal entity name (e.g., *Pakodi Multispeciality Hospital Pvt. Ltd.*).
* **Corporate Identification / Tax Numbers:** Customer CIN and GSTIN.
* **Registered Address & Operating Locations:** Registered head office address.
* **Authorized Signatory:** Signatory full name and corporate designation (e.g., *Managing Director*).
* **Effective Date & Jurisdiction:** The governing commencement date and dispute resolution jurisdiction (e.g., *Visakhapatnam, Andhra Pradesh, India*).
* **Service Provider Details:** Auto-populated with Ottobon Professional Services Private Limited (sBLOOM brand), customizable if legal entity details change.

#### Step 2: Service Offering Selection
Select one or more service modules to attach to the agreement:
* **Annexure A:** Social Media & Content Services
* **Annexure B:** Google Business Profile (GBP) Management *(Note: If Social Media is selected, GBP is automatically bundled as a complimentary benefit)*
* **Annexure C:** Paid Advertising Management (PPC / Meta / Google Ads)
* **Annexure D:** Website Design, Development & Management
* **Annexure E:** Search Engine Optimisation (SEO)
* **Annexure F:** Consolidated Commercial Schedule (Always automatically attached)
* **Annexure G:** Customer Onboarding Checklist (Optional operational checklist)

#### Step 3: Configure Offering Scope & Deliverables
Customize deliverable counts, production shoots, platforms, and retainers for each selected offering:
* **Social Media:** Reels per month, static graphics, shoot frequency (e.g., 1 shoot/mo up to 4 hrs), revision rounds, and monthly retainer fee.
* **Google Business Profile:** Locations covered, weekly posting cadence, keyword-enriched Q&A, and review defense.
* **Paid Advertising:** Targeted ad networks (Google Search, Display, Meta Instagram/Facebook, LinkedIn), client ad budget range, and monthly agency management fee.
* **Website Development:** Page count (5-7 pages), CMS platform (WordPress), domain URL, delivery timeline (4-6 weeks), and milestone payment distribution (50% kickoff, 25% mockups, 25% go-live).
* **SEO Services:** Monthly optimization scope, technical audits, on-page optimization, and reporting.

#### Step 4: Commercial Review & Totals
* Inspect the calculated **Monthly Recurring Retainer**, **One-Time Setup Fees**, and **Complimentary Savings**.
* Verify applicable taxes (GST @ 18%) and statutory terms.

---

### 2.3 Direct On-Page Live Editing (WYSIWYG Mode)

If you need to make a quick adjustment to a specific sentence, change a clause, fix a typo, or add a custom note directly on the document sheet:
1. In either **Split View** or **Preview View**, click the **`Direct Edit Mode`** button (located in the top action bar or immediately above the document paper).
2. The document unlocks into an editable state. A floating blue status badge will indicate **`Direct Edit Mode: ON`**.
3. **Click directly on any sentence, table cell, or heading** on the page. Type or delete text as you would in Microsoft Word or Google Docs.
4. **Reverting Edits:** If you make an accidental change and wish to restore the original text generated by the wizard form, click **`Re-sync from Form`**.
5. **Locking & Finalizing:** Click **`Direct Edit Mode: ON`** again to lock the document into print-ready mode.

---

### 2.4 Printing & Exporting to PDF

1. Ensure the document is in the desired state.
2. Click the blue **`Print / Export PDF`** button in the header.
3. In the browser print dialog:
   * **Destination:** Select **"Save as PDF"**.
   * **Paper Size:** **A4**.
   * **Margins:** **None** or **Default** (the CSS has built-in page margin control).
   * **Options:** Ensure **"Background graphics"** is **CHECKED** (this ensures table headers, highlight badges, and brand colors print accurately).
4. Click **Save**.

---

### 2.5 Saving Drafts & State Reset
* **Auto-Save:** All form inputs automatically save to your browser's local cache. If you refresh or close the tab, your progress is preserved.
* **Export Draft (`Save Draft`):** Downloads an offline `.json` backup file containing the complete client agreement configuration.
* **Load Sample (`Load Sample`):** Restores the pre-configured demonstration data for rapid testing.
* **New Document (`New Document`):** Clears all fields to start a clean contract from scratch.

---

### 2.6 Tax Invoice Generator (Operating Procedures)
The Tax Invoice module replicates official commercial invoices modeled on `Vizag ivf centre aug26 invoice.pdf`:
1. **Client "Bill To" Information (Image 1):**
   * Customer / Hospital Name
   * Primary Hospital Address
   * Billing Address & Branches (underlined format for multiple regional branches)
   * Contact Person, Email, Phone, GSTIN, and State
2. **Services & Pricing Table (Image 2):**
   * Dynamic line items: Click **`+ Add Service Row`** to add deliverables, or the trash icon to remove.
   * Multi-line Description of Service (e.g. Website Development & Maintenance, Local SEO, GBP Management, Ads Management).
   * Quantity / Remarks (supports formatted text like `4( considering four branches)` or numeric units).
   * Rate (₹), Taxable Value, and GST % (0%, 5%, 12%, 18%).
   * Auto-calculated GST Amount and Row Totals.
   * Automated **Amount in Words** generator formatted in Indian Rupees (`Indian Rupees : Thirty Thousand Rupees Only`), with manual override capability.
3. **Payment Details (Image 3):**
   * Bank Name (`ICICI`), Account Name (`MEDCY HEALTH TECH PRIVATE LIMITED`), Account Number (`631605013978`), IFSC Code (`ICIC0006316`), and optional UPI ID (`medcy89522.ibz@icici`).
4. **Terms, Notes & Authorization:**
   * 3 customizable invoice notes and 5 numbered terms & conditions.
   * Digital authorization seal and Director signature toggle.
5. **WYSIWYG Direct Edit & Print:**
   * Toggle **`Direct Edit Mode`** to click and edit any field directly on the preview sheet.
   * Click **`Print / Export PDF`** for a flawless single-page A4 PDF output.

---

## 3. Technical Architecture & File Directory Map

```
c:\Sbloom Report Generator\
├── public/                     # Static assets (logos, favicon, icons)
│   ├── sbloom-logo.png
│   └── favicon.svg
├── src/
│   ├── assets/                 # Embedded React asset imports
│   ├── components/
│   │   ├── wizard/             # Left-pane step configuration forms
│   │   │   ├── Step1ClientInfo.tsx
│   │   │   ├── Step2Offerings.tsx
│   │   │   ├── Step3OfferingDetails.tsx
│   │   │   └── Step4Review.tsx
│   │   └── document/           # Right-pane document printable components
│   │       ├── DocumentContainer.tsx           # Master wrapper & print coordinator
│   │       ├── CoverMasterAgreement.tsx        # MSA V2.0 cover & legal clauses (1-19)
│   │       ├── SocialMediaAnnexure.tsx         # Annexure A
│   │       ├── GbpAnnexure.tsx                 # Annexure B
│   │       ├── PaidAdsAnnexure.tsx             # Annexure C
│   │       ├── WebsiteAnnexure.tsx             # Annexure D
│   │       ├── SeoAnnexure.tsx                 # Annexure E
│   │       ├── AnnexureFCommercialSOW.tsx      # Annexure F (Commercial Schedule)
│   │       ├── CommercialSummaryTable.tsx      # Reusable pricing table
│   │       └── AnnexureGOnboardingChecklist.tsx# Annexure G (Onboarding checklist)
│   ├── config/
│   │   ├── masterAgreementTerms.ts             # Standard legal clauses, definitions & statutory copy
│   │   └── offerings.config.ts                 # Default document state & initial values
│   ├── types/
│   │   └── document.ts                         # TypeScript interfaces and data models
│   ├── utils/
│   │   └── pricingEngine.ts                    # Dynamic pricing, bundling & annexure indexing engine
│   ├── App.tsx                                 # Application orchestrator & view state manager
│   ├── index.css                               # Comprehensive document & UI styling + @media print rules
│   └── main.tsx                                # React root mounting
├── package.json                                # Dependencies & scripts
└── tsconfig.json                               # TypeScript configuration
```

---

## 4. Maintenance & Future Modification Guide (Developer Guide)

This section details how future developers or administrators can modify, expand, and maintain the system.

### 4.1 Modifying Master Legal Clauses & Definitions
All static legal clauses (Sections 1 through 19 of the Master Services Agreement) are decoupled from the UI and housed in:
👉 `src/config/masterAgreementTerms.ts`

* **To add or update a clause:**
  Edit `MASTER_AGREEMENT_SECTIONS_V2`. Each section contains:
  ```typescript
  {
    id: 'section-9',
    title: '9. INTELLECTUAL PROPERTY RIGHTS',
    clauses: [
      { number: '9.1', body: '...' },
      { number: '9.2', body: '...' }
    ]
  }
  ```
* **To update definitions (Section 2):**
  Edit the definitions array in `masterAgreementTerms.ts`. They will automatically render in the definitions two-column table.

---

### 4.2 Updating Default Company / Agency Information
To update default legal entity names, GSTIN, registered addresses, or signatory details for sBLOOM/Ottobon:
1. Open `src/config/offerings.config.ts`.
2. Locate `DEFAULT_DOCUMENT_DATA.clientInfo`.
3. Update the fields:
   * `serviceProviderName`: Legal corporate name.
   * `providerCinGstin`: Agency CIN and GSTIN.
   * `providerRegisteredAddress`: Head office address.
   * `noticeEmailProvider`: Default notice email.
   * `serviceProviderRep` & `serviceProviderTitle`: Default director/signatory name.

---

### 4.3 Adding a New Service Annexure (e.g., Annexure H: Email Marketing)
Follow these 6 steps to add any new service module cleanly:

#### Step 1: Update TypeScript Types (`src/types/document.ts`)
1. In `SelectedOfferings`, add the flag:
   ```typescript
   export interface SelectedOfferings {
     // ... existing
     emailMarketing: boolean; // Annexure H
   }
   ```
2. Define its configuration interface:
   ```typescript
   export interface EmailMarketingConfig {
     campaignsCount: string;
     monthlyFee: number;
     subscriberTier: string;
   }
   ```
3. Add it to `DocumentData`:
   ```typescript
   export interface DocumentData {
     // ...
     emailMarketing: EmailMarketingConfig;
   }
   ```

#### Step 2: Set Defaults (`src/config/offerings.config.ts`)
Add default configuration values in `DEFAULT_DOCUMENT_DATA`.

#### Step 3: Update Pricing Engine (`src/utils/pricingEngine.ts`)
In `calculatePricingAndInclusions(doc)`:
* Check `if (doc.selectedOfferings.emailMarketing)`.
* Accumulate `monthlyTotal += doc.emailMarketing.monthlyFee`.
* Push the new Annexure label into `attachedAnnexuresList`.

#### Step 4: Create Document Component (`src/components/document/EmailMarketingAnnexure.tsx`)
Create the printable component using the standardized layout:
```tsx
import React from 'react';
import type { DocumentData } from '../../types/document';

interface Props {
  doc: DocumentData;
  annexureLetter: string;
}

export const EmailMarketingAnnexure: React.FC<Props> = ({ doc, annexureLetter }) => {
  return (
    <div className="doc-section doc-page-break">
      <div className="doc-annexure-header">
        <h2 className="annexure-title">ANNEXURE {annexureLetter}: EMAIL MARKETING SERVICES</h2>
      </div>
      {/* Scope tables and terms */}
    </div>
  );
};
```

#### Step 5: Render in `DocumentContainer.tsx`
Import your component and render it conditionally:
```tsx
{doc.selectedOfferings.emailMarketing && (
  <EmailMarketingAnnexure doc={doc} annexureLetter="H" />
)}
```

#### Step 6: Add Wizard Form Inputs
* Add the checkbox in `src/components/wizard/Step2Offerings.tsx`.
* Add the configuration fields in `src/components/wizard/Step3OfferingDetails.tsx`.

---

### 4.4 Modifying Page Breaks & Styling for Print
All print styling is governed by `src/index.css`.

* **Force Page Break Before a Section:**
  Add the CSS class `doc-page-break` to any container:
  ```tsx
  <div className="doc-section doc-page-break">
  ```
* **Prevent Unwanted Page Breaks Inside a Table or Block:**
  Apply `break-inside: avoid !important; page-break-inside: avoid !important;` to the CSS selector.
* **Paper Dimension Tuning:**
  The print stylesheet specifies standard A4 portrait boundaries:
  ```css
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 14mm 14mm;
  }
  ```

---

## 5. Development & Deployment Procedures

### 5.1 Local Development Commands
```bash
# Install dependencies
npm install

# Run local development server (with HMR)
npm run dev

# Check TypeScript types and build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 5.2 Version Control & GitHub Repository
The project repository is connected to:
* **Remote Origin:** `https://github.com/saisashank2809/Sbloom-Report-Generator-.git`
* **Default Branch:** `master`

To push updates:
```bash
git add .
git commit -m "Describe your changes"
git push origin master
```

### 5.3 Hosting & Production Deployment
Because this is a 100% static client-side single page application (SPA), it can be deployed on any static hosting platform at zero infrastructure cost:
* **GitHub Pages:** Add `base: './'` in `vite.config.ts` and enable GitHub Pages on `/dist`.
* **Vercel / Netlify:** Connect the GitHub repository; set Build Command to `npm run build` and Output Directory to `dist`.
* **Offline Local Desktop:** Run `npm run build`; open `dist/index.html` in any modern web browser without internet access.

---

## 6. Troubleshooting & FAQ

| Issue | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Table headers or background colors don't show when saving as PDF** | Browser print setting has disabled background graphics | In the Chrome/Edge print window, expand "More settings" and check **"Background graphics"**. |
| **Document preview edits were lost when changing wizard inputs** | Re-rendering resets DOM nodes | Use Wizard forms for permanent structured inputs, or finalize all wizard steps before making final aesthetic tweaks in Direct Edit Mode. |
| **Accidental edits in Direct Edit Mode** | Typing mistake in WYSIWYG mode | Click **"Re-sync from Form"** in the preview toolbar to instantly restore values from wizard data. |
| **Page break occurs in the middle of a table row** | Row height exceeded page boundary | Add `className="doc-table-avoid-break"` or shorten text/notes to fit within the page flow. |
