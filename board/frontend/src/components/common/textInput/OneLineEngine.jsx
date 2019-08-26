import React, {Component, PropTypes} from 'react';

export default class OneLineEngine extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        selectionStart: PropTypes.number.isRequired,
        selectionEnd: PropTypes.number.isRequired,
        className: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.updateSelection();
    }

    updateSelection() {
        const {selectionStart, selectionEnd} = this.props;
        this.refs.input.setSelectionRange(selectionStart, selectionEnd);
    }

    componentDidUpdate(prevProps) {
        if (this.doesAnyOfPropsChange(prevProps, ['selectionStart', 'selectionEnd']))
            this.updateSelection();
    }

    doesAnyOfPropsChange(prevProps, keyList) {
        return keyList.some(key => this.doesPropChange(prevProps, key));
    }

    doesPropChange(prevProps, key) {
        return prevProps[key] !== this.props[key];
    }

    render() {
        const {value, className} = this.props;

        return (
            <input ref='input'
                   type='text'
                   value={value}
                   className={className}
                   onChange={this.handleChangeTextOrCaret}
                   onKeyDown={this.handleKeyboard}
                   onKeyUp={this.handleChangeTextOrCaret}
                   onMouseUp={this.handleChangeTextOrCaret}/>
        );
    }

    handleChangeTextOrCaret = ({target: {value, selectionStart, selectionEnd}}) => {
        this.props.onChange(value, selectionStart, selectionEnd);
    };

    handleKeyboard = event => {
        const {keyCode} = event;
        this.props.onKeyDown(keyCode);
    };

    focus() {
        this.refs.input.focus();
    }
}
