import React, { useEffect } from 'react';
import './Filtering.css';


export default function Filtering({ filterCategory, filterBrand, filterDepartment, defaultCategory }) {

    useEffect(() => {

    }, [defaultCategory])


    return (

        <div className='filtering'>
            <label><strong>Products Categories</strong></label>
            <hr className='filtering-hr' />
            <select id="category" value={defaultCategory ? defaultCategory : 'Category'} name="category" onChange={filterCategory}>
                <option value="category">Category</option>
                <option value="Men">MEN</option>
                <option value="Women">WOMEN</option>
            </select>

            <label><strong>Filter by</strong></label>
            <hr className='filtering-hr' />
            <select defaultValue="Department" id="departmant" name="department" onChange={filterDepartment} >
                <option value="department">Department</option>
                <option value="Shirts">Shirts</option>
                <option value="Pants">Pants</option>
                <option value="Shoes">Shoes</option>
            </select>
            <select defaultValue="Brand" style={{ marginTop: '0' }} id="brand" name="brand" onChange={filterBrand} >
                <option value="brand" >Brand</option>
                <option value="Balr">Balr</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
            </select>
        </div>
    );
}