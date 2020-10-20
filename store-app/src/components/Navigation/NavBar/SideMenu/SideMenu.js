import React from 'react';
import { connect } from 'react-redux';


import MenuIcon from '@material-ui/icons/Menu';
import Backdrop from '../../../UI/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';

import * as authActions from '../../../../store/actions/auth';


import './SideMenu.css';


const SideMenu = props => {
    return (
        <div
            className='sidemenu-icon'
            onClick={props.clicked}>
            <MenuIcon style={{ color: 'white', width: '3rem', height: '3rem' }} />

            <React.Fragment>
                <Backdrop show={props.toggleSideMenu} />
                <div className='sidemenu' style={{
                    transform: props.toggleSideMenu ? 'translateX(0)' : 'translateX(-500px)',
                    opacity: props.toggleSideMenu ? '1' : '0',
                    paddingTop: props.token ? '0' : '10rem'
                }}>
                    {props.name && <h1>WELCOME {props.name.toUpperCase()}!</h1>}

                    <NavigationItems sidemenu={true} />
                    {props.token && <button className='logout-on-sidemenu' onClick={props.onLogout}>LOGOUT</button>}
                </div>
            </React.Fragment>

        </div>
    )
};

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        name: state.auth.name
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authActions.logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu); 