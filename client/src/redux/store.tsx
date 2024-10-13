import { createStore, combineReducers, Reducer } from "redux";
import Cookies from "js-cookie";

interface actiontype {
    type: string;
    payload: any
}

// user----------------------------------------------------------------------------

// user state  - reducer
const user: Reducer<{} | null, actiontype> = (prevState = null, action) => {
    if (action.type === 'profile-update') {
        return action.payload
    } else {
        return prevState
    }
}

//  user token state - reducer
const initialUserToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null

const userToken: Reducer<string | null, actiontype> = (prevState = initialUserToken, action) => {
    if (action.type === 'set-token') {
        return action.payload
    }
    else {
        return prevState
    }
}

// admin-----------------------------------------------------------------------------------

// admin state - reducer
const admin: Reducer<{} | null, actiontype> = (prevState = null, action) => {
    if (action.type === 'update-admin') {
        return action.payload
    } else {
        return prevState
    }
}

// admin token - reducer
const initialAdminToken = Cookies.get('adminAccessToken') ? Cookies.get('adminAccessToken') : null

const adminToken: Reducer<string | null, actiontype> = (prevState = initialAdminToken, action) => {
    if (action.type === 'set-token-admin') {
        return action.payload
    } else {
        return prevState
    }
}


// app reducers contained all reducers
const appReducer = combineReducers<any>({
    user,
    userToken,
    admin,
    adminToken,
})


// actions-----------------users-------------------

// action to set token
export function SetToken(token: string | null) {
    return {
        type: 'set-token',
        payload: token
    }
}

// action to update user
export function UpdateUser(user: object | null) {
    return {
        type: 'profile-update',
        payload: user
    }
}

// actions------------------admin--------------------

// action to set admin token
export function SetAdminToken(token: string | null) {
    return {
        type: 'set-token-admin',
        payload: token
    }
}

// action to update admin
export function UpdateAdmin(token: object | null) {
    return {
        type: 'update-admin',
        payload: token
    }
}


const store = createStore(appReducer)
export default store