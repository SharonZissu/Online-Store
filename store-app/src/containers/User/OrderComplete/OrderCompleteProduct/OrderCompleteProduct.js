import React from 'react';
import './OrderCompleteProduct.css';

const OrderCompleteProduct = ({ title, price, image, size, quantity }) => {

    console.log(title);
    console.log(price);
    console.log(image);
    console.log(size);
    console.log(quantity);
    return <div className='order-complete-product'>

        <label>{title}</label>
        <img src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} alt="productImage" />
        <label><strong><u>Price:</u></strong> {(price * quantity).toFixed(2)}$</label>
        <label><strong><u>Size: </u></strong>{size}</label>
        <label><strong><u>Quantity: </u></strong>{quantity}</label>
        {/* <label></label> */}
    </div>;
};

export default OrderCompleteProduct