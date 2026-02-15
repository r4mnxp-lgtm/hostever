import React from 'react';
import { Helmet } from 'react-helmet';
import { useCompanyData } from '@/hooks/useCompanyData';
import LegalPageLayout from './LegalPageLayout';

const TermsOfUse = () => {
    const { companyData } = useCompanyData();
    const lastUpdated = companyData.termsOfUse.match(/Última atualização: (.*)/)?.[1] || 'data não especificada';

    return (
        <>
            <Helmet>
                <title>Termos de Uso - Avyra</title>
                <meta name="description" content="Leia os Termos de Uso que regem o uso dos serviços da Avyra." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <LegalPageLayout 
                title="Termos de Uso"
                content={companyData.termsOfUse}
                lastUpdated={lastUpdated}
            />
        </>
    );
};

export default TermsOfUse;