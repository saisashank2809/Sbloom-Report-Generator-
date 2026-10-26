import React from 'react';
import type { DocumentData } from '../../types/document';
import { calculatePricingAndInclusions } from '../../utils/pricingEngine';
import { CoverMasterAgreement } from './CoverMasterAgreement';
import { SocialMediaAnnexure } from './SocialMediaAnnexure';
import { GbpAnnexure } from './GbpAnnexure';
import { PaidAdsAnnexure } from './PaidAdsAnnexure';
import { WebsiteAnnexure } from './WebsiteAnnexure';
import { SeoAnnexure } from './SeoAnnexure';
import { AnnexureFCommercialSOW } from './AnnexureFCommercialSOW';
import { AnnexureGOnboardingChecklist } from './AnnexureGOnboardingChecklist';

interface Props {
  doc: DocumentData;
  isEditable?: boolean;
}

export const DocumentContainer: React.FC<Props> = ({ doc, isEditable = false }) => {
  const pricing = calculatePricingAndInclusions(doc);

  return (
    <div 
      className={`printable-document ${isEditable ? 'is-live-editing' : ''}`}
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      spellCheck={isEditable}
    >
      {/* 1. Master Services Agreement V2.0 (Cover Metadata + Sections 1-19 + Execution Signatures) */}
      <CoverMasterAgreement 
        doc={doc} 
        attachedAnnexuresList={pricing.attachedAnnexuresList} 
      />

      {/* 2. Annexure A: Social Media & Content Services */}
      {doc.selectedOfferings.socialMedia && (
        <SocialMediaAnnexure 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.socialMedia} 
        />
      )}

      {/* 3. Annexure B: Google Business Profile (GBP) Management */}
      {doc.selectedOfferings.gbp && (
        <GbpAnnexure 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.gbp}
          isComplimentaryBenefit={Boolean(doc.selectedOfferings.socialMedia)}
        />
      )}

      {/* 4. Annexure C: Paid Advertising Management */}
      {doc.selectedOfferings.paidAds && (
        <PaidAdsAnnexure 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.paidAds} 
        />
      )}

      {/* 5. Annexure D: Website Design, Development & Management */}
      {doc.selectedOfferings.website && (
        <WebsiteAnnexure 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.website} 
        />
      )}

      {/* 6. Annexure E: Search Engine Optimisation (SEO) */}
      {doc.selectedOfferings.seo && (
        <SeoAnnexure 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.seo} 
        />
      )}

      {/* 7. Annexure F: Consolidated Commercial Schedule / SOW (Always attached) */}
      <AnnexureFCommercialSOW 
        doc={doc} 
        pricing={pricing} 
        annexureLetter={pricing.annexureLetters.commercialSOW} 
      />

      {/* 8. Annexure G: Customer Onboarding Checklist (If enabled) */}
      {doc.selectedOfferings.onboardingChecklist && (
        <AnnexureGOnboardingChecklist 
          doc={doc} 
          annexureLetter={pricing.annexureLetters.onboardingChecklist} 
        />
      )}
    </div>
  );
};
