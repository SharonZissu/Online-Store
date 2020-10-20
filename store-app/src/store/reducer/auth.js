import * as actionTypes from '../actions/actionTypes';

const initialState = {
    userId: null,
    token: null,
    isAdmin: false,
    name: null,
    errorMessage: null,
    isLoading: false

};


const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.LOGIN_START:
            return {
                ...state,
                isLoading: true
            }


        case actionTypes.LOGIN_SUCCESS:

            return {
                userId: action.userId,
                token: action.token,
                isAdmin: action.isAdmin,
                name: action.name,
                error: null,
                isLoading: false,

            };

        case actionTypes.LOGIN_FAILED:

            return {
                userId: null,
                token: null,
                isAdmin: false,
                name: null,
                errorMessage: action.errorMessage,
                isLoading: false
            };

        case actionTypes.LOGOUT:
            return {
                userId: null,
                token: null,
                isAdmin: false,
                name: null,
                errorMessage: null
            };


        default:
            return state;
    }

};

export default reducer;

