import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import ChangingTitle from '../../../components/ChangingTitle/ChangingTitle';
import Spinner from '../../../components/UI/Spinner/Spinner';

import './OrderComplete.css'
import axios from 'axios';
import OrderCompleteProduct from './OrderCompleteProduct/OrderCompleteProduct';

const DELIVERY_METHOD_1 = 'Express delivery to the door (up to 3 business days): 10$';
const DELIVERY_METHOD_2 = 'Pick-up from a free service point - Package Tags to one of the hundreds of national distribution points, a point will be chosen by us at the shipping address listed on the order and closest to that address. (Up to 3 business days).';
const DELIVERY_METHOD_3 = 'Cash only delivery to courier-in-purchase over 200$ (up to 3 business days): 15$';
const DELIVERY_METHOD_4 = 'Self-collection from the business (Ben Yehuda 1 Tel Aviv) A representative on our behalf downloads the package to the customer.';

const OrderComplete = props => {

    const [order, setOrder] = useState(null);

    const orderId = useParams('orderId');
    console.log(orderId.orderId);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/order-complete/${orderId.orderId}`, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        }).then(res => {
            console.log(res);
            setOrder(res.data.order);
        })
    }, [])
    // const newOrder = order.products.map(product => product.product).map(product => <div key={product.title}>{product.title} </div>);
    // console.log(newOrder);
    let mainDetails;
    let products;

    let deliveryMethod;


    if (order) {
        switch (order.deliveryDetails.method) {
            case 1:
                deliveryMethod = DELIVERY_METHOD_1;
                break;
            case 2:
                deliveryMethod = DELIVERY_METHOD_2;
                break;
            case 3:
                deliveryMethod = DELIVERY_METHOD_3;
                break;
            case 4:
                deliveryMethod = DELIVERY_METHOD_4;
                break;

            default:
                return;
        }



        mainDetails =
            <div className='main-details'>

                <div className='main-details__entry'>
                    <h2>User details</h2>
                    <div className='black-div-sm'></div>
                    <div className='main-details__entry-container'>
                        <div className='main-details__entry-col'>
                            <label><strong><u>First Name:</u></strong></label>
                            <label><strong><u>Last Name:</u></strong></label>
                            <label><strong><u>E-Mail:</u></strong></label>
                        </div>
                        <div className='main-details__entry-col'>
                            <label >{order.userDetails.fName}</label>
                            <label>{order.userDetails.lName}</label>
                            <label className='emailLabel'>{order.userDetails.email}</label>
                        </div>
                    </div>
                </div>

                <div className='black-div'></div>

                <div className='main-details__entry'>
                    <h2>Shipping details</h2>
                    <div className='black-div-sm'></div>
                    <div className='main-details__entry-container'>
                        <div className='main-details__entry-col'>
                            <label><strong><u>Address:</u></strong></label>
                            <label><strong><u>Telephone:</u></strong></label>
                            {order.deliveryDetails.remarks && <label><strong><u>Remarks:</u></strong></label>}
                        </div>
                        <div className='main-details__entry-col'>
                            <label>{order.deliveryDetails.street} {order.deliveryDetails.houseNum}, {order.deliveryDetails.city}</label>
                            <label>{order.deliveryDetails.telephone}</label>
                            {order.deliveryDetails.remarks && <label>{order.deliveryDetails.remarks}</label>}
                        </div>
                    </div>
                </div>

                <div className='black-div' style={{ marginTop: '1rem' }}></div>


                <div className='main-details__entry' style={{ margin: '0' }}>
                    <h2>Delivery</h2>
                    <div className='black-div-sm'></div>
                    <div style={{ width: '100%', marginBottom: '1rem' }}>{deliveryMethod}</div>
                </div>

            </div>

        let orderProducts = order.products.map(product =>
            <OrderCompleteProduct
                key={product.productId}
                quantity={product.quantity}
                size={product.size}
                image={product.product.image}
                price={product.product.price}
                title={product.product.title}
                totalPrice={order.totalPrice.toFixed(2)} />)


        products =
            <React.Fragment>
                <h2 className='product-title'>Products</h2>

                <div className='black-div-sm'></div>
                <div className='products'>
                    {orderProducts}
                </div>
                <h2 style={{ color: 'red' }}><strong><u>Total Price:</u></strong> {order.totalPrice.toFixed(2)}$</h2>

            </React.Fragment>
        console.log(order.deliveryDetails.method);


    }

    return (
        <React.Fragment>
            <ChangingTitle complete={true} />
            {!order ? <Spinner /> :
                <div className='order-complete'>
                    <h1>Thank you for your Order!</h1>
                    <label className='orderID'><strong><u>Order ID:</u></strong> #{orderId.orderId}</label>
                    <div style={{ marginTop: '1rem' }} className='black-div'></div>
                    {mainDetails}
                    <div className='black-div'></div>
                    {products}
                </div>}
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps)(OrderComplete);