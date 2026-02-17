import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Check, CreditCard, Lock, AlertCircle, User, ArrowRight, ArrowLeft, Package, Settings, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signUp, api } = useAuth();
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedLocation, setSelectedLocation] = useState('br');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpfCnpj: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    acceptedTerms: false,
  });

  const planId = searchParams.get('plan');
  const planName = searchParams.get('name');
  const planType = searchParams.get('type');
  const planPrice = searchParams.get('price');
  const planSpecs = searchParams.get('specs');
  const locationParam = searchParams.get('location') || 'br';

  useEffect(() => {
    setSelectedLocation(locationParam);
  }, [locationParam]);

  useEffect(() => {
    if (user && currentStep === 3) {
      setCurrentStep(4);
    }
  }, [user, currentStep]);

  if (!planId || !planName || !planType || !planPrice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plano Inválido</h2>
          <p className="text-gray-600 mb-4">Não foi possível carregar as informações do plano.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  const specs = planSpecs ? JSON.parse(decodeURIComponent(planSpecs)) : {};
  const price = parseFloat(planPrice.replace(',', '.'));
  const monthlyPrice = price;
  const yearlyPrice = price * 12 * 0.85;
  const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

  const steps = [
    { number: 1, title: 'Produto', icon: Package },
    { number: 2, title: 'Configuração', icon: Settings },
    { number: 3, title: 'Conta', icon: User },
    { number: 4, title: 'Pagamento', icon: CreditCard },
  ];

  const applyMaskCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
    }
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .substring(0, 18);
  };

  const applyMaskPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const applyMaskCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cpfCnpj') {
      maskedValue = applyMaskCPF(value);
    } else if (name === 'phone') {
      maskedValue = applyMaskPhone(value);
    } else if (name === 'cep') {
      maskedValue = applyMaskCEP(value);
      
      // Buscar CEP automaticamente quando tiver 8 dígitos
      const cleanCEP = maskedValue.replace(/\D/g, '');
      if (cleanCEP.length === 8) {
        setLoadingCEP(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              cep: maskedValue,
              street: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || '',
              complement: data.complemento || prev.complement,
            }));
            setLoadingCEP(false);
            return;
          } else {
            showToast({
              variant: "destructive",
              title: "CEP não encontrado",
              description: "Verifique o CEP digitado",
            });
          }
        } catch (error) {
          showToast({
            variant: "destructive",
            title: "Erro ao buscar CEP",
            description: "Tente novamente",
          });
        } finally {
          setLoadingCEP(false);
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
  };

  const fetchAddressByCEP = async () => {
    const cleanCEP = formData.cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      showToast({
        variant: "destructive",
        title: "CEP Inválido",
        description: "Digite um CEP com 8 dígitos",
      });
      return;
    }

    setLoadingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        showToast({
          variant: "destructive",
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        complement: data.complemento || prev.complement,
      }));
      
      showToast({
        title: "Endereço encontrado!",
        description: "Os campos foram preenchidos automaticamente",
      });
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Tente novamente em alguns instantes",
      });
    } finally {
      setLoadingCEP(false);
    }
  };

  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;
    if (digit1 !== parseInt(numbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;
    if (digit2 !== parseInt(numbers.charAt(10))) return false;

    return true;
  };

  const validateCNPJ = (cnpj) => {
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(numbers)) return false;

    let size = numbers.length - 2;
    let nums = numbers.substring(0, size);
    const digits = numbers.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += nums.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;

    size = size + 1;
    nums = numbers.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += nums.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;

    return true;
  };

  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha nome, e-mail e senha",
      });
      return;
    }

    if (formData.cpfCnpj) {
      const numbers = formData.cpfCnpj.replace(/\D/g, '');
      const isValid = numbers.length === 11 ? validateCPF(formData.cpfCnpj) : validateCNPJ(formData.cpfCnpj);
      
      if (!isValid) {
        showToast({
          variant: "destructive",
          title: "CPF/CNPJ Inválido",
          description: "Verifique o CPF/CNPJ digitado",
        });
        return;
      }
    }

    if (!formData.acceptedTerms) {
      showToast({
        variant: "destructive",
        title: "Termos de Uso",
        description: "Você precisa aceitar os termos de uso para continuar",
      });
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        cpf_cnpj: formData.cpfCnpj || null,
        cep: formData.cep || null,
        street: formData.street || null,
        number: formData.number || null,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood || null,
        city: formData.city || null,
        state: formData.state || null,
        accepted_terms: true,
      });
      
      showToast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso",
      });
      
      setCurrentStep(4);
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.response?.data?.error || "Erro ao criar conta",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para finalizar a compra",
      });
      return;
    }

    setLoading(true);
    setProcessingPayment(true);
    
    try {
      const orderResponse = await api.post('/orders/create', {
        planId,
        planName,
        planType,
        planPrice: currentPrice.toFixed(2),
        planSpecs: specs,
        billingCycle,
        location: selectedLocation,
      });

      if (orderResponse.data.success) {
        const paymentResponse = await api.post('/orders/create-payment', {
          invoiceId: orderResponse.data.invoiceId,
          amount: currentPrice,
          description: `${planName} - ${billingCycle === 'monthly' ? 'Mensal' : 'Anual'}`,
        });

        if (paymentResponse.data.success) {
          window.location.href = paymentResponse.data.init_point;
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast({
        variant: "destructive",
        title: "Erro no Checkout",
        description: error.response?.data?.error || "Erro ao processar pedido",
      });
      setProcessingPayment(false);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{planName}</h3>
        <p className="text-gray-600 text-sm mb-4">
          Tipo: <span className="font-semibold capitalize">{planType.replace('-', ' ')}</span>
        </p>
        
        <div className="space-y-2 mb-4">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex items-center text-gray-700">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="capitalize text-sm">{key}: <span className="font-semibold">{value}</span></span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Preço a partir de</div>
          <div className="text-3xl font-bold text-[#FFA500]">
            R$ {monthlyPrice.toFixed(2).replace('.', ',')}
            <span className="text-lg text-gray-500">/mês</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setCurrentStep(2)}
        className="w-full bg-[#FFA500] hover:bg-[#FFA500] h-12 text-base font-bold"
      >
        Continuar <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-900">Ciclo de Cobrança</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`p-5 border-2 rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'border-[#FFA500] bg-[#FFA500]/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-bold text-gray-900 text-base">Mensal</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              R$ {monthlyPrice.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-gray-600 mt-1">cobrado mensalmente</div>
          </button>

          <button
            onClick={() => setBillingCycle('yearly')}
            className={`p-5 border-2 rounded-xl transition-all relative ${
              billingCycle === 'yearly'
                ? 'border-[#FFA500] bg-[#FFA500]/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="absolute -top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
              15% OFF
            </div>
            <div className="font-bold text-gray-900 text-base">Anual</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              R$ {yearlyPrice.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-gray-600 mt-1">R$ {(yearlyPrice / 12).toFixed(2).replace('.', ',')}/mês • cobrado anualmente</div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-900">Localização do Servidor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedLocation('br')}
            className={`p-5 border-2 rounded-xl transition-all ${
              selectedLocation === 'br'
                ? 'border-[#FFA500] bg-[#FFA500]/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-4xl mb-2">🇧🇷</div>
            <div className="font-bold text-gray-900 text-lg">Brasil</div>
            <div className="text-sm text-gray-600 mt-1">São Paulo, SP</div>
          </button>

          <button
            onClick={() => setSelectedLocation('us')}
            className={`p-5 border-2 rounded-xl transition-all ${
              selectedLocation === 'us'
                ? 'border-[#FFA500] bg-[#FFA500]/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-4xl mb-2">🇺🇸</div>
            <div className="font-bold text-gray-900 text-lg">Estados Unidos</div>
            <div className="text-sm text-gray-600 mt-1">Miami, Florida</div>
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="flex-1 h-12 text-base"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </Button>
        <Button 
          onClick={() => setCurrentStep(user ? 4 : 3)}
          className="flex-1 bg-[#FFA500] hover:bg-[#FFA500] h-12 text-base font-bold"
        >
          Continuar <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Você já está logado!</h3>
          </div>
          <p className="text-gray-700 mb-3">
            <strong>{user.name}</strong><br />
            {user.email}
          </p>
          <Button 
            onClick={() => setCurrentStep(4)}
            className="w-full bg-[#FFA500] hover:bg-[#FFA500] h-12 text-base font-bold"
          >
            Continuar para Pagamento <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Já tem uma conta?</strong>{' '}
              <button
                onClick={() => navigate('/login?redirect=/checkout?' + searchParams.toString())}
                className="text-[#FFA500] font-bold hover:underline"
              >
                Faça login aqui
              </button>
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-900 font-semibold">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-gray-900 font-semibold">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-900 font-semibold">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-900 font-semibold">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="mt-1.5 h-11"
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="cpfCnpj" className="text-gray-900 font-semibold">CPF / CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  type="text"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className="mt-1.5 h-11"
                  maxLength={18}
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-bold text-gray-900 mb-3">Endereço</h4>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="cep" className="text-gray-900 font-semibold">
                    CEP * {loadingCEP && <span className="text-xs text-gray-500">(buscando...)</span>}
                  </Label>
                  <Input
                    id="cep"
                    name="cep"
                    type="text"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000 (preenche automaticamente)"
                    className="mt-1.5 h-11"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="street" className="text-gray-900 font-semibold">Rua *</Label>
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Nome da rua"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="number" className="text-gray-900 font-semibold">Número *</Label>
                  <Input
                    id="number"
                    name="number"
                    type="text"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="complement" className="text-gray-900 font-semibold">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    type="text"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Apto, bloco, etc"
                    className="mt-1.5 h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="neighborhood" className="text-gray-900 font-semibold">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Nome do bairro"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-gray-900 font-semibold">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Nome da cidade"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-gray-900 font-semibold">Estado *</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="UF"
                    className="mt-1.5 h-11"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptedTerms: checked })}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  Li e aceito os{' '}
                  <Link to="/termos-de-uso" target="_blank" className="text-[#FFA500] font-bold hover:underline">
                    Termos de Uso
                  </Link>
                  {' '}e a{' '}
                  <Link to="/politica-de-privacidade" target="_blank" className="text-[#FFA500] font-bold hover:underline">
                    Política de Privacidade
                  </Link>
                  {' '}da HostEver *
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
            </Button>
            <Button 
              onClick={handleSignUp}
              disabled={loading || !formData.acceptedTerms}
              className="flex-1 bg-[#FFA500] hover:bg-[#FFA500] h-12 text-base font-bold disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Resumo do Pedido</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plano</span>
            <span className="font-semibold text-gray-900">{planName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ciclo</span>
            <span className="font-semibold text-gray-900">{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Localização</span>
            <span className="font-semibold text-gray-900">{selectedLocation === 'br' ? '🇧🇷 Brasil' : '🇺🇸 EUA'}</span>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Desconto Anual (15%)</span>
                <span>-R$ {(price * 12 * 0.15).toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
              <span>Total</span>
              <span className="text-[#FFA500]">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-2">Informações da Conta</h4>
          <p className="text-sm text-gray-700">
            <strong>{user.name}</strong><br />
            {user.email}
          </p>
        </div>
      )}

      <Button
        onClick={handleCheckout}
        disabled={loading || processingPayment}
        className="w-full bg-[#FFA500] hover:bg-[#FFA500] h-14 text-lg font-bold shadow-lg"
      >
        {processingPayment ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processando...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Prosseguir para Pagamento
          </>
        )}
      </Button>

      <div className="flex items-center justify-center text-xs text-gray-500 gap-2">
        <Lock className="w-4 h-4" />
        Pagamento 100% seguro via MercadoPago
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">O que acontece depois?</h4>
        <ul className="text-xs text-gray-600 space-y-1.5">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Você será redirecionado para o MercadoPago
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Após a confirmação do pagamento, seu serviço será ativado
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Você receberá um email com os detalhes de acesso
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Suporte 24/7 disponível para ajudá-lo
          </li>
        </ul>
      </div>

      <Button 
        onClick={() => setCurrentStep(user ? 2 : 3)}
        variant="outline"
        className="w-full h-11 text-base"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Pedido</h1>
          <p className="text-gray-600">Siga os passos para concluir sua contratação</p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-[#FFA500] text-white shadow-lg scale-110' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-2 text-xs font-semibold hidden sm:block ${
                      isActive ? 'text-[#FFA500]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
