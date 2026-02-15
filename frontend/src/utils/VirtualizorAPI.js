
class VirtualizorAPI {
  constructor(apiKey, apiPass, host) {
    this.apiKey = apiKey;
    this.apiPass = apiPass;
    this.host = host;
    this.apiUrl = import.meta.env.VITE_API_URL;
  }

  async _request(action, params = {}) {
    try {
      const response = await fetch(`${this.apiUrl}/virtualizor/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Virtualizor API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[Virtualizor API] Error in ${action}:`, error);
      throw error;
    }
  }

  async getServers() {
    // List dedicated servers
    return this._request('dedicated_servers');
  }

  async getVPS() {
    // List VPS instances
    return this._request('listvs');
  }

  async getServerStatus(vpsId) {
    return this._request('vps_status', { vpsid: vpsId });
  }

  async rebootServer(vpsId) {
    return this._request('restart', { vpsid: vpsId });
  }

  async shutdownServer(vpsId) {
    return this._request('stop', { vpsid: vpsId });
  }

  async startServer(vpsId) {
    return this._request('start', { vpsid: vpsId });
  }

  async createVPS(params) {
    // Requires admin privileges usually
    return this._request('addvs', params);
  }

  async deleteVPS(vpsId) {
    return this._request('deletevs', { vpsid: vpsId });
  }
}

export const virtualizor = new VirtualizorAPI(
  import.meta.env.VITE_VIRTUALIZOR_API_KEY, 
  import.meta.env.VITE_VIRTUALIZOR_API_PASS, 
  import.meta.env.VITE_VIRTUALIZOR_HOST
);

export default VirtualizorAPI;
