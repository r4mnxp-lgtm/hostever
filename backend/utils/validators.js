import axios from 'axios';

export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

export function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

export function validateCPFCNPJ(value) {
  const cleaned = value.replace(/[^\d]+/g, '');
  
  if (cleaned.length === 11) {
    return validateCPF(cleaned);
  } else if (cleaned.length === 14) {
    return validateCNPJ(cleaned);
  }
  
  return false;
}

export async function fetchAddressByCEP(cep) {
  try {
    const cleanCEP = cep.replace(/[^\d]+/g, '');
    
    if (cleanCEP.length !== 8) {
      throw new Error('CEP inválido');
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: response.data.cep,
      street: response.data.logradouro,
      complement: response.data.complemento,
      neighborhood: response.data.bairro,
      city: response.data.localidade,
      state: response.data.uf,
      ibge: response.data.ibge,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('CEP não encontrado');
    }
    throw error;
  }
}

export function formatCPF(value) {
  const cleaned = value.replace(/[^\d]+/g, '');
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
}

export function formatCNPJ(value) {
  const cleaned = value.replace(/[^\d]+/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatPhone(value) {
  const cleaned = value.replace(/[^\d]+/g, '');
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatCEP(value) {
  const cleaned = value.replace(/[^\d]+/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}
