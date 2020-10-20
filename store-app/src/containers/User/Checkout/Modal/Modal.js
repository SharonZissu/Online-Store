import React from 'react';
import Backdrop from '../../../../components/UI/Backdrop/Backdrop';
import './Modal.css';

const Modal = props => {
    return (
        <React.Fragment>
            <Backdrop show={props.show} cancel={props.close} />
            <div className='modal' style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-500px)',
                opacity: props.show ? '1' : '0',
            }}>{props.children}</div>
        </React.Fragment>
    );
};

export default Modal;