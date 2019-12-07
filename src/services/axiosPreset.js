import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:9000'
})

export const setAxiosToken = (token) => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete instance.defaults.headers.common['Authorization']
    }
}

export default instance