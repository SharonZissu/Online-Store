import React, { useState, useEffect, useReducer, } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import ImageUpload from '../../../components/UI/ImageUpload/ImageUpload';
import { useForm } from '../../../hooks/useForm';

import './AddProduct.css';
import { useCallback } from 'react';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_FILE, VALIDATOR_NUMBER } from '../../../util/validators';


const AddProduct = props => {
    const [buttonClicked, setButtonClicked] = useState(false);

    const [formState, inputHandler, setFormData] = useForm({
        category: {
            value: '',
            isValid: false
        },
        department: {
            value: '',
            isValid: false
        },
        title: {
            value: '',
            isValid: false
        },
        brand: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        price: {
            value: '',
            isValid: false
        },

    }, false);




    const addProductClickedHandler = (e) => {
        e.preventDefault();
        console.log('FORMSTATE:', formState);
        console.log('FORM IS VALID:', formState.isValid);
        // console.log('category', formState.inputs.category.value);
        // console.log('department', formState.inputs.department.value);
        // console.log('title', formState.inputs.title.value);
        // console.log('brand', formState.inputs.brand.value);
        // console.log('description', formState.inputs.description.value);
        // console.log('price', formState.inputs.price.value);
        // console.log('image', formState.inputs.image.value);
        const formData = new FormData();
        formData.append('category', formState.inputs.category.value);
        formData.append('department', formState.inputs.department.value);
        formData.append('title', formState.inputs.title.value);
        formData.append('brand', formState.inputs.brand.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('price', formState.inputs.price.value);
        formData.append('image', formState.inputs.image.value);

        console.log('category', formState.inputs.category.value);
        console.log('department', formState.inputs.department.value);
        console.log('title', formState.inputs.title.value);
        console.log('brand', formState.inputs.brand.value);
        console.log('description', formState.inputs.description.value);
        console.log('price', formState.inputs.price.value);
        console.log('image', formState.inputs.image.value);


        axios.post(process.env.REACT_APP_BACKEND_URL + "/admin/add-product", formData, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        }
        )
            .then((res) => {
                // console.log(result);
                console.log(res);
                console.log('Product Added');
                setButtonClicked(true);
            })
            .catch(err => {
                console.log('ERRORRRRRORORORR');
                console.log(err)
            })
    }



    return (
        <div className='add-product'>
            {buttonClicked && <Redirect to="/admin/products" />}

            <form onSubmit={addProductClickedHandler}>
                <Input
                    id="category"
                    element="select"
                    label="Category"
                    onInput={inputHandler}
                    initialValue='Men'
                    initialValid={true}
                    validators={[VALIDATOR_REQUIRE()]}
                    options={[
                        { value: 'Men', displayValue: 'Men' },
                        { value: 'Women', displayValue: 'Women' }
                    ]}
                    addProduct={true}
                />

                <Input
                    id="department"
                    element="select"
                    label="Department"
                    onInput={inputHandler}
                    initialValue='Shirts'
                    initialValid={true}
                    validators={[VALIDATOR_REQUIRE()]}
                    options={[
                        { value: 'Shirts', displayValue: 'Shirts' },
                        { value: 'Pants', displayValue: 'Pants' },
                        { value: 'Shoes', displayValue: 'Shoes' }
                    ]}
                    addProduct={true}
                />

                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid Title"
                    onInput={inputHandler}
                    addProduct={true}
                />

                <Input
                    id="brand"
                    element="select"
                    label="Brand"
                    onInput={inputHandler}
                    initialValue='Balr'
                    initialValid={true}
                    validators={[VALIDATOR_REQUIRE()]}
                    options={[
                        { value: 'Balr', displayValue: 'Balr' },
                        { value: 'Nike', displayValue: 'Nike' },
                        { value: 'Adidas', displayValue: 'Adidas' }
                    ]}
                    addProduct={true}
                />

                <ImageUpload
                    center
                    id="image"
                    onInput={inputHandler}
                    validators={[VALIDATOR_FILE()]}
                />

                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    rows="8"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid Description"
                    onInput={inputHandler}
                    addProduct={true}
                />

                <Input
                    id="price"
                    element="input"
                    label="Price"
                    onInput={inputHandler}
                    validators={[VALIDATOR_NUMBER()]}
                    addProduct={true}
                />


                {/* <div className='add-product__entry' style={{ marginTop: '2rem' }}>
                    <input value={productId} type="hidden" name="productId" />
                </div> */}

                <Button disabled={formState.isValid} addProduct={true} backgroundColor='black' textColor='white' width='100%'>ADD PRODUCT</Button>
            </form>




        </div>

    );
}



const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps)(AddProduct);