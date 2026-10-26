import type { DocumentData } from '../types/document';

export interface PricingSummary {
  monthlyRecurringTotal: number;
  oneTimeTotal: number;
  totalMonthlySavings: number;
  attachedAnnexuresList: string[];
  annexureLetters: {
    socialMedia?: string;
    gbp?: string;
    paidAds?: string;
    website?: string;
    seo?: string;
    commercialSOW: string;
    onboardingChecklist?: string;
  };
  breakdown: {
    serviceName: string;
    type: 'monthly' | 'one-time';
    standardPrice: number;
    finalPrice: number;
    isComplimentary: boolean;
    notes?: string;
  }[];
}

export function calculatePricingAndInclusions(doc: DocumentData): PricingSummary {
  const breakdown: PricingSummary['breakdown'] = [];
  const attachedAnnexuresList: string[] = [];
  const annexureLetters: PricingSummary['annexureLetters'] = {
    commercialSOW: 'A'
  };

  let monthlyRecurringTotal = 0;
  let oneTimeTotal = 0;
  let totalMonthlySavings = 0;

  let currentCode = 65; // ASCII 'A'
  const getNextLetter = () => String.fromCharCode(currentCode++);

  // 1. Social Media & Content Services
  if (doc.selectedOfferings.socialMedia) {
    const letter = getNextLetter();
    annexureLetters.socialMedia = letter;
    const smmPrice = doc.socialMedia.monthlyFee;
    monthlyRecurringTotal += smmPrice;
    breakdown.push({
      serviceName: 'Social Media & Content Services',
      type: 'monthly',
      standardPrice: doc.socialMedia.videoSupplier === 'agency_shoots' ? 10000 : 6000,
      finalPrice: smmPrice,
      isComplimentary: false,
      notes: `${doc.socialMedia.videoSupplier === 'agency_shoots' ? 'Agency Shoot' : 'Client Video'} | ${doc.socialMedia.trialPeriod}`
    });
    attachedAnnexuresList.push(`Annexure ${letter}: Social Media & Content Services`);
  }

  // 2. Google Business Profile (GBP) Management
  if (doc.selectedOfferings.gbp) {
    const letter = getNextLetter();
    annexureLetters.gbp = letter;
    const isComplimentary = Boolean(doc.selectedOfferings.socialMedia);
    const finalGbpPrice = isComplimentary ? 0 : doc.gbp.monthlyFee;
    
    if (isComplimentary) {
      totalMonthlySavings += doc.gbp.monthlyFee;
    } else {
      monthlyRecurringTotal += finalGbpPrice;
    }

    breakdown.push({
      serviceName: 'Google Business Profile (GBP) Management',
      type: 'monthly',
      standardPrice: doc.gbp.monthlyFee,
      finalPrice: finalGbpPrice,
      isComplimentary: isComplimentary,
      notes: isComplimentary ? 'Agreed Complimentary Benefit (Free with Social Media)' : 'Standard Monthly Management'
    });
    attachedAnnexuresList.push(`Annexure ${letter}: Google Business Profile Management`);
  }

  // 3. Paid Advertising Management (Meta & Google)
  if (doc.selectedOfferings.paidAds) {
    const letter = getNextLetter();
    annexureLetters.paidAds = letter;
    const adsFee = doc.paidAds.agencyManagementFee;
    monthlyRecurringTotal += adsFee;
    breakdown.push({
      serviceName: 'Paid Advertising Management (Meta & Google)',
      type: 'monthly',
      standardPrice: doc.paidAds.accountStatus === 'new_account' ? 3000 : 2000,
      finalPrice: adsFee,
      isComplimentary: false,
      notes: `${doc.paidAds.accountStatus === 'new_account' ? 'New Account Setup' : 'Existing Account'} (Media spend paid directly to platforms)`
    });
    attachedAnnexuresList.push(`Annexure ${letter}: Paid Advertising Management`);
  }

  // 4. Website Design, Development & Management
  if (doc.selectedOfferings.website) {
    const letter = getNextLetter();
    annexureLetters.website = letter;
    const devFee = doc.website.oneTimeFee || 5000;
    const maintFee = doc.website.monthlyMaintenanceFee || 0;

    if (devFee > 0) {
      oneTimeTotal += devFee;
      breakdown.push({
        serviceName: 'Website Design & Development',
        type: 'one-time',
        standardPrice: 5000,
        finalPrice: devFee,
        isComplimentary: false,
        notes: `${doc.website.pageCount} | CMS: ${doc.website.cmsPlatform} (Milestones: 50% / 25% / 25%)`
      });
    }

    if (maintFee > 0) {
      monthlyRecurringTotal += maintFee;
      breakdown.push({
        serviceName: 'Website Monthly Maintenance',
        type: 'monthly',
        standardPrice: maintFee,
        finalPrice: maintFee,
        isComplimentary: false,
        notes: 'Monthly backups, security updates & uptime monitoring'
      });
    }

    attachedAnnexuresList.push(`Annexure ${letter}: Website Design, Development & Management`);
  }

  // 5. Search Engine Optimisation (SEO)
  if (doc.selectedOfferings.seo) {
    const letter = getNextLetter();
    annexureLetters.seo = letter;
    const seoFee = doc.seo.monthlyRetainer;
    monthlyRecurringTotal += seoFee;
    breakdown.push({
      serviceName: 'Search Engine Optimisation (SEO)',
      type: 'monthly',
      standardPrice: 5000,
      finalPrice: seoFee,
      isComplimentary: false,
      notes: `${doc.seo.primaryKeywordsCount} Target Keywords | ${doc.seo.oneTimeSetupFee}`
    });
    attachedAnnexuresList.push(`Annexure ${letter}: Search Engine Optimisation (SEO)`);
  }

  // Consolidated Commercial Schedule (Always attached as master SOW)
  const sowLetter = getNextLetter();
  annexureLetters.commercialSOW = sowLetter;
  attachedAnnexuresList.push(`Annexure ${sowLetter}: Consolidated Commercial Schedule / SOW`);

  // Customer Onboarding Checklist (Optional / default on)
  if (doc.selectedOfferings.onboardingChecklist) {
    const checklistLetter = getNextLetter();
    annexureLetters.onboardingChecklist = checklistLetter;
    attachedAnnexuresList.push(`Annexure ${checklistLetter}: Customer Onboarding Checklist`);
  }

  return {
    monthlyRecurringTotal,
    oneTimeTotal,
    totalMonthlySavings,
    attachedAnnexuresList,
    annexureLetters,
    breakdown
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
