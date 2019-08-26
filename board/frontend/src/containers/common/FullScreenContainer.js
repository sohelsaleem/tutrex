import {connect} from 'react-redux';

import {

} from 'actions/displayStates';

import {changeDocumentFullScreen} from 'actions/whiteboard';

import FullScreen from '../../components/common/FullScreen';

const mapStateToProps = (state) => {
    const {fullScreenEnabled} = state.whiteboard;

    return {
        fullScreenEnabled
    };
};

const mapDispatchToProps = {
    onFullScreenChange: changeDocumentFullScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(FullScreen);
