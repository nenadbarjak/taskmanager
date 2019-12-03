import axios from '../services/axiosPreset'

export const signUp = (payload) => axios.post('/users', payload)

export const signIn = (payload) => axios.post('/users/login', payload)

export const logOut = () => axios.post('/users/logout')

export const logOutAll = () => axios.post('/users/logoutAll')

export const deleteUser = () => axios.delete('/users/me')
