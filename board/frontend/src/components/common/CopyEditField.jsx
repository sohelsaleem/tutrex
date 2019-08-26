import React, {Component, PropTypes} from 'react';

export default class CopyEditField extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        className: PropTypes.string,
        onDidCopy: PropTypes.func
    };

    render() {
        const {value, className} = this.props;

        return (
                <input type='text'
                       value={value}
                       className={className}
                       onClick={this.handleCopyValue}
                       onChange={new Function}/>
        );
    }

    handleCopyValue = ({target}) => {
        target.select();
        document.execCommand('copy');

        this.props.onDidCopy && this.props.onDidCopy();
    };
}
