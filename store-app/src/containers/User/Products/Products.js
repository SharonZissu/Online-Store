import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import TopMenu from '../../../components/UI/TopMenu/TopMenu';
import Product from './Product/Product';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Filtering from '../../../components/Filtering/Filtering';
import Paginator from '../../../components/UI/Paginator/Paginator';

import usePrevious from '../../../hooks/usePrevious';

import '../../Admin/AdminProducts/AdminProducts.css';


const Products = props => {




    const [items, setItems] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [postPage, setPostPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteBtnClicked, setDeleteBtnClicked] = useState(false);

    const prevCategory = usePrevious(filterCategory);
    const prevDepartment = usePrevious(filterDepartment);
    const prevBrand = usePrevious(filterBrand);
    const prevItems = usePrevious(items);


    useEffect(() => {
        setDeleteBtnClicked(false);
        console.log(props.history.location.pathname);
        if (prevCategory !== filterCategory || prevDepartment !== filterDepartment || prevBrand !== filterBrand || prevItems.length !== items.length) {
            setPostPage(1);
            loadProducts(1);
        } else {
            loadProducts();
        }
    }, [filterCategory, filterBrand, filterDepartment, postPage, deleteBtnClicked])

    useEffect(() => {
        console.log('useEffect');
        if (props.location.pathname === '/women') {
            setFilterCategory('Women');
        } else if (props.location.pathname === '/men') {
            setFilterCategory('Men');

        }
    }, [props.location.pathname]);


    const loadProducts = direction => {
        setLoading(true);
        const filters = {
            category: filterCategory,
            brand: filterBrand,
            department: filterDepartment
        };
        let page = postPage;
        if (direction === 'next') {
            page++;
            setPostPage(page);
        }
        if (direction === 'previous') {
            page--;
            setPostPage(page);
        }
        if (direction === 1) {
            page = 1;
            setPostPage(page);
        }
        console.log(filterCategory.toLowerCase());
        if (filterCategory) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/${filterCategory.toLowerCase()}?page=` + page, filters, {
                headers: {
                    Authorization: 'Bearer ' + props.token
                }
            })
                .then(res => {
                    const productsArr = [];
                    res.data.products.forEach(product => {
                        productsArr.push(product);
                    });
                    setItems(productsArr);
                    setTotalItems(res.data.totalItems);
                    setLoading(false);


                })

                .catch(err => {
                    setLoading(false);
                    console.log(err)
                });
        }

    }



    const detailsItemClickedHandler = (id) => {
        console.log(id);
        props.history.push({
            pathname: `/products/${id}`,
            state: { detail: id }
        });


    }

    const filterCategoryHandler = (e) => {
        if (e.target.value === 'category') {
            setFilterCategory(null);
        } else {
            setFilterCategory(e.target.value)
        }
    };
    const filterBrandHandler = (e) => {
        if (e.target.value === 'brand') {
            setFilterBrand(null);
        } else {
            setFilterBrand(e.target.value);
        }
    }
    const filterDepartmentHandler = (e) => {
        if (e.target.value === 'department') {
            setFilterDepartment(null);
        } else {
            setFilterDepartment(e.target.value);
        }
    }


    return (
        <React.Fragment>
            <TopMenu type={props.history.location.pathname === '/men' ? 'MEN' : 'WOMEN'} />
            <Filtering
                filterCategory={filterCategoryHandler}
                filterDepartment={filterDepartmentHandler}
                filterBrand={filterBrandHandler}
                defaultCategory={filterCategory}
            />
            <Paginator
                onPrevious={() => (loadProducts('previous'))}
                onNext={() => (loadProducts('next'))}
                lastPage={Math.ceil(totalItems / 4)}
                currentPage={postPage}
            >
                {loading ? <Spinner /> :
                    <div className='items-list'>
                        {items.map(item => <Product
                            key={item._id}
                            id={item._id}
                            category={item.category}
                            department={item.department}
                            title={item.title}
                            brand={item.brand}
                            image={item.image}
                            description={item.description}
                            price={item.price}
                            detailsItemClicked={() => detailsItemClickedHandler(item._id)}
                        />
                        )}

                    </div>}
            </Paginator>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps)(Products);