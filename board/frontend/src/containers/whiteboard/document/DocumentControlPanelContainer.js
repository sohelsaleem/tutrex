import {connect} from 'react-redux';

import {selectDocumentPage, changeDocumentZoom, changeDocumentFullScreen} from 'actions/whiteboard';
import {checkAccessCurrentUser} from 'domain/Capabilities';
import {getCurrentBoard} from 'helpers/BoardHelper';

import DocumentControlPanel from 'components/whiteboard/layer/document/DocumentControlPanel';

const mapStateToProps = (state) => {
    const canUseWhiteboard = checkAccessCurrentUser(state).canUseWhiteboard();
    const board = getCurrentBoard(state);

    return {
        canUseWhiteboard,
        ...board
    };
};

const mapDispatchToProps = {
    onSelectPage: selectDocumentPage,
    onZoomChange: changeDocumentZoom,
    onFullScreenChange: changeDocumentFullScreen
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentControlPanel);
