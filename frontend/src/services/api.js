// Frontend API Client for SahakarGig (Express + MongoDB)

const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (typeof window !== 'undefined' && window.location.port === '3000' ? 'http://localhost:5000/api' : '/api');

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return data || { error: res.statusText, status: res.status, verified: false };
    }
    return data;
  } catch (error) {
    // Graceful fallback for local development if server is restarting
    console.warn(`[API Warning] ${endpoint}:`, error.message);
    return null;
  }
}

export const api = {
  // Health & MongoDB Status
  checkHealth: async () => {
    return await fetchJson('/health');
  },

  // Services
  getServices: async () => {
    return await fetchJson('/services');
  },

  // Workers
  getWorkers: async () => {
    return await fetchJson('/workers');
  },
  getWorker: async (id) => {
    return await fetchJson(`/workers/${id}`);
  },
  registerWorker: async (workerData) => {
    return await fetchJson('/workers', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
  },
  updateWorkerWallet: async (id, walletData) => {
    return await fetchJson(`/workers/${id}/wallet`, {
      method: 'PATCH',
      body: JSON.stringify(walletData),
    });
  },

  // Bookings
  getBookings: async () => {
    return await fetchJson('/bookings');
  },
  createBooking: async (bookingData) => {
    return await fetchJson('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  updateBooking: async (id, updates) => {
    return await fetchJson(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Governance Proposals
  getProposals: async () => {
    return await fetchJson('/proposals');
  },
  createProposal: async (proposalData) => {
    return await fetchJson('/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  },
  voteProposal: async (id, voteType) => {
    return await fetchJson(`/proposals/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },

  // Disputes
  getDisputes: async () => {
    return await fetchJson('/disputes');
  },
  resolveDispute: async (id, verdict) => {
    return await fetchJson(`/disputes/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ verdict }),
    });
  },

  // Welfare Metrics
  getWelfareMetrics: async () => {
    return await fetchJson('/welfare');
  },
  getMinistryStats: async () => {
    return await fetchJson('/ministry-stats');
  },

  // Real OTP Authentication (Email & SMS/WhatsApp)
  sendOtp: async ({ type, recipient, role, name }) => {
    return await fetchJson('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ type, recipient, role, name }),
    });
  },
  verifyOtp: async ({ recipient, otp }) => {
    return await fetchJson('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ recipient, otp }),
    });
  },
};
