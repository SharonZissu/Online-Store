import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import Button from '../../../components/UI/Button/Button';
import SideCart from '../Cart/SideCart/SideCart';
import Spinner from '../../../components/UI/Spinner/Spinner';

import * as cartActions from '../../../store/actions/cart';

import './ProductDetails.css';


const ProductDetails = (props) => {



    const [size, setSize] = useState('S');
    const [product, setProduct] = useState({});
    const [addToCartClicked, setAddToCartClicked] = useState(false);

    useEffect(() => {
        const id = props.history.location.state.detail;
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/${id}`, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(product => {
                // console.log(product.data.product);
                setProduct(product.data.product);
            })
            .catch(err => {
                console.log('The error is:', err)
            });
    }, []);



    const addToCartClickedHandlerFirst = (productId, size) => {
        setAddToCartClicked(true);
        props.onProductAddedToCart(productId, size);


    }

    return (
        <React.Fragment>

            {!product.image ? <Spinner size='20rem' /> :
                <React.Fragment>
                    <div className='product-details'>
                        <div className='product-details__info'>
                            <h1>{product.title}</h1>
                            <p>{product.description}</p>
                            <h2>{product.price}$</h2>
                            <select
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                name="size"
                                id="size">
                                {product.department === 'Shoes' ?
                                    <React.Fragment>
                                        <option value="39">39</option>
                                        <option value="40">40</option>
                                        <option value="41">41</option>
                                        <option value="42">42</option>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </React.Fragment>
                                }
                            </select>
                            <Button
                                backgroundColor='black'
                                textColor='white'
                                width="50%"
                                clicked={() => addToCartClickedHandlerFirst(product._id, size)}>
                                {props.isLoading && product.image && addToCartClicked ?
                                    <Spinner
                                        noMargin={true}
                                        addProduct={true}
                                        size='1.2rem' />
                                    : 'ADD TO CART'}
                            </Button>
                        </div>
                        <div className='product-details__img'>
                            <img src={product.image ? `${process.env.REACT_APP_BACKEND_URL}/${product.image}` : ''} alt={product.title} />
                        </div>
                    </div>
                    <SideCart></SideCart>
                </React.Fragment>
            }
        </React.Fragment >
    );

}


const mapStateToProps = state => {
    return {
        isLoading: state.cart.isLoading,
        token: state.auth.token
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onProductAddedToCart: (productId, size) => dispatch(cartActions.addProductHandler(productId, size)),
        onFetchCart: () => dispatch(cartActions.fetchCartHandler())

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);