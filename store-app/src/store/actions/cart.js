import * as actionTypes from './actionTypes';
import axios from 'axios';
import authReducer from '../reducer/auth';



export const addProductStart = () => {
    return {
        type: actionTypes.ADD_PRODUCT_START
    }
}

export const addProductSuccess = (product, size, noOpenSideCart) => {
    return {
        type: actionTypes.ADD_PRODUCT_SUCCESS,
        product: product,
        size: size,
        noOpenSideCart: noOpenSideCart
    };
};

export const addProductFailed = () => {
    return {
        type: actionTypes.ADD_PRODUCT_FAILED,
    }
}

export const addProductHandler = (productId, size, noOpenSideCart) => {
    return (dispatch, getState) => {
        console.log('HREE IN ADDPRODUCTHANDLER');
        dispatch(addProductStart());
        axios.post(process.env.REACT_APP_BACKEND_URL + '/cart', { productId, size }, {
            headers: {
                Authorization: 'Bearer ' + getState().auth.token
            }
        })
            .then(res => {
                console.log(res.data);
                dispatch(addProductSuccess(res.data, size, noOpenSideCart))

            })
            .catch(err => {
                dispatch(addProductFailed());
            });
    }
}

export const removeOneProductSuccess = (productId, size, price, quantity) => {
    return {
        type: actionTypes.REMOVE_ONE_PRODUCT,
        productId: productId,
        size: size,
        price: price,
        quantity: quantity
    }
}

export const removeOneProductHandler = (productId, size, price, quantity) => {
    return (dispatch, getState) => {
        if (quantity === 1) {
            dispatch(removeProductHandler(productId, size, price, quantity));
        } else {
            axios.post(process.env.REACT_APP_BACKEND_URL + '/cart-delete-one-product', { productId, size }, {
                headers: {
                    Authorization: 'Bearer ' + getState().auth.token
                }
            })
                .then(res => {
                    console.log('dispatch removeOneProductSuccess');
                    dispatch(removeOneProductSuccess(productId, size, price, quantity));
                })

        }
    }
}

export const removeProductStart = () => {
    return {
        type: actionTypes.REMOVE_PRODUCT_START
    }
}

export const removeProductSuccess = (productId, size, price, quantity) => {
    return {
        type: actionTypes.REMOVE_PRODUCT_SUCCESS,
        productId: productId,
        size: size,
        price: price,
        quantity: quantity
    };
};

export const removeProductFailed = () => {
    return {
        type: actionTypes.REMOVE_PRODUCT_FAILED
    }
}

export const removeProductHandler = (productId, size, price, quantity) => {

    return (dispatch, getState) => {
        dispatch(removeProductStart());
        console.log('sending post request to delete all the product...');
        axios.post(process.env.REACT_APP_BACKEND_URL + '/cart-delete-product', { productId, size }, {
            headers: {
                Authorization: 'Bearer ' + getState().auth.token
            }
        })
            .then(res => {
                dispatch(removeProductSuccess(productId, size, price, quantity))
            })
            .catch(err => {
                console.log(err);
                dispatch(removeProductFailed());
            });
    }
}

export const fetchCartStart = (products) => {
    return {
        type: actionTypes.FETCH_CART_START,
    };
}

export const fetchCartSuccess = (products) => {
    return {
        type: actionTypes.FETCH_CART_SUCCESS,
        products: products
    };
}

export const fetchCartFailed = () => {
    return {
        type: actionTypes.FETCH_CART_FAILED
    };
};

export const fetchCartHandler = () => {

    return (dispatch, getState) => {
        dispatch(fetchCartStart());
        axios.get(process.env.REACT_APP_BACKEND_URL + '/cart', {
            headers: {
                Authorization: 'Bearer ' + getState().auth.token
            }
        })
            .then(res => {
                // console.log(res.data);
                dispatch(fetchCartSuccess(res.data));

            })
            .catch(err => {
                dispatch(fetchCartFailed());
            })
    };
};

export const resetCartSuccess = () => {
    return {
        type: actionTypes.RESET_CART_SUCCESS
    };
};

export const resetCartHandler = () => {
    return (dispatch, getState) => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/reset-cart', {
            headers: {
                Authorization: 'Bearer ' + getState().auth.token
            }
        })
            .then(res => {
                dispatch(resetCartSuccess());
            })
            .catch(err => console.log(err))
    };
};

export const openSideCart = () => {
    return {
        type: actionTypes.OPEN_SIDE_CART
    };
};

export const closeSideCart = () => {
    return {
        type: actionTypes.CLOSE_SIDE_CART
    };
};



