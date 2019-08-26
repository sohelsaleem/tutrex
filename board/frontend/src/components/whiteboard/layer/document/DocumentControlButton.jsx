import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './DocumentControlButton.scss';

export default class DocumentControlButton extends Component {
    static propTypes = {
        className: PropTypes.any,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const {className, onClick} = this.props;

        const buttonClass = classNames(styles.documentButton, className);

        return <div className={buttonClass}
                    onClick={onClick}></div>;
    }
}
