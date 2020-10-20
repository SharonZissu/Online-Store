import React from "react";
import "./Spinner.css";

export default function Spinner({ size, noMargin, login, sidecart, addProduct }) {

    let classes = ['loader'];
    if (noMargin) {
        classes.push('loader-no-margin')
    }
    if (login) {
        classes.push('loader-login');
    }
    if (sidecart) {
        classes.push('loader-sidecart');
    }
    if (addProduct) {
        classes.push('loader-addproduct');
    }
    let customSize = '35em';
    if (size) {
        customSize = size;
    }



    return <div className={classes.join(' ')} style={{ height: customSize, width: customSize, }}></div>;

}
