export type VideoSupplierOption = 'agency_shoots' | 'client_supplies';
export type AdAccountOption = 'existing_account' | 'new_account';
export type BillingCycle = 'Monthly' | 'Quarterly' | 'One-Time';

export interface ClientInfo {
  customerName: string;
  legalEntityName: string;
  customerCinGstin: string;
  customerRegisteredAddress: string;
  representativeName: string;
  representativeTitle: string;
  address: string;
  phone: string;
  email: string;
  noticeEmailCustomer: string;
  effectiveDate: string; // e.g. "15th Day of August 2026"
  jurisdiction: string;  // e.g. "Visakhapatnam, Andhra Pradesh, India"
  governingLaw: string;  // e.g. "Laws of Andhra Pradesh State, India"
  serviceProviderName: string; // "OTTOBON PROFESSIONAL SERVICES PRIVATE LIMITED, operating under the sBLOOM brand"
  serviceProviderBrand: string; // "sBLOOM"
  providerCinGstin: string;
  providerRegisteredAddress: string;
  noticeEmailProvider: string;
  serviceProviderRep: string;  // "Bhanu Prasad Bonu"
  serviceProviderTitle: string; // "Director"
}

export interface SelectedOfferings {
  socialMedia: boolean;
  gbp: boolean;
  paidAds: boolean;
  website: boolean;
  seo: boolean;
  onboardingChecklist: boolean; // Annexure G
}

export interface SocialMediaConfig {
  serviceBrand: string;
  videoSupplier: VideoSupplierOption;
  monthlyFee: number;
  trialPeriod: string; // e.g. "First 1 month complimentary"
  platforms: string;   // e.g. "Instagram / Facebook"
  reelsCount: string;  // e.g. "8 / month (approx. 10-30 sec)"
  reelsNotes: string;
  staticPostsCount: string; // e.g. "8 / month (single/carousel)"
  staticPostsNotes: string;
  storiesAssets: string; // "Included within approved content plan"
  contentPlanning: string; // "1 monthly plan"
  contentShoot: string;    // "1 / month (Up to 4 hours, presenter 60-90 min)"
  reporting: string;       // "1 / month"
  revisionRounds: string;  // "Up to 3 reasonable rounds per deliverable"
  excludedItems: string;   // "Influencer fees, paid ad spend, travel, props"
  contractPeriod: string;  // "12 Months"
  billingCycle: BillingCycle;
}

export interface GbpConfig {
  coveredLocations: string;
  monthlyFee: number;
  isComplimentary: boolean;
  initialAuditTimeline: string; // "2-3 Business Days"
  weeklyPosts: string; // "2 posts per week (max 8 per month)"
  qnaTurnaround: string; // "Keywords-enriched Q&A injections"
  reviewMonitoring: string; // "Daily monitoring and spam defense"
  reporting: string; // "Monthly map views, direction requests & calls"
  contractPeriod: string;
  billingCycle: BillingCycle;
}

export interface PaidAdsConfig {
  platforms: {
    googleSearch: boolean;
    googleDisplayYouTube: boolean;
    metaFbInsta: boolean;
    linkedIn: boolean;
    other: string;
  };
  accountStatus: AdAccountOption;
  agencyManagementFee: number;
  paidMediaBudget: string; // e.g. "INR [2,000] - INR [6,000] / day"
  whoPaysPlatform: string; // "Customer direct to Meta / Google"
  creativesCount: string; // "Up to 3-5 static/video creatives per month"
  launchTimeline: string; // "3-4 Business Days per platform"
  leadDelivery: string; // "Weekdays by 11:00 AM IST to CRM / Google Sheet"
  conversionTracking: string; // "Meta Pixel, GA4, Google Tag Manager & Conversions API"
  contractPeriod: string;
  billingCycle: BillingCycle;
}

export interface WebsiteConfig {
  pageCount: string; // "5-7 pages (incl. 1 landing page)"
  cmsPlatform: string; // "WordPress"
  domainUrl: string;
  projectType: 'one_time' | 'maintenance' | 'both';
  oneTimeFee: number; // 5000
  monthlyMaintenanceFee: number; // 0 or fee
  deliveryTime: string; // "4-6 weeks from content receipt"
  m1KickoffPercent: number; // 50
  m2MockupPercent: number;  // 25
  m3GoLivePercent: number;  // 25
  uatPeriod: string; // "5 Business Days"
  postLaunchSupport: string; // "30 Days defect resolution included"
  contractPeriod: string;
  billingCycle: BillingCycle;
}

export interface SeoConfig {
  scopeUrls: string; // e.g. "https://example.com"
  primaryKeywordsCount: number; // 10
  pagesOptimisedPerMonth: string; // "7-8 pages per month"
  monthlyRetainer: number;
  oneTimeSetupFee: string; // "Complimentary"
  technicalAuditScope: string; // "Crawl health, speed check, broken links & architecture"
  localSeoCoordination: string; // "Aligned with Google Business Profile"
  contractPeriod: string;
  billingCycle: BillingCycle;
}

export interface OnboardingConfig {
  targetKickoffDate: string;
  designatedManager: string;
  delegatedAccessStatus: string;
}

export interface DocumentData {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  clientInfo: ClientInfo;
  selectedOfferings: SelectedOfferings;
  socialMedia: SocialMediaConfig;
  gbp: GbpConfig;
  paidAds: PaidAdsConfig;
  website: WebsiteConfig;
  seo: SeoConfig;
  onboarding: OnboardingConfig;
  specialTerms?: string;
  customNotes?: string;
  showProviderStamp?: boolean;
  providerSignatureData?: string;
  showCustomerSignature?: boolean;
  customerSignatureData?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'finalized';
}
