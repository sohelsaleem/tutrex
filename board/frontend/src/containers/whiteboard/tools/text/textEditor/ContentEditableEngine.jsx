import React, {Component, PropTypes} from 'react';

const KEY_ENTER = 13;

export default class ContentEditableEngine extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        className: PropTypes.any,
        style: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        onEnter: PropTypes.func.isRequired
    };

    focus() {
        this.nativeElement.focus();
    }

    shouldComponentUpdate(nextProps) {
        return !this.refs.nativeElement;
    }

    componentDidUpdate() {
        if (this.refs.nativeElement && this.innerHTML !== this.props.value)
            this.innerHTML = this.props.value;
    }

    render() {
        const {value, className, style, onChange} = this.props;

        return (
            <div contentEditable
                 ref='nativeElement'
                 className={className}
                 style={style}
                 dangerouslySetInnerHTML={{__html: value}}
                 onInput={this.handleChangeText}
                 onKeyDown={this.handleKeyboard}></div>
        );
    }

    handleChangeText = () => {
        const value = this.refs.nativeElement.innerText;
        this.props.onChange(value);
    };

    handleKeyboard = event => {
        const {keyCode} = event;

        if (keyCode === KEY_ENTER)
            this.props.onEnter();
    };

    set innerHTML(value) {
        this.nativeElement.innerHTML = value;
    }

    get innerHTML() {
        return this.nativeElement.innerHTML;
    }

    get nativeElement() {
        return this.refs.nativeElement;
    }
}
