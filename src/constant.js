export const ENV = process.env.NODE_ENV
export const API_HOST = ENV === 'development' ? 'http://118.24.172.158:9090/' : 'http://118.24.172.158:9090/'
export const API_BASE_PATH = ENV === 'development' ? '' : ''

export default {
  ENV,
  API_HOST,
  API_BASE_PATH
}
