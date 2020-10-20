import React from 'react';
import './Button.css';

export default function Button(props) {

    let type = 'submit';
    if (props.type) {
        type = props.type
    }
    let addClass = '';

    if (props.addClass) {
        addClass = 'absolute-button';
    }

    return (
        // <a className='buttons-side-cart' href={props.clicked === 'to-cart' ? '/cart' : '/payment'}> */}
        <button
            disabled={props.addProduct || props.checkout ? !props.disabled : false}
            style={{ backgroundColor: props.backgroundColor, color: props.textColor, width: props.width, cursor: (props.addProduct && !props.disabled) || (props.checkout && !props.disabled) && 'not-allowed' }}
            type={type}
            onClick={props.name ? () => props.clicked(props.name) : props.clicked}
            className={`button-styled ${addClass}`} >
            <h2>{props.children}</h2>
        </ button>
    );
}