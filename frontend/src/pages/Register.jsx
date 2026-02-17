import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { User, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  
  const [loading, setLoading] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailConfirm: '',
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
            return; // Sai da função para não atualizar formData novamente
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

    if (formData.email !== formData.emailConfirm) {
      showToast({
        variant: "destructive",
        title: "E-mails não correspondem",
        description: "Os e-mails digitados não são iguais",
      });
      return;
    }

    if (formData.password.length < 8) {
      showToast({
        variant: "destructive",
        title: "Senha fraca",
        description: "A senha deve ter no mínimo 8 caracteres",
      });
      return;
    }

    if (!formData.phone) {
      showToast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Preencha o telefone",
      });
      return;
    }

    if (!formData.cpfCnpj) {
      showToast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Preencha o CPF/CNPJ",
      });
      return;
    }

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

    if (!formData.cep || !formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state) {
      showToast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos de endereço",
      });
      return;
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
        phone: formData.phone,
        cpf_cnpj: formData.cpfCnpj,
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        accepted_terms: true,
      });

      await signIn(formData.email, formData.password);
      
      showToast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso",
      });
      
      navigate('/client-dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Já tem uma conta?</strong>{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#FFB833] font-bold hover:underline"
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

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="email" className="text-gray-900 font-semibold">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@exemplo.com"
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="emailConfirm" className="text-gray-900 font-semibold">Confirmar E-mail *</Label>
                <Input
                  id="emailConfirm"
                  name="emailConfirm"
                  type="email"
                  value={formData.emailConfirm}
                  onChange={handleInputChange}
                  placeholder="Digite o e-mail novamente"
                  className="mt-1.5 h-11"
                  required
                />
                {formData.emailConfirm && formData.email !== formData.emailConfirm && (
                  <p className="text-xs text-red-500 mt-1">Os e-mails não correspondem</p>
                )}
                {formData.emailConfirm && formData.email === formData.emailConfirm && (
                  <p className="text-xs text-green-600 mt-1">✓ E-mails correspondem</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-900 font-semibold">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Crie uma senha forte"
                  className="mt-1.5 h-11"
                  required
                />
                <PasswordStrengthMeter password={formData.password} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-900 font-semibold">Telefone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="mt-1.5 h-11"
                  maxLength={15}
                  required
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
                  <Link to="/termos-de-uso" target="_blank" className="text-[#FFB833] font-bold hover:underline">
                    Termos de Uso
                  </Link>
                  {' '}e a{' '}
                  <Link to="/politica-de-privacidade" target="_blank" className="text-[#FFB833] font-bold hover:underline">
                    Política de Privacidade
                  </Link>
                  {' '}da HostEver *
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleSignUp}
              disabled={loading || !formData.acceptedTerms}
              className="w-full bg-[#FFB833] hover:bg-[#FFA500] h-12 text-base font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </>
              ) : (
                <>
                  Criar Conta <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
