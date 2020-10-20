import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { useForm } from '../../../hooks/useForm';
import Input from '../../../components/UI/Input/Input';

import axios from 'axios';
import '../Auth.css';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';



const ResetPassword = props => {
    const { token } = useParams();
    const [psUpdated, setPsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formState, inputHandler] = useForm({
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const resetClickedHandler = e => {
        e.preventDefault();
        setIsLoading(true);
        let password = formState.inputs.password.value;
        axios.post(process.env.REACT_APP_BACKEND_URL + "/auth/new-password", { password, token })
            .then(res => {
                setIsLoading(false);
                setPsUpdated(true);
                setTimeout(() => {
                    props.history.push('/login');
                }, 2000);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err)
            });

    }

    return (

        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-container__title'>
                    <h1>New Password</h1>
                </div>
                <div className='auth-container__details'>
                    {/* {props.errorMessage &&
                        <div className='error-message'>
                            <h2>{props.errorMessage}</h2>
                        </div>} */}

                    <form onSubmit={resetClickedHandler} >
                        {/* style={{ marginTop: props.errorMessage ? '1rem' : '2rem' }} */}

                        {psUpdated &&
                            <div className='email-sent'>
                                <h2>Password Updated! Redirecting to Login...</h2>
                            </div>}
                        <div className='auth-inputs'>

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
                                    login={true} /> : 'Reset'}</button>
                    </form>
                </div>
            </div>
        </div>
    )

}
export default ResetPassword;