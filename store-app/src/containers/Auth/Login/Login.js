import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { useForm } from '../../../hooks/useForm';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from '../../../util/validators';


import * as authActions from '../../../store/actions/auth';

import '../Auth.css';

const Login = props => {


    const [formState, inputHandler] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const loginClickedHandler = e => {
        e.preventDefault();
        props.onLogin(formState.inputs.email.value, formState.inputs.password.value);

    }

    return (
        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-container__title'>
                    <h1>User Login</h1>
                </div>
                <div className='auth-container__details'>
                    {props.errorMessage &&
                        <div className='error-message'>
                            <h2>{props.errorMessage}</h2>
                        </div>}

                    <form onSubmit={loginClickedHandler} >
                        {/* style={{ marginTop: props.errorMessage ? '1rem' : '2rem' }} */}

                        <div className='auth-inputs'>

                            <Input
                                id="email"
                                element="input"
                                type="email"
                                placeholder="email"
                                onInput={inputHandler}
                                validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                                errorMessage='Please enter a valid E-Mail'
                                auth={true}
                            />

                            <Input
                                id="password"
                                element="input"
                                type="password"
                                placeholder="password"
                                onInput={inputHandler}
                                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                                errorMessage='Password must contain at least 6 characters'
                                auth={true}
                            />
                        </div>

                        <Link to='/reset-password'><p style={{ color: 'white' }} htmlFor="">Forgot Password ?</p></Link>


                        <button
                            disabled={!formState.isValid}
                            style={{ backgroundColor: !formState.isValid ? 'grey' : 'rgb(219, 58, 58)', cursor: !formState.isValid ? 'not-allowed' : 'pointer' }}
                            type="submit">{props.isLoading ?
                                <Spinner
                                    size='2.5rem'
                                    noMargin={true}
                                    login={true} /> : 'Sign In'}</button>
                    </form>



                </div>
            </div>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        errorMessage: state.auth.errorMessage,
        isLoading: state.auth.isLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (email, password) => dispatch(authActions.loginHandler(email, password)),

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);