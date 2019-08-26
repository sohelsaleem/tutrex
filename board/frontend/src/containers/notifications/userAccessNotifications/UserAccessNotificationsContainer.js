import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import infoIcon from 'assets/notifications/info_icon.svg';

const capabilitiesNames = {
    'whiteboardAccess': 'whiteboard',
    'cameraAccess': 'camera',
    'micAccess': 'microphone'
};

class UserAccessNotificationsContainer extends Component {
    static propTypes = {
        onNotify: PropTypes.func.isRequired,
        whiteboardAccess: PropTypes.bool,
        cameraAccess: PropTypes.bool,
        micAccess: PropTypes.bool
    };

    componentWillReceiveProps(nextProps) {
        this.addNewAccessNotificationsIfNeedeed(nextProps);
    }

    addNewAccessNotificationsIfNeedeed(nextProps) {
        const {onNotify} = this.props;

        const newCapabilities = this.getChangedCapabilities(nextProps);

        for (let key in newCapabilities) {
            const message = 'You have got access to ' + capabilitiesNames[key] + '.';

            onNotify({
                title: 'Got access',
                message,
                image: infoIcon,
                status: 'info',
                dismissible: true,
                dismissAfter: 3000
            });
        }
    }

    getChangedCapabilities(nextProps){
        const oldCapabilities = this.props.capabilities;
        const {capabilities} = nextProps;

        const changedCapabilities = {};

        for(let key in capabilities){
            const oldCapability = oldCapabilities[key];
            const currentCapability = capabilities[key];

            if (!oldCapability && currentCapability) {
                changedCapabilities[key] = true;
            }
        }

        return changedCapabilities;
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state) => {
    const {user} = state.room.authInfo;

    return {
        capabilities: user.capabilities
    };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAccessNotificationsContainer);
