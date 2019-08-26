import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import getToken from 'helpers/getToken';

import RoomContainer from './room/RoomContainer';
import ScreenBeforeWhiteboard from 'components/screensBeforeWhiteboard/ScreenBeforeWhiteboard';

import {login} from '../actions/room';
import './MainContainer.scss';

class MainContainer extends Component {
    static propTypes = {
        authInfo: PropTypes.object,
        loginProcessing: PropTypes.bool,
        kicked: PropTypes.bool,
        loginError: PropTypes.object,
        onLogin: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onLogin();
    }

    render() {
        const {authInfo, loginProcessing, loginError, kicked} = this.props;

        if (kicked)
            return this.renderKicked();

        if (loginProcessing)
            return this.renderLoginProcess();

        if (loginError)
            return this.renderLoginError();

        if (authInfo)
            return this.renderClassRoom();

        return null;
    }

    renderLoginProcess() {
        return <ScreenBeforeWhiteboard informationText='Loading room...' needLoading={true}/>;
    }

    renderLoginError() {
        const {loginError} = this.props;

        return <ScreenBeforeWhiteboard informationText={loginError.message}/>;
    }

    renderClassRoom() {
        return <RoomContainer/>;
    }

    renderKicked() {
        return <ScreenBeforeWhiteboard informationText='You have been kicked from the room.'/>;
    }
}

const mapStateToProps = (state) => ({
    ...state.room
});

const mapDispatchToProps = {
    onLogin: handleLogin
};

function handleLogin() {
    const {token, tabId} = getToken();
    return login({token, tabId});
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
