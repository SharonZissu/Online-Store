import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import { validate } from '../../../util/validators';

import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import './Input.css';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };

        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
};


const Input = props => {


    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isTouched: false,
        isValid: props.initialValid || false,
        errorMessage: props.errorText
    });

    const { id, onInput } = props;
    const { value, isValid, errorMessage } = inputState;

    useEffect(() => {
        onInput(id, value, isValid, errorMessage);
    }, [id, value, isValid, onInput, errorMessage]);

    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        });
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    let inputElement;
    let className;
    let style;
    let icon;

    switch (props.element) {

        case ('input'):
            if (props.checkout) {
                style = { gridArea: props.id, display: 'flex', flexDirection: 'column' };
            } else if (props.auth) {
                className = 'auth-input';
                if (props.id === 'name') {
                    icon = <PeopleAltRoundedIcon fontSize='large' style={{ width: '20%', color: 'grey', borderRight: '1px solid grey' }} />;
                } else if (props.id === 'email') {
                    icon = <EmailOutlinedIcon fontSize='large' style={{ width: '20%', color: 'grey', borderRight: '1px solid grey' }} />
                } else {
                    icon = <LockOpenRoundedIcon fontSize='large' style={{ width: '20%', color: 'grey', borderRight: '1px solid grey' }} />
                }
            } else if (props.addProduct) {
                className = 'add-product__entry';
            }

            inputElement =
                <React.Fragment>
                    {!inputState.isValid && inputState.isTouched && props.auth && <div className='error-message'>
                        <h2>{props.errorMessage}</h2>
                    </div>}

                    <div
                        className={className && className}
                        style={style && style}>
                        {props.label && <label
                            style={{ color: !inputState.isValid && inputState.isTouched ? 'red' : 'black' }}
                            htmlFor={props.id}><strong>{props.label}</strong></label>}
                        {props.auth && icon}
                        <input
                            id={props.id}
                            type={props.type}
                            placeholder={props.placeholder}
                            onChange={changeHandler}
                            onBlur={touchHandler}
                            value={inputState.value}
                            className={!inputState.isValid && inputState.isTouched ? 'invalid-input' : 'valid-input'}
                            autoComplete={props.auth && 'off'}
                        />
                    </div>
                </React.Fragment>
            break;

        case ('textarea'):
            if (!props.addProduct) {
                style = { gridArea: props.id, display: 'flex', flexDirection: 'column' };
            } else {
                className = 'add-product__entry';
            }
            inputElement =
                <div
                    className={className && className}
                    style={style && style}>
                    {props.label && <label
                        style={{ color: !inputState.isValid && inputState.isTouched ? 'red' : 'black' }}
                        htmlFor={props.id}><strong>{props.label}</strong></label>}
                    <textarea
                        id={props.id}
                        rows={props.rows || 3}
                        onChange={changeHandler}
                        onBlur={touchHandler}
                        value={inputState.value}
                        className={!inputState.isValid && inputState.isTouched ? 'invalid-input' : 'valid-input'}
                    />
                </div>


            break;
        case ('select'):
            inputElement =
                <div className='add-product__entry'>
                    <label htmlFor={props.id}><strong>{props.label}</strong></label>

                    <select
                        id={props.id}
                        name={props.name}
                        value={props.value}
                        onChange={changeHandler}
                        defaultValue={props.defaultValue || props.initialValue}
                    >
                        {props.options.map(option => (
                            <option
                                key={option.value}
                                value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                    </select>
                </div>
    }




    return inputElement
};


const mapStateToProps = state => {
    return {

        name: state.auth.name
    };
}


export default connect(mapStateToProps)(Input);