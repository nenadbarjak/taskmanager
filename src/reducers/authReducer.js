const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                token: action.token,
            }
        
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}

export { authReducer as default }