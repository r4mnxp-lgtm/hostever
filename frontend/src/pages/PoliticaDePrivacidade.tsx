import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#FFA500] hover:text-[#FFA500] mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-gray-600 mb-8">Última atualização: 09 de Fevereiro de 2026</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <p className="mb-4">
                A HostEver ("nós", "nosso" ou "nos") está comprometida em proteger sua privacidade. Esta Política 
                de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando 
                você utiliza nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Informações Pessoais</h3>
                  <p className="mb-2">Coletamos as seguintes informações quando você cria uma conta:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Número de telefone</li>
                    <li>CPF ou CNPJ</li>
                    <li>Endereço completo (CEP, rua, número, bairro, cidade, estado)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2.2 Informações de Pagamento</h3>
                  <p>
                    Os dados de pagamento são processados através do MercadoPago. Não armazenamos informações 
                    completas de cartão de crédito em nossos servidores.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2.3 Informações Técnicas</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador</li>
                    <li>Sistema operacional</li>
                    <li>Páginas visitadas</li>
                    <li>Data e hora de acesso</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Como Usamos Suas Informações</h2>
              <p className="mb-3">Utilizamos as informações coletadas para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar confirmações</li>
                <li>Enviar informações técnicas, atualizações e alertas de segurança</li>
                <li>Responder aos seus comentários, perguntas e solicitações de suporte</li>
                <li>Monitorar e analisar tendências, uso e atividades</li>
                <li>Detectar, prevenir e resolver problemas técnicos</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-4">Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas com:</p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Prestadores de Serviços</h3>
                  <p>
                    Compartilhamos informações com terceiros que fornecem serviços em nosso nome, como 
                    processamento de pagamentos (MercadoPago), análise de dados e suporte ao cliente.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Requisitos Legais</h3>
                  <p>
                    Podemos divulgar suas informações se exigido por lei ou em resposta a solicitações 
                    válidas de autoridades públicas.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Proteção de Direitos</h3>
                  <p>
                    Podemos divulgar informações quando acreditamos ser necessário para proteger nossos 
                    direitos, propriedade ou segurança, ou os de outros.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p className="mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Senhas criptografadas com hash bcrypt</li>
                <li>Firewalls e sistemas de detecção de intrusão</li>
                <li>Backups regulares e seguros</li>
                <li>Acesso restrito apenas a funcionários autorizados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retenção de Dados</h2>
              <p className="mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
                descritos nesta Política de Privacidade, incluindo requisitos legais, contábeis ou de relatório.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Seus Direitos</h2>
              <p className="mb-3">De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acesso:</strong> Solicitar acesso às suas informações pessoais</li>
                <li><strong>Correção:</strong> Solicitar correção de informações imprecisas ou incompletas</li>
                <li><strong>Exclusão:</strong> Solicitar exclusão de suas informações pessoais</li>
                <li><strong>Portabilidade:</strong> Solicitar transferência de seus dados para outro provedor</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações pessoais</li>
                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              </ul>
              <p className="mt-4">
                Para exercer esses direitos, entre em contato conosco através de suporte@hostever.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies e Tecnologias Similares</h2>
              <p className="mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site 
                e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies, mas isso pode 
                afetar sua capacidade de usar alguns recursos do site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Links para Sites de Terceiros</h2>
              <p className="mb-4">
                Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelas práticas de 
                privacidade ou conteúdo desses sites. Recomendamos que você leia as políticas de privacidade 
                de qualquer site de terceiros que visitar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacidade de Menores</h2>
              <p className="mb-4">
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores. Se tomarmos conhecimento de que coletamos informações de 
                um menor sem consentimento parental, tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Alterações nesta Política</h2>
              <p className="mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                alterações significativas publicando a nova política em nosso site com uma data de atualização 
                revisada. Recomendamos que você revise esta política regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre nossas práticas de dados, 
                entre em contato conosco:
              </p>
              <ul className="space-y-2">
                <li><strong>E-mail:</strong> privacidade@hostever.com</li>
                <li><strong>E-mail de Suporte:</strong> suporte@hostever.com</li>
                <li><strong>Telefone:</strong> (11) 3000-0000</li>
                <li><strong>Endereço:</strong> São Paulo, SP, Brasil</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Conformidade com a LGPD</h2>
              <p className="mb-4">
                A HostEver está comprometida em cumprir todas as disposições da Lei Geral de Proteção de Dados 
                (LGPD - Lei nº 13.709/2018). Tratamos dados pessoais de forma transparente, segura e em conformidade 
                com os princípios estabelecidos pela legislação brasileira.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Ao usar nossos serviços, você concorda com esta Política de Privacidade e nossos{' '}
              <Link to="/termos-de-uso" className="text-[#FFA500] hover:underline">
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaDePrivacidade;
