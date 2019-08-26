import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import ScreenShareUtils from 'helpers/videoChat/ScreenShareUtils';

import {isFirefox} from 'helpers/BrowserDetector';
import ConfirmDialog from 'components/common/ConfirmDialog';
import config from 'config';
import {publishStream} from 'actions/videoChat';
import {StreamTypes} from 'helpers/videoChat/VideoChatUtils';

import {
    toggleNeedShowInstallExt,
    removePressByScreenSharingValue
} from 'actions/displayStates';


class ScreenSharingContainer extends Component {
    static propTypes = {
        onToggleNeedShowInstallExt: PropTypes.func.isRequired,
        onPublishStream: PropTypes.func.isRequired,
        onRemovePressByScreenSharingValue: PropTypes.func.isRequired
    };

    componentWillReceiveProps(props){
        if(this.isPressedByScreenSharing(props)){
            this.handleScreenSharingStateChanged();
            this.props.onRemovePressByScreenSharingValue();
        }
    }

    isPressedByScreenSharing(props){
        return props.pressedScreenSharing;
    }

    handleScreenSharingStateChanged = () => {
        ScreenShareUtils.requestScreen()
            .then(this.handleScreenReceived)
            .catch(this.handleScreenNotReceived);
    };

    handleScreenReceived = (stream) => {
        if (stream == null) {
            this.handleScreenNotReceived();
            return;
        }
        this.props.onPublishStream(this.props.user.id, StreamTypes.SCREEN, stream);
    };

    handleScreenNotReceived = (errorWhenChoosenScreen) => {
        if (!errorWhenChoosenScreen) return;
        this.props.onToggleNeedShowInstallExt(true);
    };

    handleDialogClose(){
        this.props.onToggleNeedShowInstallExt(false);
    }

    handleDialogOnConfirm(){
        const extensionLink = isFirefox() ? config.extensions.firefox.link : config.extensions.chrome.link;

        window.open(extensionLink,'_blank');
        this.handleDialogClose();
    }

    render() {
        const {
            needShowInstallExt
        } = this.props;

        return (
            <div>
                {needShowInstallExt && <ConfirmDialog title='Screen share'
                                                      text='You need to download the extension to use screen sharing mode.'
                                                      yesText='Download'
                                                      noText='Cancel'
                                                      onConfirm={::this.handleDialogOnConfirm}
                                                      onClose={::this.handleDialogClose}/>}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    const {user} = state.room.authInfo;

    return {
        user,
        pressedScreenSharing: state.displayStates.pressedScreenSharing,
        needShowInstallExt: state.displayStates.needShowInstallExt
    };
};

const mapDispatchToProps = {
    onToggleNeedShowInstallExt: toggleNeedShowInstallExt,
    onPublishStream: publishStream,
    onRemovePressByScreenSharingValue: removePressByScreenSharingValue
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSharingContainer);
