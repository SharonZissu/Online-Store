import React, { useState } from 'react';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { useForm } from '../../../hooks/useForm';
import Input from '../../../components/UI/Input/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from '../../../util/validators';
import axios from 'axios';
import '../Auth.css';



const ResetPassword = props => {

    const [checkEmail, setCheckEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        }
    }, false);

    const resetClickedHandler = e => {
        e.preventDefault();
        setIsLoading(true);
        let email = formState.inputs.email.value;
        axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/reset-password', { email })
            .then(res => {
                setCheckEmail(true);
                setIsLoading(false);


                setTimeout(() => {
                    setCheckEmail(false);
                }, 3000);

            })
            .catch(err => {
                console.log(err);
                console.log('I AM HERE');
                setIsLoading(false);
                setCheckEmail(true);
                setTimeout(() => {
                    setCheckEmail(false);
                }, 3000);

            });

    }

    return (
        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-container__title'>
                    <h1>Reset Password</h1>
                </div>
                <div className='auth-container__details'>
                    {props.errorMessage &&
                        <div className='error-message'>
                            <h2>{props.errorMessage}</h2>
                        </div>}
                    <form onSubmit={resetClickedHandler} >
                        {/* style={{ marginTop: props.errorMessage ? '1rem' : '2rem' }} */}

                        {checkEmail &&
                            <div className='email-sent'>
                                <h2>{`E-Mail has been sent to ${formState.inputs.email.value}`}</h2>
                            </div>}
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