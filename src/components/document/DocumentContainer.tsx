import React, { useState } from 'react';
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
import { CustomerSignatureModal } from '../invoice/CustomerSignatureModal';
import { ProviderSignatureModal } from './ProviderSignatureModal';

interface Props {
  doc: DocumentData;
  isEditable?: boolean;
  onCustomerSignatureChange?: (sigData: string) => void;
  onProviderSignatureChange?: (sigData: string) => void;
  onRemoveProviderSignature?: () => void;
}

export const DocumentContainer: React.FC<Props> = ({ 
  doc, 
  isEditable = false,
  onCustomerSignatureChange,
  onProviderSignatureChange,
  onRemoveProviderSignature
}) => {
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const pricing = calculatePricingAndInclusions(doc);

  const handleOpenCustModal = () => {
    setIsCustModalOpen(true);
  };

  const handleOpenProviderModal = () => {
    setIsProviderModalOpen(true);
  };

  return (
    <>
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
          onCustomerSignatureClick={handleOpenCustModal}
          onProviderStampClick={handleOpenProviderModal}
        />

        {/* 2. Annexure A: Social Media & Content Services */}
        {doc.selectedOfferings.socialMedia && (
          <SocialMediaAnnexure 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.socialMedia} 
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}

        {/* 3. Annexure B: Google Business Profile (GBP) Management */}
        {doc.selectedOfferings.gbp && (
          <GbpAnnexure 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.gbp}
            isComplimentaryBenefit={Boolean(doc.selectedOfferings.socialMedia)}
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}

        {/* 4. Annexure C: Paid Advertising Management */}
        {doc.selectedOfferings.paidAds && (
          <PaidAdsAnnexure 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.paidAds} 
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}

        {/* 5. Annexure D: Website Design, Development & Management */}
        {doc.selectedOfferings.website && (
          <WebsiteAnnexure 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.website} 
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}

        {/* 6. Annexure E: Search Engine Optimisation (SEO) */}
        {doc.selectedOfferings.seo && (
          <SeoAnnexure 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.seo} 
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}

        {/* 7. Annexure F: Consolidated Commercial Schedule / SOW (Always attached) */}
        <AnnexureFCommercialSOW 
          doc={doc} 
          pricing={pricing} 
          annexureLetter={pricing.annexureLetters.commercialSOW} 
          onCustomerSignatureClick={handleOpenCustModal}
          onProviderStampClick={handleOpenProviderModal}
        />

        {/* 8. Annexure G: Customer Onboarding Checklist (If enabled) */}
        {doc.selectedOfferings.onboardingChecklist && (
          <AnnexureGOnboardingChecklist 
            doc={doc} 
            annexureLetter={pricing.annexureLetters.onboardingChecklist} 
            onCustomerSignatureClick={handleOpenCustModal}
            onProviderStampClick={handleOpenProviderModal}
          />
        )}
      </div>

      {/* Customer Digital Signature Modal */}
      <CustomerSignatureModal
        isOpen={isCustModalOpen}
        onClose={() => setIsCustModalOpen(false)}
        onSave={(sigDataUrl) => {
          onCustomerSignatureChange?.(sigDataUrl);
        }}
        initialSignature={doc.customerSignatureData || '/customer-signature-radhika.png'}
        customerName={doc.clientInfo.representativeName || doc.clientInfo.customerName}
        targetName="Agreement & SOW"
      />

      {/* Provider Stamp & Official Signature Modal */}
      <ProviderSignatureModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSave={(sigDataUrl) => {
          onProviderSignatureChange?.(sigDataUrl);
        }}
        onRemove={() => {
          onRemoveProviderSignature?.();
        }}
        initialSignature={doc.providerSignatureData || '/invoice-authorized-sign.png'}
        providerName={`${doc.clientInfo.serviceProviderRep} (${doc.clientInfo.serviceProviderTitle})`}
      />
    </>
  );
};
