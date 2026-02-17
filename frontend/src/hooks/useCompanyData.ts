
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const initialCompanyData = {
    name: "HostEver",
    description: "Eleve sua aplicação ao próximo nível com a infraestrutura robusta e performance incomparável da HostEver.",
    contact: {
        email: "contato@hostever.com.br",
        phone: "+55 11 5192-3699",
        address: "São Paulo, Brasil"
    },
    historyP1: "A HostEver nasceu com a missão de democratizar o acesso a infraestrutura de alta performance. Cansados de soluções caras e complexas, decidimos criar uma plataforma que combina poder, simplicidade e um suporte verdadeiramente humano.",
    historyP2: "Com data centers estrategicamente localizados no Brasil e nos Estados Unidos, oferecemos uma rede de baixa latência e alta disponibilidade. Nossos servidores são equipados com o que há de mais moderno em hardware, garantindo a performance que sua aplicação precisa para escalar.",
    historyP3: "Hoje, a HostEver é sinônimo de confiança e inovação, atendendo desde startups em estágio inicial até grandes corporações. Nosso compromisso é com o seu sucesso. Bem-vindo à nuvem, do seu jeito.",
    links: {
        contactExpert: "https://example.com/contact-expert",
        whatsapp: "https://wa.me/551151923699",
        linkedin: "https://linkedin.com/company/hostever",
        instagram: "https://instagram.com/hostever"
    },
    termsOfUse: `Bem-vindo à HostEver! Ao utilizar nossos serviços, você concorda em cumprir estes Termos de Uso. Este documento rege seu acesso e uso de nossos servidores, websites e outros serviços.

**1. Uso dos Serviços**
Você concorda em usar nossos serviços de forma responsável e em conformidade com todas as leis aplicáveis. É estritamente proibido o uso de nossos serviços para atividades ilegais, como envio de spam, hospedagem de conteúdo malicioso, ataques a outras redes ou qualquer outra atividade que viole direitos de terceiros.

**2. Conteúdo do Cliente**
Você é o único responsável por todo o conteúdo que armazena ou transmite através de nossos serviços. A HostEver não monitora ativamente o conteúdo, mas se reserva o direito de suspender ou remover qualquer conteúdo que viole estes termos ou a legislação vigente.

**3. Pagamento e Faturamento**
Os serviços são cobrados de acordo com os preços e ciclos de faturamento estabelecidos no momento da contratação. Atrasos no pagamento podem resultar na suspensão ou cancelamento dos serviços.

**4. Limitação de Responsabilidade**
A HostEver não será responsável por quaisquer danos diretos ou indiretos, incluindo perda de dados ou lucros cessantes, resultantes do uso ou da incapacidade de usar nossos serviços.

**5. Alterações nos Termos**
Podemos modificar estes termos a qualquer momento. As alterações serão notificadas com 30 dias de antecedência. O uso continuado dos serviços após a data de vigência das alterações constituirá sua aceitação dos novos termos.

Última atualização: 27 de Dezembro de 2025`,
    privacyPolicy: `A HostEver ("HostEver", "nós") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e compartilhamos informações sobre você.

**1. Informações que Coletamos**
Coletamos informações que você nos fornece diretamente, como nome, e-mail e informações de pagamento. Também coletamos informações automaticamente quando você usa nossos serviços, como endereço IP, tipo de navegador e dados de uso.

**2. Como Usamos as Informações**
Utilizamos as informações para:
- Fornecer, manter e melhorar nossos serviços;
- Processar transações e enviar informações relacionadas;
- Responder a seus comentários, perguntas e solicitações de suporte;
- Monitorar e analisar tendências, uso e atividades.

**3. Compartilhamento de Informações**
Não compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política ou com o seu consentimento. Podemos compartilhar informações com fornecedores que precisam de acesso para realizar trabalhos em nosso nome.

**4. Seus Direitos**
Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato com nosso suporte.

Última atualização: 27 de Dezembro de 2025`
};

export const useCompanyData = () => {
    // FIX: Add null safety check for useAuth return value
    // We use a try-catch block or conditional logic to handle cases where AuthContext might be missing
    let user = null;
    try {
        const auth = useAuth();
        if (auth) {
            user = auth.user;
        }
    } catch (error) {
        console.warn("useCompanyData: Auth context not available", error);
    }

    const [companyData, setCompanyData] = useState(() => {
        try {
            const savedData = localStorage.getItem('companyData');
            return savedData ? JSON.parse(savedData) : initialCompanyData;
        } catch (error) {
            console.error("Failed to parse company data from localStorage", error);
            return initialCompanyData;
        }
    });

    const saveCompanyData = (newData) => {
        // FIX: Ensure user exists before checking properties
        if (user && (user.type === 'admin' || user.role === 'admin' || user.role === 'super_admin')) {
            localStorage.setItem('companyData', JSON.stringify(newData));
            setCompanyData(newData);
        } else {
            console.error("Ação não autorizada: apenas administradores podem salvar dados da empresa.");
        }
    };
    
    useEffect(() => {
        const savedData = localStorage.getItem('companyData');
        const parsed = savedData ? JSON.parse(savedData) : {};
        // Ensure defaults if local storage is partial or empty, or if name is old, or email needs update
        if (!parsed.name || parsed.name === 'NameHost' || parsed.contact?.email !== initialCompanyData.contact.email) {
             const mergedData = { ...initialCompanyData, ...parsed, name: 'HostEver', contact: { ...initialCompanyData.contact, ...(parsed.contact || {}) } };
             localStorage.setItem('companyData', JSON.stringify(mergedData));
             setCompanyData(mergedData);
        }
    }, []);

    return { companyData, saveCompanyData };
};
