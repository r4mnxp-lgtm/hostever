class MercadoPagoAPI {
  constructor(publicKey) {
    this.publicKey = publicKey;
    this.apiUrl = import.meta.env.VITE_API_URL;
  }

  async createPreference(data) {
    try {
      const response = await fetch(`${this.apiUrl}/mercadopago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment preference');
      }

      return await response.json();
    } catch (error) {
      console.error('[MercadoPago API] Error creating preference:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.apiUrl}/mercadopago/payment/${paymentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('[MercadoPago API] Error getting payment status:', error);
      throw error;
    }
  }

  loadMercadoPagoScript() {
    return new Promise((resolve, reject) => {
      if (window.MercadoPago) {
        resolve(window.MercadoPago);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        if (window.MercadoPago) {
          resolve(window.MercadoPago);
        } else {
          reject(new Error('MercadoPago SDK failed to load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load MercadoPago SDK'));
      };

      document.head.appendChild(script);
    });
  }

  async initCheckout(preferenceId, containerId = 'mercadopago-checkout') {
    try {
      const mp = await this.loadMercadoPagoScript();
      const mercadopago = new mp(this.publicKey);

      const checkout = mercadopago.checkout({
        preference: {
          id: preferenceId,
        },
        autoOpen: true,
      });

      return checkout;
    } catch (error) {
      console.error('[MercadoPago API] Error initializing checkout:', error);
      throw error;
    }
  }
}

export const mercadoPago = new MercadoPagoAPI(
  import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
);

export default MercadoPagoAPI;
