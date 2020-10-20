import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as cartActions from '../../../store/actions/cart';

import Button from '../../../components/UI/Button/Button';
import DeliveryForm from '../../../components/DeliveryForm/DeliveryForm';
import Input from '../../../components/UI/Input/Input';
import Modal from './Modal/Modal';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_NUMBER } from '../../../util/validators';
import { useForm } from '../../../hooks/useForm';

import CreditCardIcon from '@material-ui/icons/CreditCard';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import './Checkout.css';
import ChangingTitle from '../../../components/ChangingTitle/ChangingTitle';
import Spinner from '../../../components/UI/Spinner/Spinner';

// import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

// const stripe = await loadStripe('pk_test_51HEdIEJKrjebtZofIRdYF1zCGtzAUKBmE3BahCPVY79AVuNVk1NHgURDV0NtHqvCXoysMjRpoRwx0BZnb9DXKpql00dEHxsm5R');

const Checkout = (props) => {

    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(0);
    const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState(0);

    const [coupon, setCoupon] = useState('');
    const [paymentOption, setPaymentOption] = useState('');
    const [addCouponClicked, setAddCouponClicked] = useState(false);
    const [applyCouponClicked, setApplyCouponClicked] = useState(false);
    const [addCouponSuccess, setAddCouponSuccess] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [showPaymentBtn, setShowPaymentBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formState, inputHandler] = useForm({
        fName: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        lName: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        city: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        street: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        houseNum: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        telephone: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        email: {
            value: '',
            isValid: false,
            errorMessage: ''
        },
        remarks: {
            value: '',
            isValid: false
        },

    }, false);


    useEffect(() => {
        console.log(props.history);
        if (props.history.location.delivery) {
            setSelectedDeliveryOption(props.history.location.delivery.option);
            setSelectedDeliveryPrice(props.history.location.delivery.price);
        }
        if (props.history.location.coupon) {
            console.log(props.history.location.coupon);
            setAddCouponSuccess(true);
        }
        window.scrollTo(0, 0);
    }, []);





    const applyCouponClickedHandler = () => {
        setApplyCouponClicked(true);
        if (coupon === 'nice123') {
            setAddCouponSuccess(true)
        } else {
            setAddCouponSuccess(false);
        }
    }


    const handleOptionChange = (e) => {
        let price;
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
        // setSelectedDeliveryOption(parseInt(e.target.value.split(',')[0]));
        // console.log(parseInt(e.target.value.split(',')[0]));
        // setSelectedDeliveryPrice(parseInt(e.target.value.split(',')[1]));
    }

    const toCartClickedHandler = () => {
        props.history.push({
            pathname: '/cart',
            delivery: {
                option: selectedDeliveryOption,
                price: selectedDeliveryPrice
            },
            coupon: addCouponSuccess
        })
    }

    const submitFormHandler = e => {
        e.preventDefault();
        // stripe.redirectToCheckout({
        //     sessionId: ''
        // 
    }
    const handleToken = (token, addresses) => {
        // console.log({ token, addresses });
        // console.log(props.totalPrice);
        console.log(formState.isValid);

        // let totalPrice = props.totalPrice;
        let totalPriceNew = totalPriceNumber * 100;
        axios.post(process.env.REACT_APP_BACKEND_URL + '/checkout', { token, totalPriceNew }, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {
                const { status } = res.data;
                console.log(status);
                if (status === 'success') {
                    console.log('HEREHEREHREHRR');
                    addOrder();
                    // toast('Success! Check email for details', { type: 'success' });
                } else {
                    toast('Something went wrong', { type: 'error' });

                }
            })

    };

    const confirmOrderClickedHandler = () => {

        console.log(props.cartProducts);
        console.log(paymentOption);
        console.log('remarks:', formState.inputs.remarks.value);
        if (!formState.isValid || !paymentOption || !selectedDeliveryOption) {
            setShowModal(true);
        } else {
            if (paymentOption === 'credit-card') {
                setShowPaymentBtn(true);
            } else {
                addOrder();

            }
        }

    };

    const addOrder = () => {
        const order = {
            userId: props.userId,
            userDetails: {
                fName: formState.inputs.fName.value,
                lName: formState.inputs.lName.value,
                email: formState.inputs.email.value,
            },
            deliveryDetails: {
                method: selectedDeliveryOption,
                city: formState.inputs.city.value,
                street: formState.inputs.street.value,
                houseNum: formState.inputs.houseNum.value,
                city: formState.inputs.city.value,
                telephone: (formState.inputs.telephone.value).toString(),
                remarks: formState.inputs.remarks.value
            },
            products: props.cartProducts,
            totalPrice: totalPriceNumber,
            payment: paymentOption
        };

        axios.post(process.env.REACT_APP_BACKEND_URL + '/new-order', { order }, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {

                const orderId = res.data.orderId;
                console.log(orderId);
                props.onResetCart();
                props.history.push(`/order-complete/${orderId}`);
                console.log(res.data);
            })
            .catch(err => {
                console.log(err)
            });
    };

    const closeModal = () => {
        setShowModal(false);
    };



    // Coupon handling 
    let couponContent;
    if (addCouponSuccess) {
        couponContent = null;
    }
    if (!addCouponSuccess) {
        couponContent =
            <React.Fragment>
                {addCouponClicked && <div className='add-coupon-clicked'>
                    <label>If you have a voucher code, it should be noted below.</label>
                    <input onChange={(e) => setCoupon(e.target.value)} value={coupon} placeholder='Code Coupon' />
                    <Button className='width-apply-cp-btn' clicked={applyCouponClickedHandler} backgroundColor='black' textColor='white' >Apply a coupon</Button>
                </div>}
            </React.Fragment>
    }

    if (addCouponSuccess && applyCouponClicked) {
        couponContent =
            <React.Fragment>
                <label style={{ color: 'green' }}>Coupon Apllied! You have a discount of 10%</label>
            </React.Fragment>
    }

    if (addCouponSuccess === false && applyCouponClicked) {
        couponContent =
            <React.Fragment>
                <div className='add-coupon-clicked'>
                    <label style={{ color: 'red' }}>Coupon is not correct. Try Again!</label>
                    <input onChange={(e) => setCoupon(e.target.value)} value={coupon} placeholder='Code Coupon' />
                    <Button className='width-apply-cp-btn' clicked={applyCouponClickedHandler} backgroundColor='black' textColor='white' width='18%' >Apply a coupon</Button>
                </div>
            </React.Fragment>
    }


    //Price handling
    let totalPriceNumber = (props.totalPrice + selectedDeliveryPrice).toFixed(2);
    let totalPrice =
        <label>
            <strong>
                {`${(props.totalPrice + selectedDeliveryPrice).toFixed(2)}$`}
            </strong>
        </label>;

    if (addCouponSuccess) {
        totalPriceNumber = ((props.totalPrice + selectedDeliveryPrice).toFixed(2) - ((props.totalPrice + selectedDeliveryPrice) / 10)).toFixed(2);
        totalPrice =
            <div>
                <label style={{ color: 'grey', textDecoration: 'line-through', marginRight: '1rem' }}>
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

    //Modal handling
    let errors = [];
    for (const key in formState.inputs) {
        if (!formState.inputs[key].isValid) {
            errors.push(formState.inputs[key].errorMessage);

        }
    }
    if (!selectedDeliveryOption) {
        errors.push('Please choose Delivery option');
    }
    if (!paymentOption) {
        errors.push('Please choose Payment option');
    }
    const newErrors = errors.map(error => {
        return <label key={Math.random()} style={{ marginTop: '0.4rem' }}><strong>{error}</strong></label>
    });

    console.log(errors);

    return (
        <React.Fragment>
            <ChangingTitle checkout={true} toCartClickedHandler={toCartClickedHandler} />
            <Modal show={showModal} close={closeModal}><h1>Missing Details!</h1>{newErrors}</Modal>
            {props.cartProducts.length > 0 ?
                <React.Fragment>

                    <div className='add-coupon'>
                        {!addCouponSuccess ? <label onClick={() => setAddCouponClicked(!addCouponClicked)}>Do you have a coupon? click here</label> : null}
                        {addCouponClicked &&
                            couponContent}
                    </div>

                    <div className='checkout-container'>

                        <div className='order-details'>

                            <label style={{ marginBottom: '2rem', fontSize: '1.5rem', borderTop: '1px solid #ccc', paddingTop: '10px' }}>Billing Details</label>
                            <form onSubmit={submitFormHandler}>
                                <Input
                                    id="fName"
                                    element="input"
                                    type="text"
                                    label="First Name*"
                                    validators={[]}
                                    errorText="Please enter a valid First Name"
                                    onInput={inputHandler}
                                    value={props.name}
                                    valid={true}
                                    checkout={true}
                                />
                                <Input
                                    id="lName"
                                    element="input"
                                    type="text"
                                    label="Last Name*"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a valid Last Name"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <Input
                                    id="city"
                                    element="input"
                                    type="text"
                                    label="City*"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a valid City"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <label style={{ gridArea: 'address' }} htmlFor=""><strong>Address*</strong></label>
                                <Input
                                    id="street"
                                    element="input"
                                    type="text"
                                    placeholder="Street Name"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a valid Street Name"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <Input
                                    id="houseNum"
                                    element="input"
                                    type="text"
                                    placeholder="House Number"
                                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
                                    errorText="Please enter a valid House Number"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <Input
                                    id="telephone"
                                    element="input"
                                    type="text"
                                    label="Telephone*"
                                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(9), VALIDATOR_NUMBER()]}
                                    errorText="Please enter a valid Telephone (min 9 digits)"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <Input
                                    id="email"
                                    element="input"
                                    type="email"
                                    label="E-Mail*"
                                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                                    errorText="Please enter a valid E-Mail"
                                    onInput={inputHandler}
                                    checkout={true}
                                />
                                <Input
                                    id="remarks"
                                    element="textarea"
                                    label="Remarks"
                                    rows="10"
                                    validators={[]}
                                    errorText="Please enter a valid Remarks"
                                    onInput={inputHandler}
                                    initialValid={true}
                                    checkout={true}
                                />

                            </form>



                        </div>
                        <div className='order-payment'>
                            <label style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Order details</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '8px' }}>
                                <label><strong>Product</strong></label>
                                <label><strong>Subtotal</strong></label>
                            </div>
                            {props.cartProducts.map(product =>
                                <React.Fragment key={Math.random()}>
                                    <div
                                        className='checkout-products'
                                        style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <label>{product.product.title} {product.size} x{product.quantity}</label>
                                        <label><strong>{(product.product.price * product.quantity).toFixed(2)}$</strong></label></div><hr />
                                </React.Fragment>)}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '8px' }}>
                                <label><strong>Subtotal</strong></label>
                                <label><strong>{(props.totalPrice).toFixed(2)}$</strong></label>
                            </div>
                            {/* <hr className='narrow-hr' /> */}

                            <label style={{ marginBottom: '1rem' }}><strong>Delivery</strong></label>
                            <DeliveryForm
                                checkout={true}
                                handleOptionChange={handleOptionChange}
                                selectedDeliveryOption={selectedDeliveryOption} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '8px' }}>
                                <label><strong>Total</strong></label>
                                <label><strong>{totalPrice}</strong></label>
                            </div>
                            <div className='checkout-payment'>
                                <div>
                                    <div>
                                        <input
                                            type='radio'
                                            name='delivery'
                                            onChange={() => setPaymentOption('cash')}
                                            value={paymentOption} />
                                        <p ><strong>Cash on delivery</strong></p>
                                    </div>
                                    <MonetizationOnIcon
                                        fontSize='small' />
                                </div>
                                <br />
                                <div
                                    style={{ marginBottom: '1rem' }}>
                                    <div>
                                        <input
                                            type='radio'
                                            name='delivery'
                                            onChange={() => setPaymentOption('credit-card')}
                                            value={paymentOption} />
                                        <p><strong>Secure payment by credit card</strong></p>
                                    </div>
                                    <CreditCardIcon
                                        fontSize='small' />
                                </div>
                                <br />
                                {/* <input type='checkbox' /><p>I have read and agree to the Terms*</p> */}

                                <Button
                                    backgroundColor='black'
                                    textColor='white'
                                    width='50%'
                                    clicked={confirmOrderClickedHandler}>
                                    Confirm Order
                            </Button>
                                {showPaymentBtn && paymentOption === 'credit-card' &&
                                    <StripeCheckout
                                        /* style={{ backgroundImage: 'none', background: 'black' }} */
                                        stripeKey="pk_test_51HEdIEJKrjebtZofIRdYF1zCGtzAUKBmE3BahCPVY79AVuNVk1NHgURDV0NtHqvCXoysMjRpoRwx0BZnb9DXKpql00dEHxsm5R"
                                        token={handleToken}
                                        billingAddress
                                        shippingAddress
                                        amount={totalPriceNumber * 100} />}
                            </div>



                            <ToastContainer />

                        </div>
                    </div>

                </React.Fragment> :
                <div className='cart-no-products'>
                    <p>Unable to pay now, shopping cart is empty.</p><br />
                    <Link to='/'><Button backgroundColor='black' textColor='white' width='200px'>Back to Shop</Button></Link>
                </div>
            }
        </React.Fragment >
    )
}

const mapStateToProps = state => {
    return {
        cartProducts: state.cart.cart,
        totalPrice: state.cart.totalPrice,
        name: state.auth.name,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onResetCart: () => dispatch(cartActions.resetCartHandler())

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Checkout);