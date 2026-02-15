import React from 'react';
import { Helmet } from 'react-helmet';
import { useCompanyData } from '@/hooks/useCompanyData';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPolicy = () => {
    const { companyData } = useCompanyData();
    const lastUpdated = companyData.privacyPolicy.match(/Última atualização: (.*)/)?.[1] || 'data não especificada';

    return (
        <>
            <Helmet>
                <title>Política de Privacidade - Avyra</title>
                <meta name="description" content="Entenda como a Avyra coleta, usa e protege suas informações pessoais." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <LegalPageLayout 
                title="Política de Privacidade"
                content={companyData.privacyPolicy}
                lastUpdated={lastUpdated}
            />
        </>
    );
};

export default PrivacyPolicy;