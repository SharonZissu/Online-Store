import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SideMenu from './SideMenu/SideMenu';
import NavigationItems from './NavigationItems/NavigationItems';

import * as cartActions from '../../../store/actions/cart';

import './NavBar.css';



function NavBar(props) {

    const [toggleSideMenu, setToggleSideMenu] = useState(false);

    const sideMenuClickedHandler = () => {
        console.log('clicked');
        setToggleSideMenu(!toggleSideMenu);
    };
    return (
        <React.Fragment>

            <div className='menu'>
                <SideMenu
                    clicked={sideMenuClickedHandler}
                    toggleSideMenu={toggleSideMenu} />
                <NavigationItems cartClickedHandler={props.onOpenSideCart} />
            </div>


        </React.Fragment>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        onOpenSideCart: () => dispatch(cartActions.openSideCart())
    };
}

export default connect(null, mapDispatchToProps)(withRouter(NavBar));