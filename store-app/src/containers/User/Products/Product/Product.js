import React from 'react';
import { connect } from 'react-redux';

import Button from '../../../../components/UI/Button/Button';

import './Product.css';


const Product = ({ id, title, price, image, department, category, brand, addItemClicked, edit, editItemClicked, deleteItemClicked, detailsItemClicked, ...props }) => {

    return (
        <div className='item-container'>
            <div className='item'>
                <img src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} alt='details' />
                <hr />
                <div className='item__details'>
                    <p style={{ color: 'grey', margin: '0', marginLeft: '0.5rem', fontSize: '0.8rem' }}>{edit ? `${category}/${department}/${title}` : title} <strong>{brand}</strong></p>
                    <p style={{ margin: '0', marginRight: '0.5rem', fontSize: '0.8rem' }}><strong>{price}$</strong></p>
                </div>
            </div>
            <div className='item__buttons'>
                {edit
                    ?
                    <React.Fragment>
                        <Button
                            backgroundColor='black'
                            textColor='white'
                            width='300px'
                            clicked={editItemClicked}>
                            Edit Product
                </Button>

                        <Button
                            backgroundColor='black'
                            textColor='white'
                            width='300px'
                            clicked={deleteItemClicked}>
                            Delete Product
                </Button>

                    </React.Fragment>
                    :

                    <Button
                        backgroundColor='black'
                        textColor='white'
                        width='300px'
                        clicked={detailsItemClicked}>
                        Details
                </Button>
                }
            </div>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        loading: state.cart.isLoading
    };
}

export default connect(mapStateToProps)(Product);