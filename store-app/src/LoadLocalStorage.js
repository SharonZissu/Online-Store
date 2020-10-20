import { connect } from 'react-redux';
import * as authActions from './store/actions/auth';

const LoadLocalStorage = props => {
    props.onTryLogin();
    return props.children;


}

const mapDispatchToProps = dispatch => {
    return {
        onTryLogin: () => dispatch(authActions.authCheckState())
    };
}

export default connect(null, mapDispatchToProps)(LoadLocalStorage);