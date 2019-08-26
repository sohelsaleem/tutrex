import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import MainContainer from './MainContainer';
import ServerConnection from 'components/ServerConnection';

import ScreenBeforeWhiteboard from 'components/screensBeforeWhiteboard/ScreenBeforeWhiteboard';

class ServerConnectionContainer extends Component {
    static propTypes = {
        connected: PropTypes.bool.isRequired
    };

    render() {
        const {connected, internetFail, kicked} = this.props;

        if(kicked){
            return <ScreenBeforeWhiteboard informationText='You have been kicked from the room.'/>;
        }

        if (!connected){
            return <ServerConnection internetFail={internetFail}/>;
        }

        return (
            <MainContainer/>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state.socketConnection,
    kicked: state.room.kicked
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServerConnectionContainer);
