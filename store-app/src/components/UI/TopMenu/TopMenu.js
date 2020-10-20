import React from 'react';
import './TopMenu.css';

export default function TopMenu({ type }) {
    let title = 'HOME' + '\xa0\xa0' + '/' + '\xa0\xa0' + type;
    return (
        <div className='top-menu'>
            <h2>{title}</h2>
        </div>
    );
}