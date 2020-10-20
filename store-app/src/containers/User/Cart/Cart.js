import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import CartProduct from './CartProduct/CartProduct';
import Spinner from '../../../components/UI/Spinner/Spinner';

import * as cartActions from '../../../store/actions/cart';

import './Cart.css';
import DeliveryForm from '../../../components/DeliveryForm/DeliveryForm';
import ChangingTitle from '../../../components/ChangingTitle/ChangingTitle';


const Cart = props => {


    const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState(0);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(0);
    const [deletedProduct, setDeletedProduct] = useState(null);
    const [deletedSize, setDeletedSize] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [addCouponSuccess, setAddCouponSuccess] = useState(null);

    useEffect(() => {
        props.onFetchCart();
    }, []);

    useEffect(() => {
        if (props.history.location.delivery) {
            setSelectedDeliveryOption(props.history.location.delivery.option);
            setSelectedDeliveryPrice(props.history.location.delivery.price);
        }
        if (props.history.location.coupon) {
            console.log(props.history.location.coupon);
            setAddCouponSuccess(true);
        }
    }, []);

    const deleteProductFromCart = (id, size, price, quantity) => {
        setDeletedProduct(id);
        setDeletedSize(size);
        props.onProductRemovedFromCart(id, size, price, quantity);

    }

    const handleOptionChange = e => {
        let price;
        console.log(e.target.id);
        let selection = parseInt(e.target.id);
        setSelectedDeliveryOption(selection);
        switch (selection) {
            case 1:
                price = 10;
                break;
            case 2:
                price = 0;
                break;
            case 3:
                price = 15;
                break;
            case 4:
                price = 0;
                break;
            default:
                price = 0;

        }
        setSelectedDeliveryPrice(price);

    }
    const couponChangedHandler = (e) => {
        setCoupon(e.target.value);
    }

    const addCouponClickedHandler = () => {
        console.log('clicked');
        console.log(coupon);
        if (coupon === 'nice123') {
            setAddCouponSuccess(true)
        } else {
            setAddCouponSuccess(false);
        }
    }


    const toPaymentClickedHandler = () => {
        props.history.push({
            pathname: '/checkout',
            delivery: {
                option: selectedDeliveryOption,
                price: selectedDeliveryPrice
            },
            coupon: addCouponSuccess
        })
    }

    const changeQuantityInc = (productId, size) => {
        props.onProductAddedToCart(productId, size, true);
    }
    const changeQuantityDec = (productId, size, price, quantity) => {
        props.onProductRemovedOneFromCart(productId, size, price, quantity);
    }

    // Cart products handling
    const products = props.cartProducts.map(product => <CartProduct
        key={Math.random()}
        productId={product.productId}
        title={product.product.title}
        image={product.product.image}
        price={product.product.price}
        size={product.size}
        quantity={product.quantity}
        deleteProductFromCart={deleteProductFromCart}
        deletedProduct={deletedProduct}
        deletedSize={deletedSize}
        changeQuantityInc={changeQuantityInc}
        changeQuantityDec={changeQuantityDec}
    />);


    // Coupon handling 
    let couponContent = (
        <React.Fragment>
            <input onChange={couponChangedHandler} value={coupon} placeholder='Code Coupon'></input>
            <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
                <Button clicked={addCouponClickedHandler} backgroundColor='#eee' textColor='black' width='95%'>Apply a coupon</Button>
            </div>
        </React.Fragment>);

    if (addCouponSuccess) {
        couponContent = <p style={{ margin: '0 0 0 1rem', color: 'green' }}>Coupon Apllied! You have a discount of 10%</p>;
    }
    if (addCouponSuccess === false) {
        couponContent = (
            <React.Fragment>
                <p style={{ margin: '0 0 0 1rem', color: 'red' }}>Coupon is not correct. Try Again!</p>
                <input onChange={couponChangedHandler} value={coupon} placeholder='Code Coupon'></input>
                <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
                    <Button clicked={addCouponClickedHandler} backgroundColor='#eee' textColor='black' width='100%'>Apply a coupon</Button>
                </div>
            </React.Fragment>);
    }

    // Price handling
    let totalPrice =
        <label>
            <strong>
                {`${(props.totalPrice + selectedDeliveryPrice).toFixed(2)}$`}
            </strong>
        </label>;

    if (addCouponSuccess) {
        totalPrice =
            <div>
                <label style={{ color: 'grey', textDecoration: 'line-through', marginRight: '3px' }}>
                    <strong>
                        {`${(props.totalPrice + selectedDeliveryPrice).toFixed(2)}$`}
                    </strong>
                </label>
                <label>
                    <strong>
                        {`${((props.totalPrice + selectedDeliveryPrice).toFixed(2) - ((props.totalPrice + selectedDeliveryPrice) / 10)).toFixed(2)}$`}
                    </strong>
                </label>
            </div>
    }


    return (
        <React.Fragment>
            <ChangingTitle cart={true} toPaymentClickedHandler={toPaymentClickedHandler} />
            {props.cartProducts.length > 0 ?
                <div className='cart-container'>
                    <React.Fragment>

                        <div className='cart-products' >
                            <CartProduct labels={true} />
                            {/* <div className='lables'>
                                <label><strong>Product</strong></label>
                                <label style={{ marginLeft: '17.8rem' }}><strong>Size</strong></label>
                                <label style={{ marginLeft: '1.7rem' }}><strong>Price</strong></label>
                                <label style={{ marginLeft: '2.3rem' }}><strong>Quantity</strong></label>
                                <label style={{ marginLeft: '2rem' }} ><strong>Subtotal</strong></label>
                            </div> */}
                            {/* <hr className='main-hr' /> */}

                            {products}
                            <div className='cart-buttons'>
                                {/* <Button backgroundColor='rgb(233, 229, 229)' textColor='black' width='45%' clicked={backToShopClickedHandler}>Keep Shopping</Button> */}
                                <h1>Keep Shopping</h1>
                                <div>
                                    <Link to='/men'><Button backgroundColor='black' textColor='white' width='20%'>MEN</Button></Link>
                                    <Link to='/women'><Button backgroundColor='black' textColor='white' width='20%'>WOMEN</Button></Link>
                                </div>
                            </div>

                        </div>

                        <div className='cart-info'>
                            <label style={{ paddingBottom: '8px', borderBottom: '1px solid rgb(212, 211, 211)' }}><strong>Total in Shopping Cart</strong></label>
                            {/* <hr className='main-hr' /> */}
                            <div className='subtotal'>
                                <label>Subtotal</label>
                                <label><strong>{props.totalPrice.toFixed(2)}$</strong></label>
                            </div>
                            <hr />
                            <DeliveryForm handleOptionChange={handleOptionChange} selectedDeliveryOption={selectedDeliveryOption} />
                            <hr />
                            <div className='total-amount'>
                                <label>Total Amount</label>
                                {totalPrice}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <Button clicked={toPaymentClickedHandler} backgroundColor='black' textColor='white' width='95%'>To Payment</Button>
                            </div>

                            <div className='coupon'>
                                <label><strong>Coupon</strong></label>
                                {couponContent}
                            </div>
                        </div>

                    </React.Fragment>

                </div> :
                <div className='cart-no-products'>
                    <p style={{ width: '90%' }}>Shopping Cart is empty.</p><br />
                    <Link to='/'><Button backgroundColor='black' textColor='white' width='200px'>Back to Shop</Button></Link>
                </div>

            }


        </React.Fragment >
    )
}

const mapStateToProps = state => {
    return {
        cartProducts: state.cart.cart,
        totalPrice: state.cart.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchCart: () => dispatch(cartActions.fetchCartHandler()),
        onProductRemovedFromCart: (productId, size, price, quantity) => dispatch(cartActions.removeProductHandler(productId, size, price, quantity)),
        onProductRemovedOneFromCart: (productId, size, price, quantity) => dispatch(cartActions.removeOneProductHandler(productId, size, price, quantity)),
        onProductAddedToCart: (productId, size, noOpenSideCart) => dispatch(cartActions.addProductHandler(productId, size, noOpenSideCart))

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Cart);