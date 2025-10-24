//import axios 
import axios from 'axios'

//create axios instance to handle api requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
  withCredentials: true
})

//export the axios instance
export default api