import axios from 'axios';

/* This communicates with the server, that can be found in the server folder. Each new 
    Function that is implemented on the server should get a corresponding function here. */
class ApiService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async resizeImage(imageData: string): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/formatToFtype`, { imageData });
      return response.data;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  // Additional methods for the API service can be added here
}

export default ApiService;