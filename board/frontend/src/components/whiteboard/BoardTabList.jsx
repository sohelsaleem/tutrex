import React, {Component, PropTypes} from 'react';
import styles from './BoardTabList.scss';
import BoardTab from './BoardTab';

export default class BoardTabList extends Component {
    static propTypes = {
        boards: PropTypes.array.isRequired,
        currentBoardId: PropTypes.number.isRequired,
        enabled: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        onAdd: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onRename: PropTypes.func.isRequired
    };

    render() {
        const {boards, enabled, onAdd} = this.props;

        return (
            <div className={styles.tabsPanel}>
                <div className={styles.tabList}>
                    {boards.map(this.renderBoardTab)}
                </div>

                {enabled && <div className={styles.addTabButton}
                                 onClick={onAdd}></div>}
            </div>
        );
    }

    renderBoardTab = (board, index) => {
        const {currentBoardId, boards, enabled} = this.props;
        const active = currentBoardId === board.id;
        const canBeClosed = boards.length > 1;

        return <BoardTab key={index}
                         board={board}
                         active={active}
                         enabled={enabled}
                         closable={canBeClosed}
                         onSelect={this.handleSelectBoard(board.id)}
                         onClose={this.handleCloseBoard(board.id)}
                         onRename={this.handleRenameBoard(board.id)}/>;
    };

    handleSelectBoard = boardId => () => {
        this.props.onSelect(boardId);
    };

    handleCloseBoard = boardId => () => {
        this.props.onClose(boardId);
    };

    handleRenameBoard = boardId => boardName => {
        this.props.onRename(boardId, boardName);
    }
}
