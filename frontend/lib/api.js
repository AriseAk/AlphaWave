const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  // Sentiment analysis (POST JSON)
  async sentiment(payload) {
    const response = await fetch(`${API_BASE_URL}/api/sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // Predict endpoint (POST JSON)
  async predict(payload) {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // Risk score endpoint (POST JSON)
  async riskScore(payload) {
    const response = await fetch(`${API_BASE_URL}/api/risk-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // Get user portfolio by user_id
  async getPortfolio(userId) {
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${encodeURIComponent(userId)}`);
    return response.json();
  },

  // Trade execution for user portfolio (POST JSON)
  async portfolioTrade(userId, tradePayload) {
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${encodeURIComponent(userId)}/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tradePayload),
    });
    return response.json();
  },

  // Leaderboard get top users
  async getLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
    return response.json();
  },

  // Update leaderboard entry (POST JSON)
  async updateLeaderboard(payload) {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // Complete a challenge (POST JSON)
  async completeChallenge(payload) {
    const response = await fetch(`${API_BASE_URL}/api/challenge/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // Reset user data (dev endpoint, POST no body)
  async resetUser(userId) {
    const response = await fetch(`${API_BASE_URL}/api/user/reset/${encodeURIComponent(userId)}`, {
      method: 'POST',
    });
    return response.json();
  },

  // OAuth Google auth redirect URL (just return as string)
  getGoogleAuthUrl() {
    return `${API_BASE_URL}/auth/google`;
  }
};
