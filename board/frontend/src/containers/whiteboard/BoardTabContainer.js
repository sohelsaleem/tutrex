import {connect} from 'react-redux';

import {selectBoard, addBoard, closeBoard, renameBoard} from 'actions/whiteboard';

import BoardTabList from 'components/whiteboard/BoardTabList';

import {checkAccessCurrentUser} from 'domain/Capabilities';

const mapStateToProps = (state) => state => {
    const enabled = checkAccessCurrentUser(state).canUseWhiteboard();
    return {
        enabled,
        ...state.whiteboard
    }
};

const mapDispatchToProps = {
    onSelect: selectBoard,
    onAdd: addBoard,
    onClose: closeBoard,
    onRename: renameBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTabList);
