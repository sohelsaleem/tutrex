import React, {Component, PropTypes} from 'react';
import OneLineEngine from './OneLineEngine';

const KEY_ENTER = 13;

export default class TextInput extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        selectionStart: PropTypes.number.isRequired,
        selectionEnd: PropTypes.number.isRequired,
        className: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func,
        onEnter: PropTypes.func
    };

    render() {
        const Engine = OneLineEngine;

        const {
            value,
            selectionStart,
            selectionEnd,
            className,
            onChange,
            onSelectionChange
        } = this.props;

        return (
            <Engine ref='engine'
                    value={value}
                    selectionStart={selectionStart}
                    selectionEnd={selectionEnd}
                    className={className}
                    onChange={onChange}
                    onSelectionChange={onSelectionChange}
                    onKeyDown={this.handleKeyDown}/>
        );
    }

    handleKeyDown = keyCode => {
        const {onEnter, onKeyDown} = this.props;

        if (keyCode === KEY_ENTER)
            onEnter && onEnter();

        onKeyDown && onKeyDown(keyCode);
    };

    focus() {
        this.refs.engine.focus();
    }
}
