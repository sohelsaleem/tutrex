import React, {Component, PropTypes} from 'react';

const KEY_ENTER = 13;

export default class BufferedTextInput extends Component {
    static propTypes = {
        value: PropTypes.any,
        className: PropTypes.any,
        style: PropTypes.object,
        onCommit: PropTypes.func.isRequired
    };

    state = {
        inputValue: this.props.value
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                inputValue: nextProps.value
            });
        }
    }

    render() {
        const {className, style} = this.props;
        const {inputValue} = this.state;

        return (
            <input type='text'
                   className={className}
                   style={style}
                   value={inputValue}
                   onChange={this.handleChange}
                   onKeyDown={this.handleKeyDown}
                   onBlur={this.rollback}/>
        );
    }

    handleChange = ({target: {value}}) => {
        this.setState({
            inputValue: value
        });
    };

    handleKeyDown = ({keyCode}) => {
        if (keyCode !== KEY_ENTER)
            return;

        const {inputValue} = this.state;
        const {onCommit} = this.props;

        onCommit({
            value: inputValue,
            rollback: this.rollback
        })
    };

    rollback = () => {
        this.setState({
            inputValue: this.props.value
        });
    }
}
