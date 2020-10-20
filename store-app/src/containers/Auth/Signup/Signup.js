import React, { useState } from 'react';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { useForm } from '../../../hooks/useForm';
import Input from '../../../components/UI/Input/Input';

import axios from 'axios';

import '../Auth.css';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from '../../../util/validators';


const Signup = props => {

    const [isLoading, setIsLoading] = useState(false);

    const [formState, inputHandler] = useForm({
        name: {
            value: '',
            isValid: false
        },
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const signupClickedHandler = e => {
        setIsLoading(true);
        e.preventDefault();
        const formData = {
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
        };
        axios.put(process.env.REACT_APP_BACKEND_URL + '/auth/signup', formData)
            .then(result => {
                setIsLoading(false)
                console.log(result.data);
                props.history.push('/login');
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
            })
    }

    return (

        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-container__title'>
                    <h1>Signup</h1>
                </div>
                <div className='auth-container__details'>
                    {/* {props.errorMessage &&
                        <div className='error-message'>
                            <h2>{props.errorMessage}</h2>
                        </div>} */}
                    <form onSubmit={signupClickedHandler}>
                        {/* style={{ marginTop: props.errorMessage ? '1rem' : '2rem' }} */}
                        <div className='auth-inputs'>
                            <Input
                                id="name"
                                element="input"
                                type="text"
                                placeholder="name"
                                onInput={inputHandler}
                                validators={[VALIDATOR_REQUIRE()]}
                                errorMessage='Please enter a name'
                                auth={true}
                            />

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
                        <button
                            disabled={!formState.isValid}
                            style={{ backgroundColor: !formState.isValid ? 'grey' : 'rgb(219, 58, 58)', cursor: !formState.isValid ? 'not-allowed' : 'pointer' }}
                            type="submit">{isLoading ?
                                <Spinner
                                    size='2.5rem'
                                    noMargin={true}
                                    login={true} /> : 'Register'}</button>
                    </form>


                </div>
            </div>
        </div>
    )

}
export default Signup;