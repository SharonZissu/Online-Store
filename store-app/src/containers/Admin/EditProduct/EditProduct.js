import React, { useState, useEffect, useReducer, } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import ImageUpload from '../../../components/UI/ImageUpload/ImageUpload';
import { useForm } from '../../../hooks/useForm';

import '../AddProduct/AddProduct.css';
import { useCallback } from 'react';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MIN, VALIDATOR_NUMBER, VALIDATOR_FILE } from '../../../util/validators';
import Spinner from '../../../components/UI/Spinner/Spinner';


const EditProduct = props => {
    const [buttonClicked, setButtonClicked] = useState(false);

    const [loadedProduct, setLoadedProduct] = useState(null);
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
            value: '',
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
        productId: {
            value: '',
            isValid: false,
        }

    }, false);

    const { prodId } = useParams();
    let location = useLocation();


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/edit-product/${prodId}?edit=true`, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    console.log(res.data);
                    setLoadedProduct(res.data);
                    setFormData({
                        category: {
                            value: res.data.category,
                            isValid: true
                        },
                        department: {
                            value: res.data.department,
                            isValid: true
                        },
                        title: {
                            value: res.data.title,
                            isValid: true
                        },
                        brand: {
                            value: res.data.brand,
                            isValid: true
                        },
                        image: {
                            value: res.data.image,
                            isValid: true
                        },
                        description: {
                            value: res.data.description,
                            isValid: true
                        },
                        price: {
                            value: res.data.price,
                            isValid: true,
                        },
                        productId: {
                            value: prodId,
                            isValid: true,
                        }
                    }, true);
                }
            })
            .catch(err => console.log(err))
        // console.log(props.history.location);
        // const { category, department, title, brand, image, description, price, _id } = location.state.detail;


        console.log(formState);

        return () => {
            setButtonClicked(false);
        }
    }, [setFormData, location])


    const editProductClickedHandler = (e) => {
        e.preventDefault();
        console.log('FORMSTATE:', formState);
        console.log('FORM IS VALID:', formState.isValid);
        const formData = new FormData();
        formData.append('productId', formState.inputs.productId.value);
        formData.append('category', formState.inputs.category.value);
        formData.append('department', formState.inputs.department.value);
        formData.append('title', formState.inputs.title.value);
        formData.append('brand', formState.inputs.brand.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('price', formState.inputs.price.value);
        formData.append('image', formState.inputs.image.value);

        axios.post(process.env.REACT_APP_BACKEND_URL + "/admin/edit-product", formData, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(resData => {
                console.log(resData.data);
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
            {loadedProduct ?
                <form onSubmit={editProductClickedHandler}>
                    <Input
                        id="category"
                        element="select"
                        label="Category"
                        onInput={inputHandler}
                        initialValue={loadedProduct.category}
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
                        initialValue={loadedProduct.department}
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
                        initialValue={loadedProduct.title}
                        initialValid={true}
                        addProduct={true}
                    />

                    <Input
                        id="brand"
                        element="select"
                        label="Brand"
                        onInput={inputHandler}
                        initialValue={loadedProduct.brand}
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
                        validators={[VALIDATOR_FILE()]}
                        onInput={inputHandler} />

                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        rows="8"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid Description"
                        onInput={inputHandler}
                        initialValue={loadedProduct.description}
                        initialValid={true}
                        addProduct={true}
                    />

                    <Input
                        id="price"
                        element="input"
                        label="Price"
                        onInput={inputHandler}
                        validators={[VALIDATOR_NUMBER()]}
                        initialValue={loadedProduct.price}
                        initialValid={true}
                        addProduct={true}
                    />


                    <Button disabled={formState.isValid} addProduct={true} backgroundColor='black' textColor='white' width='100%'>EDIT PRODUCT</Button>
                </form> :
                <Spinner />}


        </div>

    );
}


const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps)(EditProduct);