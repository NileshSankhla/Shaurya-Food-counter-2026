const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
    
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error')
    }
    
    return data
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error)
    throw error
  }
}

export const login = (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export const verifyScan = (studentId, mealType) => {
  return apiRequest('/scan/verify', {
    method: 'POST',
    body: JSON.stringify({ studentId, mealType }),
  })
}

export const getHistory = () => {
  return apiRequest('/scan/history')
}

export const getStats = () => {
  return apiRequest('/scan/stats')
}
