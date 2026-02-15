import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#FFB833] hover:text-[#FFA500] mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos de Uso</h1>
          <p className="text-gray-600 mb-8">Última atualização: 09 de Fevereiro de 2026</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar os serviços da HostEver, você concorda em cumprir e estar vinculado aos seguintes 
                termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar 
                nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
              <p className="mb-4">
                A HostEver fornece serviços de hospedagem web, servidores VPS, servidores dedicados e outros 
                serviços relacionados. Reservamo-nos o direito de modificar ou descontinuar qualquer serviço 
                a qualquer momento, sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Conta de Usuário</h2>
              <div className="space-y-3">
                <p>Ao criar uma conta, você concorda em:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer informações verdadeiras, precisas, atuais e completas</li>
                  <li>Manter a segurança de sua senha e identificação</li>
                  <li>Ser totalmente responsável por todas as atividades que ocorram em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em NÃO usar nossos serviços para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Atividades ilegais ou não autorizadas</li>
                <li>Distribuição de vírus, malware ou qualquer código malicioso</li>
                <li>Spam, phishing ou qualquer forma de comunicação não solicitada</li>
                <li>Violação de direitos autorais, marcas registradas ou outros direitos de propriedade intelectual</li>
                <li>Hospedar conteúdo adulto, violento ou ofensivo</li>
                <li>Realizar ataques DDoS ou outras formas de ataque cibernético</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagamentos e Reembolsos</h2>
              <div className="space-y-3">
                <p><strong>5.1 Pagamentos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Todos os serviços devem ser pagos antecipadamente</li>
                  <li>Os pagamentos são processados através do MercadoPago</li>
                  <li>Os preços estão sujeitos a alterações mediante aviso prévio</li>
                </ul>
                
                <p className="mt-4"><strong>5.2 Reembolsos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Oferecemos garantia de reembolso de 7 dias para novos clientes</li>
                  <li>Após 7 dias, não haverá reembolso de valores pagos</li>
                  <li>Violações dos Termos de Uso não são elegíveis para reembolso</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Suspensão e Término</h2>
              <p className="mb-4">
                Reservamo-nos o direito de suspender ou encerrar sua conta imediatamente, sem aviso prévio, 
                se violarmos estes Termos de Uso. Em caso de suspensão ou término, você permanecerá responsável 
                por todas as cobranças até a data de encerramento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Backup e Segurança</h2>
              <p className="mb-4">
                Embora realizemos backups regulares, você é o único responsável por manter cópias de segurança 
                de seus dados. A HostEver não se responsabiliza por perda de dados, independentemente da causa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                A HostEver não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais 
                ou punitivos decorrentes do uso ou da incapacidade de usar nossos serviços, incluindo, mas não se 
                limitando a, perda de lucros, dados ou outros intangíveis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações dos Termos</h2>
              <p className="mb-4">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação. O uso continuado dos serviços após as alterações constitui 
                aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p className="mb-4">
                Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa 
                relacionada a estes termos será resolvida nos tribunais brasileiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul className="space-y-2">
                <li><strong>E-mail:</strong> suporte@hostever.com</li>
                <li><strong>Telefone:</strong> (11) 3000-0000</li>
                <li><strong>Endereço:</strong> São Paulo, SP, Brasil</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Ao criar uma conta ou usar nossos serviços, você concorda com estes Termos de Uso e nossa{' '}
              <Link to="/politica-de-privacidade" className="text-[#FFB833] hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;
