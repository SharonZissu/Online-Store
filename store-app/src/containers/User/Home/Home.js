import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import shopHome from '../../../assets/images/shopHome4.jpg';
import summerSale from '../../../assets/images/summer-sale.jpg';
import followUs from '../../../assets/images/follow-us.jpg';
import InstagramIcon from '@material-ui/icons/Instagram';

import './Home.css';

const Home = () => {





    return (

        <div className="home">

            <div className='main-pic'>
                <div className='buttons'>
                    <NavLink to="/women"><button className='btn women-btn'>WOMEN</button></NavLink>
                    <NavLink to="/men"><button className='btn men-btn'>MEN</button></NavLink>
                </div>
            </div>


        </div>

        /* <hr /> */
        /* <div className='images-shop'>
            <div className='shop-home'>
                <Link to='/men'><img src={shopHome} alt='shop-home' /></Link>
            </div>
            <NavLink to="/women"><button className='btn women-btn'>WOMEN</button></NavLink>
            <NavLink to="/men"><button className='btn men-btn'>MEN</button></NavLink>
        </div>
        <div className='contact'>
            <button className='btn sales-btn'>SUMMER SALES</button>

            <div className='sales'>
                <Link to='/men'><img src={summerSale} alt='shop-home' /></Link>
            </div>

            <div className='follow-us'>
                <Link to='/men'><img src={followUs} alt='shop-home' /></Link>
                <div className='follow-us-btn'>
                    <button>FOLLOW US</button>
                    <InstagramIcon className='instagram' fontSize='default' />
                </div>
            </div> */

        /* <h1>Cart:</h1>
        <div className='cart-list'>
            {cart.map(item => <Item
                key={item.id}
                id={item.id}
                title={item.title}
                url={item.url}
                thumbnailUrl={item.thumbnailUrl}
                addItemClicked={addItemClickedHandler}
            />)}
        </div> */
        /* </div > */
    );
}

export default Home;
