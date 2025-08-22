const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class SnipService {
  async getAllSnips() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/snips`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching snips:', error);
      throw error;
    }
  }

  async getSnip(trackId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/snips/${trackId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching snip:', error);
      throw error;
    }
  }

  async saveSnip(trackId, snipData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/snips/${trackId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snipData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving snip:', error);
      throw error;
    }
  }

  async deleteSnip(trackId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/snips/${trackId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting snip:', error);
      throw error;
    }
  }
}

export default new SnipService();