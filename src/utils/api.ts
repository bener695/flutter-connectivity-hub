
import { getToken, getRefreshToken, setToken } from './storage';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();
  
  if (!response.ok) {
    // Try to get error message from response
    const errorMessage = isJson && data.detail 
      ? data.detail 
      : `API Error: ${response.status} ${response.statusText}`;
    
    throw new Error(errorMessage);
  }
  
  return data;
};

// Function to add auth token to requests
const getAuthHeaders = () => {
  const token = getToken();
  return token 
    ? { 'Authorization': `Bearer ${token}` } 
    : {};
};

// Login API call
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/userlogin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  return handleResponse(response);
};

// Get user data API call
export const getUserData = async () => {
  const response = await fetch(`${API_BASE_URL}/get-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  
  return handleResponse(response);
};

// Refresh token API call
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await fetch(`${API_BASE_URL}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });
  
  const data = await handleResponse(response);
  setToken(data.access, refresh);
  return data;
};

// Send report with images API call
export const sendReport = async (images: string[]) => {
  const response = await fetch(`${API_BASE_URL}/sent-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ images }),
  });
  
  return handleResponse(response);
};

// Get logs API call with pagination support
export const getLogs = async (page?: number) => {
  const url = page 
    ? `${API_BASE_URL}/get-logs?page=${page}` 
    : `${API_BASE_URL}/get-logs`;
    
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  
  return handleResponse(response);
};

// Get specific log details API call
export const getLogDetail = async (uuid: string) => {
  const response = await fetch(`${API_BASE_URL}/get-logs/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  
  return handleResponse(response);
};
