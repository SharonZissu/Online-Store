import * as actionTypes from './actionTypes';
import axios from 'axios';

export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    }
}
export const loginSuccess = (userId, token, isAdmin, name) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        userId: userId,
        token: token,
        isAdmin: isAdmin,
        name: name
    };
}

export const loginFailed = (errorMessage) => {
    return {
        type: actionTypes.LOGIN_FAILED,
        errorMessage: errorMessage
    };
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
};



export const loginHandler = (email, password) => {
    return dispatch => {
        dispatch(loginStart());
        const formData = {
            email: email,
            password: password
        };
        axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/login', formData)
            .then(response => {
                console.log(response.data.expiresIn);
                console.log('isAdmin:', response.data.isAdmin);
                if (response.data.token) {
                    const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('expirationDate', expirationDate.toISOString());
                    localStorage.setItem('isAdmin', response.data.isAdmin);
                    localStorage.setItem('name', response.data.name);
                    dispatch(loginSuccess(response.data.userId, response.data.token, response.data.isAdmin, response.data.name));
                    dispatch(checkAuthTimeout(response.data.expiresIn));
                } else {
                    console.log('Here111');
                    dispatch(loginFailed());
                }
            })
            .catch(err => {
                console.log('Here222');
                console.log(err.response.data.message);
                dispatch(loginFailed(err.response.data.message));
            })
    }
}




export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('name');

    return {
        type: actionTypes.LOGOUT
    };
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin');
        const name = localStorage.getItem('name');
        console.log(name);
        if (!token) {
            console.log('dispatch(logout())');
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                dispatch(loginSuccess(userId, token, isAdmin, name));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logout());
            }
        }
    }
}
