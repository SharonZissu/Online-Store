import React, { useState } from 'react';
import { connect } from 'react-redux';

import NavigationItem from './NavigationItem/NavigationItem';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SideMenu from '../SideMenu/SideMenu';
import * as authActions from '../../../../store/actions/auth';

import './NavigationItems.css';



const NavigationItems = props => {



    let navigations;

    if (props.token) {
        navigations = (
            <React.Fragment>

                <button className='logout' onClick={props.onLogout}>LOGOUT</button>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/'>HOME</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/men'>MEN</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/women'>WOMEN</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/orders'>ORDERS</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/about'>ABOUT</NavigationItem>
                {(props.isAdmin === 'true' || props.isAdmin === true) &&
                    <React.Fragment>
                        <NavigationItem sidemenu={props.sidemenu ? true : false} link='/admin/products' admin={props.isAdmin}>PRODUCTS</NavigationItem>
                        <NavigationItem sidemenu={props.sidemenu ? true : false} link='/admin/add-product' admin={props.isAdmin}>ADD PRODUCT</NavigationItem>
                    </React.Fragment>}
                {!props.sidemenu && <button
                    className='cart'
                    onClick={props.cartClickedHandler}>
                    <ShoppingCartIcon
                        fontSize='large'
                        border={0}
                        style={{ color: 'white', width: '2.4rem', height: '2.4rem' }} />
                    {props.name && <label style={{ color: 'white' }}>{props.name.charAt(0).toUpperCase() + props.name.slice(1)}'s Cart</label>}
                </button>}

            </React.Fragment>
        );
    } else {
        navigations = (
            <React.Fragment>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/'>HOME</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/login'>LOGIN</NavigationItem>
                <NavigationItem sidemenu={props.sidemenu ? true : false} link='/signup'>SIGNUP</NavigationItem>
            </React.Fragment>
        )

    }

    return (
        navigations
    )
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
        name: state.auth.name
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authActions.logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavigationItems);