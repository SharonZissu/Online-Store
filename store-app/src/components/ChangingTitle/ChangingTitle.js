import React from 'react';
import { Link } from 'react-router-dom';

import './ChangingTitle.css';

const ChangingTitle = props => {

    let title;

    if (props.cart) {
        title = <React.Fragment>
            <div className='main-title-mobile'>
                <h1>Shopping Cart</h1>
            </div>
            <div className='main-title'>
                <h1>Shopping Cart</h1>
                <h1 className='grey-left'>></h1>
                <h1 className='details' onClick={props.toPaymentClickedHandler}>Details</h1>
                <h1 className='grey-left'>></h1>
                <h1 className='grey-left'>Order Completed</h1>
            </div>
        </React.Fragment>
    } else if (props.checkout) {
        title = <React.Fragment>
            <div className='main-title-mobile'>
                <h1>Details</h1>
            </div>
            <div className='main-title'>
                <h1 className='shopping-cart' onClick={props.toCartClickedHandler}>Shopping Cart</h1>
                <h1 className='grey-left'>></h1>
                <h1 style={{ marginLeft: '20px' }}>Details</h1>
                <h1 className='grey-left'>></h1>
                <h1 className='grey-left'>Order Completed</h1>
            </div>
        </React.Fragment>
    } else if (props.complete) {
        title = <React.Fragment>
            <div className='main-title-mobile'>
                <h1>Order Completed</h1>
            </div>
            <div className='main-title'>
                <h1 className='grey-left'>Shopping Cart</h1>
                <h1 className='grey-left'>></h1>
                <h1 className='grey-left'>Details</h1>
                <h1 className='grey-left'>></h1>
                <h1 style={{ marginLeft: '20px' }} >Order Completed</h1>
            </div>
        </React.Fragment>
    }

    return title;
}

export default ChangingTitle;