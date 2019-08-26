import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import ServerConnectionContainer from './ServerConnectionContainer';

export default class AppContainer extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const {store} = this.props;

        return (
            <Provider store={store}>
                <ServerConnectionContainer/>
            </Provider>
        );
    }
}
