import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';
import styles from './BoardTab.scss';
import classNames from 'classnames';

const KEY_CODE_ENTER = 13;

export default class BoardTab extends Component {
    static propTypes = {
        board: PropTypes.object.isRequired,
        active: PropTypes.bool.isRequired,
        enabled: PropTypes.bool.isRequired,
        closable: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onRename: PropTypes.func.isRequired
    };

    state = {
        editMode: false
    };

    handleChangeMode = isEditMode => () => {
        this.setState({editMode: isEditMode});
    };

    render() {
        const {
            board: {name},
            active,
            enabled,
            closable,
            onSelect,
            onRename
        } = this.props;

        const {editMode} = this.state;

        const className = classNames(styles.boardTab, {
            [styles.tabActive]: active,
            [styles.tabDisabled]: !enabled
        });

        const canBeClosed = closable && enabled;

        return (
            <div className={className}
                 onClick={enabled && onSelect} onDoubleClick={enabled && this.handleChangeMode(true)}>
                {
                    editMode && enabled
                        ? <RenamingInputWithOutsideListener
                            className={styles.renamingInput}
                            name={name}
                            onFinish={this.handleChangeMode(false)}
                            onRename={onRename}/>
                        : <div className={styles.label}>{name}</div>
                }
                {canBeClosed && <div className={styles.closeButton}
                                     onClick={this.handleClose}></div>}
            </div>
        );
    }

    handleClose = event => {
        event.stopPropagation();
        this.props.onClose();
    };
}


class RenamingInput extends Component {
    static propTypes = {
        onFinish: PropTypes.func.isRequired,
        onRename: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        className: PropTypes.string
    };

    handleFocus = (e) => {
        e.target.select();
    };

    onClickOutside = () => {
        const {value} = this.refs.input;
        const {onFinish, onRename} = this.props;
        onFinish();
        if (!value || value.trim().length === 0)
            return;
        onRename(value.trim());
    };

    handleKeyDown = (e) => {
        if (e.keyCode === KEY_CODE_ENTER) {
            this.onClickOutside();
        }
    };

    render() {
        const {className, name} = this.props;
        return (
            <input className={className} defaultValue={name} ref='input' autoFocus
                   onFocus={this.handleFocus}
                   onBlur={this.onClickOutside}
                   onKeyDown={this.handleKeyDown}

            />
        );
    }
}

const clickOutsideConfig = {
    handleClickOutside: function (instance) {
        return instance.onClickOutside;
    }
};

const RenamingInputWithOutsideListener = onClickOutside(RenamingInput, clickOutsideConfig);
