import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import TopMenu from '../../../components/UI/TopMenu/TopMenu';
import Product from '../../User/Products/Product/Product';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Filtering from '../../../components/Filtering/Filtering';
import Paginator from '../../../components/UI/Paginator/Paginator';

import usePrevious from '../../../hooks/usePrevious';

import './AdminProducts.css';


const AdminProducts = props => {


    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [postPage, setPostPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteBtnClicked, setDeleteBtnClicked] = useState(false);



    const prevCategory = usePrevious(filterCategory);
    const prevDepartment = usePrevious(filterDepartment);
    const prevBrand = usePrevious(filterBrand);
    const prevItems = usePrevious(items);

    const history = useHistory();





    useEffect(() => {
        setDeleteBtnClicked(false);
        if (prevCategory !== filterCategory || prevDepartment !== filterDepartment || prevBrand !== filterBrand || prevItems.length !== items.length) {
            setPostPage(1);
            loadProducts(1);
        } else {
            loadProducts();
        }
    }, [filterCategory, filterBrand, filterDepartment, postPage, deleteBtnClicked])

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
        axios.post(process.env.REACT_APP_BACKEND_URL + "/admin/products?page=" + page, filters, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {
                console.log('RES', res);
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
            }
            );

    }


    const editItemClickedHandler = (productId) => {
        console.log(productId);
        console.log('HEYYYY');
        history.push(`/admin/edit-product/${productId}`);

    }

    const deleteItemClickedHandler = (productId) => {
        console.log(productId);
        axios.post(process.env.REACT_APP_BACKEND_URL + "/admin/delete-product", { productId }, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then(res => {
                setDeleteBtnClicked(true);
                console.log('Product Deleted!');
                const itemsAfterDelete = items.filter(i => i._id !== productId);
                setItems(itemsAfterDelete);

            })

    }


    const filterCategoryHandler = (e) => {
        console.log(e.target.value);
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


    // const filteredItems = checkingFilter(items, filterCategory, filterDepartment, filterBrand);


    return (
        <React.Fragment>
            <TopMenu type='ADMIN PRODUCTS' />
            <Filtering
                filterCategory={filterCategoryHandler}
                filterDepartment={filterDepartmentHandler}
                filterBrand={filterBrandHandler}
                defaultCategory={filterCategory}
            />
            {loading ? <Spinner /> :
                <Paginator
                    onPrevious={() => (loadProducts('previous'))}
                    onNext={() => (loadProducts('next'))}
                    lastPage={Math.ceil(totalItems / 3)}
                    currentPage={postPage}
                >
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
                            editItemClicked={() => editItemClickedHandler(item._id)}
                            deleteItemClicked={() => deleteItemClickedHandler(item._id)}
                            edit={true} />
                        )}

                    </div>
                </Paginator>
            }
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}


export default connect(mapStateToProps)(AdminProducts);