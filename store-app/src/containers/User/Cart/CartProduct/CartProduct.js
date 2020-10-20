import React from 'react';
import { connect } from 'react-redux';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Spinner from '../../../../components/UI/Spinner/Spinner';

import * as cartActions from '../../../../store/actions/cart';

import './CartProduct.css';


const CartProduct = ({ productId, title, image, price, quantity, size, deletedProduct, deletedSize, changeQuantityInc, changeQuantityDec, ...props }) => {



    return (
        <React.Fragment>
            {props.labels ?

                <div className='labels-products' style={{ height: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px', justifyContent: 'space-between' }}>

                    <React.Fragment>
                        <label style={{ width: '15%' }} ><strong>Product</strong></label>
                        <p className="labelOff" style={{ width: '35%' }}></p>
                        <p className="labelOff" style={{ width: '10%', }}><strong>Size</strong></p>
                        <p className="labelOff" style={{ width: '10%', marginRight: '2rem' }}><strong>Price</strong></p>
                        <div className="labelOff" style={{ display: 'flex', alignItems: 'center', width: '10%', marginRight: '2rem' }}>
                            <label className="labelOff"><strong>Quantity</strong></label>
                        </div>
                        <label className='subtotal' style={{ width: '15%', textAlign: 'end' }}><strong>Subtotal</strong></label>
                    </React.Fragment >
                </div >
                :

                props.deletingLoading && (productId === deletedProduct) && (size === deletedSize) ? <Spinner size='3rem' noMargin={true} /> :
                    <div className='cart-product'>

                        <React.Fragment>
                            <HighlightOffIcon className='delete-btn' onClick={() => props.deleteProductFromCart(productId, size, price, quantity)} fontSize='large' />
                            <img style={{ textAlign: 'center', width: '15%' }} src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} />
                            <p className='titleP' >{title}</p>
                            <p className="sizeP" >{size}</p>
                            <p className="offPrice" style={{ textAlign: 'center', width: '10%', marginRight: '3rem' }}><strong>{price.toFixed(2)}$</strong></p>
                            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', width: '10%' }}>
                                <button onClick={() => changeQuantityInc(productId, size)} className='quantity-buttons'>+</button>
                                <div>
                                    <p style={{ textAlign: 'center', margin: '0', padding: '0.2rem' }}>{quantity}</p>
                                </div>
                                <button onClick={() => changeQuantityDec(productId, size, price, quantity)} className='quantity-buttons'>-</button>
                            </div>
                            <p style={{ marginRight: '0', width: '15%', marginLeft: '1.8rem', textAlign: 'end' }}><strong>{(price * quantity).toFixed(2)}$</strong></p>
                        </React.Fragment>

                    </div>

            }
            <hr />

        </React.Fragment >
    )
}

const mapStateToProps = state => {
    return {
        deletingLoading: state.cart.deletingLoading
    }
}



export default connect(mapStateToProps)(CartProduct);