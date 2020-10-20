import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../../../components/UI/Spinner/Spinner';
import './Orders.css';
import axios from 'axios';
import { useState } from 'react';


const Orders = props => {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + '/orders', {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {
                console.log(res.data);
                setOrders(res.data.orders);
                setIsLoading(false);


            })
            .catch(err => {
                console.log(err);
                setIsLoading(true);
            });

    }, []);


    return <div className='orders'>
        {isLoading ? <Spinner /> :
            orders && orders.map(order =>
                <div
                    key={order._id}
                    className='order'>
                    <div className='order-row'>
                        <h2><u>Order ID: </u></h2>
                        <h3> #{order._id}</h3>
                    </div>
                    <div className='order-row'>
                        <h2><u>Orderd in: </u></h2>
                        <h3>{`${order.createdAt.split('-')[2].split('T')[0]} / ${order.createdAt.split('-')[1]} / ${order.createdAt.split('-')[0]}`}</h3>
                    </div>
                    <Link to={`/order-complete/${order._id}`}>For more details...</Link>
                </div>)
        }
        {orders.length < 1 && !isLoading && <h1>You have no orders!</h1>}

    </div>
};

const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
};



export default connect(mapStateToProps)(Orders);