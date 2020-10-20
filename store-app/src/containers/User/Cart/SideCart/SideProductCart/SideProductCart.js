import React from 'react';
import { connect } from 'react-redux';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Spinner from '../../../../../components/UI/Spinner/Spinner';

import * as actionTypes from '../../../../../store/actions/actionTypes';
import * as cartActions from '../../../../../store/actions/cart';

import './SideProductCart.css';

const SideProductCart = props => {


    return (
        <React.Fragment>



            <div className='side-product-cart'>

                {props.deletingLoading && (props.deletedProduct === props.productId) && (props.deltedSize === props.size) ? <Spinner size='4rem' noMargin={true} sidecart={true} />
                    :
                    <React.Fragment>
                        <div className='side-product-cart__img' >
                            <img src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`} />
                        </div>
                        <div style={{ width: '40%', textAlign: 'center' }}>
                            <p >{props.title} </p>
                            <p >{props.size} x{props.quantity}</p>
                            <p><strong> {(props.price * props.quantity).toFixed(2)}$</strong></p>
                        </div>


                        <HighlightOffIcon onClick={() => props.deleteProductFromCart(props.productId, props.size, props.price, props.quantity)} fontSize='large' style={{ margin: '1rem', cursor: 'pointer', width: '20%' }} />
                    </React.Fragment>

                }


            </div>


        </React.Fragment >
    )
}
const mapStateToProps = state => {
    return {
        deletingLoading: state.cart.deletingLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onProductRemovedFromCart: (productId, size, price, quantity) => dispatch(cartActions.removeProductHandler(productId, size, price, quantity))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideProductCart);