import axios from 'axios'

// Use relative API routes (Next.js API routes)
const getApiBaseURL = () => {
  // Always use relative path for Next.js API routes
  return '/api'
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

