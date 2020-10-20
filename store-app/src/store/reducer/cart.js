import * as actionTypes from '../actions/actionTypes';

const initialState = {
    cart: [],
    error: false,
    totalPrice: 0,
    isLoading: false,
    deletingLoading: false,
    openSideCart: false
};


const reducer = (state = initialState, action) => {

    switch (action.type) {

        case actionTypes.ADD_PRODUCT_START:
            return {
                ...state,
                isLoading: true
            }

        case actionTypes.ADD_PRODUCT_SUCCESS:
            const { brand, category, department, description, image, price, title, userId, _id } = action.product.product;
            let flag = false;
            const updatedCart = [...state.cart];
            updatedCart.forEach((product, index) => {

                if (product.productId === _id && product.size === action.size) {
                    console.log(updatedCart[index].quantity);
                    updatedCart[index].quantity++;
                    flag = true;
                }
            });
            if (!flag) {
                const cartProduct = {
                    productId: _id,
                    product: {
                        brand: brand,
                        category: category,
                        department: department,
                        description: description,
                        image: image,
                        price: price,
                        title: title,
                        userId: userId,
                    },
                    quantity: 1,
                    size: action.size

                };
                updatedCart.push(cartProduct);
            }
            console.log(updatedCart);

            return {
                ...state,
                cart: updatedCart,
                totalPrice: (state.totalPrice + price),
                openSideCart: action.noOpenSideCart ? false : true,
                isLoading: false,
            };

        case actionTypes.ADD_PRODUCT_FAILED:
            return {
                ...state,
                isLoading: false,
            };

        case actionTypes.REMOVE_ONE_PRODUCT:
            const productIndex = state.cart.findIndex(product => product.productId === action.productId && product.size === action.size);
            const newCart = [...state.cart];
            newCart[productIndex].quantity--;
            return {
                ...state,
                cart: newCart,
                totalPrice: (state.totalPrice - action.price)
            }

        case actionTypes.REMOVE_PRODUCT_START:
            return {
                ...state,
                deletingLoading: true
            }

        case actionTypes.REMOVE_PRODUCT_SUCCESS:
            const filteredCart = state.cart.filter(item => {
                // console.log(action.product);
                return ((item.productId !== action.productId) ||
                    (item.productId === action.productId && item.size !== action.size));
            });
            console.log(filteredCart);
            return {
                ...state,
                cart: filteredCart,
                totalPrice: (state.totalPrice - (action.price * action.quantity)),
                deletingLoading: false
            };

        case actionTypes.REMOVE_PRODUCT_FAILED:
            return {
                ...state,
                deletingLoading: false
            }

        case actionTypes.FETCH_CART_START:
            return {
                ...state,
                isLoading: true
            }

        case actionTypes.FETCH_CART_SUCCESS:
            const totalPrice = action.products.map(product => {
                return product.product.price * product.quantity;
            }).reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);

            return {
                ...state,
                cart: action.products,
                error: false,
                isLoading: false,
                totalPrice: totalPrice
            }

        case actionTypes.FETCH_CART_FAILED:
            return {
                ...state,
                error: true,
                isLoading: false,
            }
        case actionTypes.RESET_CART_SUCCESS:
            return {
                cart: [],
                error: false,
                totalPrice: 0,
                isLoading: false,
                deletingLoading: false,
                openSideCart: false
            }
        case actionTypes.OPEN_SIDE_CART:
            return {
                ...state,
                openSideCart: true,
                isLoading: false

            }

        case actionTypes.CLOSE_SIDE_CART:
            return {
                ...state,
                openSideCart: false,
            }



        default:
            return state;
    }

};

export default reducer;