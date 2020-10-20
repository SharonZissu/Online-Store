import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItem.css';

export default function NavigationItem(props) {
    return (
        <React.Fragment>

            <li className={props.sidemenu ? 'side-nav' : 'main-nav'}>
                <NavLink
                    className={props.admin ? 'nav-link_admin' : 'nav-link'}
                    activeClassName={props.admin ? 'nav-link_admin-active' : 'nav-link-active'}
                    exact to={props.link}>{props.children}</NavLink>
            </li>
        </React.Fragment>

    )
}