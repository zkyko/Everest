import axios from 'axios'

// Use relative URL for Docker deployment (nginx will proxy to backend)
// Falls back to localhost for local development
const getApiBaseURL = () => {
  if (typeof window !== 'undefined') {
    // In browser: use environment variable or relative path
    return process.env.NEXT_PUBLIC_API_URL || '/api'
  }
  // Server-side: use environment variable or localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
}

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'X-Tenant-Slug': 'everest',
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 second timeout
})

// Add token if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api

