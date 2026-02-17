import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const strength = calculateStrength();

  const getStrengthLabel = () => {
    if (strength < 30) return { text: 'Fraca', color: 'bg-red-500' };
    if (strength < 60) return { text: 'Média', color: 'bg-yellow-500' };
    if (strength < 80) return { text: 'Boa', color: 'bg-blue-500' };
    return { text: 'Forte', color: 'bg-green-500' };
  };

  const requirements = [
    { text: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { text: 'Letras maiúsculas e minúsculas', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { text: 'Pelo menos um número', met: /\d/.test(password) },
    { text: 'Caractere especial (!@#$%)', met: /[^A-Za-z0-9]/.test(password) }
  ];

  if (!password) return null;

  const strengthInfo = getStrengthLabel();

  return (
    <div className="mt-2 space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-600">Força da senha:</span>
          <span className={`font-semibold ${
            strength < 30 ? 'text-red-600' : 
            strength < 60 ? 'text-yellow-600' : 
            strength < 80 ? 'text-blue-600' : 'text-green-600'
          }`}>
            {strengthInfo.text}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${strengthInfo.color} transition-all duration-300 ease-out`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
