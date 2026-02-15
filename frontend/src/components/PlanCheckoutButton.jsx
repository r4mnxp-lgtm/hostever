import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export const PlanCheckoutButton = ({ plan, planType, location = 'br' }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    const params = new URLSearchParams({
      plan: plan.id,
      name: plan.name,
      type: planType,
      price: plan.price,
      specs: JSON.stringify(plan.specs),
      location: location,
    });

    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center group"
    >
      <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
      Contratar Agora
    </button>
  );
};

export default PlanCheckoutButton;
