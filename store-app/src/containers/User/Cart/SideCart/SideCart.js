import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Backdrop from '../../../../components/UI/Backdrop/Backdrop';
import SideProductCart from './SideProductCart/SideProductCart';
import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spinner/Spinner';

import * as cartActions from '../../../../store/actions/cart';

import './SideCart.css';


const SideCart = (props) => {


    const history = useHistory();
    const [deletedProduct, setDeletedProduct] = useState(null);
    const [deltedSize, setDeletedSize] = useState(null);



    useEffect(() => {
        // console.log('USEEFFECT SIDECART');
        props.onFetchCart();
    }, []);

    // console.log('LOGGG', props.cartProducts);

    const deleteProductFromCart = (id, size, price, quantity) => {
        setDeletedProduct(id);
        setDeletedSize(size);
        // console.log(props.productId, props.size, props.price, props.quantity);
        props.onProductRemovedFromCart(id, size, price, quantity);
        // setIsLoading(false);

    }
    const products = props.cartProducts.map(product => {
        // console.log('EVETY', product.product.image);
        // console.log('EVERY PRODUCT IN CART:');
        // console.log(product.productId);
        // console.log(product.product.title);
        // console.log(product.product.image);
        // console.log(product.product.price);
        // console.log(product.size);
        // console.log(product.quantity);
        // console.log('END');

        return <SideProductCart
            key={Math.random()}
            product={product.product}
            productId={product.productId}
            title={product.product.title}
            image={product.product.image}
            price={product.product.price}
            size={product.size}
            quantity={product.quantity}
            deleteProductFromCart={deleteProductFromCart}
            deletedProduct={deletedProduct}
            deltedSize={deltedSize} />
    });



    const clicked = (name) => {
        let path;
        if (name === 'toCart') {
            path = '/cart';
        } else {
            path = '/checkout'
        }
        history.push(path);
        props.onCloseSideCart();

    }

    return (
        <React.Fragment>
            <Backdrop show={props.sideCart} cancel={props.onCloseSideCart} />
            <div className='side-cart' style={{
                transform: props.sideCart ? 'translateX(0)' : 'translateX(500px)',
                opacity: props.sideCart ? '1' : '0'
            }}>
                <h1>Shoppoing Cart</h1>
                <hr style={{ backgroundColor: 'black', height: '3px', width: '15%' }} />
                {/* <Link to='/cart'> */}
                {products.length > 0 ?

                    < React.Fragment >
                        {products}
                        <Button
                            backgroundColor='black'
                            textColor='white'
                            width='90%'
                            name='toCart'
                            clicked={clicked}>
                            To Shopping Cart
                        </Button>
                        <Button
                            backgroundColor='black'
                            textColor='white'
                            width='90%'
                            name='toPayment'
                            clicked={clicked}>
                            To Payment
                        </Button>
                    </React.Fragment>
                    :
                    <p>There is no products in shopping cart</p>}

            </div >

        </React.Fragment >
    );
}

const mapStateToProps = state => {
    return {
        cartProducts: state.cart.cart,
        sideCart: state.cart.openSideCart,
        deletingLoading: state.cart.deletingLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchCart: () => dispatch(cartActions.fetchCartHandler()),
        onCloseSideCart: () => dispatch(cartActions.closeSideCart()),
        onProductRemovedFromCart: (productId, size, price, quantity) => dispatch(cartActions.removeProductHandler(productId, size, price, quantity))

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SideCart);