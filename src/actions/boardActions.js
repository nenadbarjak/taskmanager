import axios from '../services/axiosPreset'

export const getBoards = () => axios.get('/boards')

export const addBoard = (board) => axios.post('/boards', board)

export const editBoard = (boardId, payload) => axios.patch(`/boards/${boardId}`, payload)

export const deleteBoard = (boardId) => axios.delete(`/boards/${boardId}`)

export const addList = (payload) => axios.post('/boards/lists', payload)

export const editListTitle = (boardId, listId, payload) => axios.patch(`/boards/${boardId}/lists/${listId}`, payload)

export const deleteList = (boardId, listId) => axios.delete(`/boards/${boardId}/lists/${listId}`)

export const addCard = (payload) => axios.post('/boards/lists/cards', payload)

export const editCard = (boardId, listId, cardId, payload) => axios.patch(`/boards/${boardId}/lists/${listId}/cards/${cardId}`, payload)

export const deleteCard = (boardId, listId, cardId) => axios.delete(`/boards/${boardId}/lists/${listId}/cards/${cardId}`)

export const addChecklistItem = (payload) => axios.post('/boards/lists/cards/checklist', payload)

export const editChecklistItem = (boardId, listId, cardId, checklistItemId, payload) => axios.patch(`/boards/${boardId}/lists/${listId}/cards/${cardId}/checklist/${checklistItemId}`, payload)

export const deleteChecklistItem = (boardId, listId, cardId, checklistItemId) => axios.delete(`/boards/${boardId}/lists/${listId}/cards/${cardId}/checklist/${checklistItemId}`)

export const dragAndDrop = (payload) => axios.patch('/drag', payload)