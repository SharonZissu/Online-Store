import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from './containers/User/Home/Home';
import About from './containers/User/About/About';
import Cart from './containers/User/Cart/Cart';
import Checkout from './containers/User/Checkout/Checkout';
import Orders from './containers/User/Orders/Orders';
import Products from './containers/User/Products/Products';
import ProductDetails from './containers/User/ProductDetails/ProductDetails';
import Signup from './containers/Auth/Signup/Signup';
import Login from './containers/Auth/Login/Login';
import NavBar from './components/Navigation/NavBar/NavBar';
import AddProduct from './containers/Admin/AddProduct/AddProduct';
import EditProduct from './containers/Admin/EditProduct/EditProduct';
import AdminProducts from './containers/Admin/AdminProducts/AdminProducts';
import SideCart from './containers/User/Cart/SideCart/SideCart';
import ResetPassword from './containers/Auth/ResetPassword/ResetPassword';
import NewPassword from './containers/Auth/NewPassword/NewPassword';
import OrderComplete from './containers/User/OrderComplete/OrderComplete';
import Spinner from './components/UI/Spinner/Spinner';
import * as authActions from './store/actions/auth';

import './App.css';

// const Checkout = React.lazy(() => import('./containers/User/Checkout/Checkout'));
// const Cart = React.lazy(() => import('./containers/User/Cart/Cart'));
// const Orders = React.lazy(() => import('./containers/User/Orders/Orders'));
// const Products = React.lazy(() => import('./containers/User/Products/Products'));
// const ProductDetails = React.lazy(() => import('./containers/User/ProductDetails/ProductDetails'));
// const Signup = React.lazy(() => import('./containers/Auth/Signup/Signup'));
// const Login = React.lazy(() => import('./containers/Auth/Login/Login'));
// const AddProduct = React.lazy(() => import('./containers/Admin/AddProduct/AddProduct'));
// const EditProduct = React.lazy(() => import('./containers/Admin/EditProduct/EditProduct'));
// const AdminProducts = React.lazy(() => import('./containers/Admin/AdminProducts/AdminProducts'));
// const ResetPassword = React.lazy(() => import('./containers/Auth/ResetPassword/ResetPassword'));
// const NewPassword = React.lazy(() => import('./containers/Auth/NewPassword/NewPassword'));
// const OrderComplete = React.lazy(() => import('./containers/User/OrderComplete/OrderComplete'));

let routes;

const App = props => {



  if (!props.isAuthenticated) {
    routes = <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/signup' component={Signup} />
      <Route path='/login' component={Login} />
      <Route path='/reset-password' component={ResetPassword} />
      <Route path='/new-password/:token' component={NewPassword} />
      <Redirect to='/login' />
      {/* <Redirect to='login' /> */}
    </Switch>;
  }

  if (props.isAdmin === "true" || props.isAdmin) {
    routes = (
      <React.Fragment>
        <SideCart></SideCart>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/men' component={Products} />
          <Route path='/women' component={Products} />
          <Route path='/about' component={About} />
          <Route path='/cart' component={Cart} />
          <Route path='/checkout' component={Checkout} />
          <Route path='/orders' component={Orders} />
          <Route path='/order-complete/:orderId' component={OrderComplete} />
          <Route path='/products/:productId' component={ProductDetails} />
          <Route path='/admin/edit-product/:prodId' component={EditProduct} />
          <Route path='/admin/add-product' component={AddProduct} />
          <Route path='/admin/products' component={AdminProducts} />
          <Redirect to='/' />
        </Switch>
      </React.Fragment>

    );
  }

  if (props.isAuthenticated && (props.isAdmin === "false" || !props.isAdmin)) {
    routes =
      <React.Fragment>
        <SideCart></SideCart>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/men' component={Products} />
          <Route path='/women' component={Products} />
          <Route path='/about' component={About} />
          <Route path='/cart' component={Cart} />
          <Route path='/checkout' component={Checkout} />
          <Route path='/orders' component={Orders} />
          <Route path='/order-complete/:orderId' component={OrderComplete} />
          <Route path='/products/:productId' component={ProductDetails} />
          <Redirect to='/' />
        </Switch>
      </React.Fragment>

  }



  return (

    <div className='App'>
      <NavBar />

      {routes}
    </div>

  );

}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.isAdmin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryLogin: () => dispatch(authActions.authCheckState())
  };
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
