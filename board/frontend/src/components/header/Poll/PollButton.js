import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import styles from './PollButton.scss';

export default class PollButton extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        onButtonClick: PropTypes.func.isRequired
    };

    render() {
        const {enabled} = this.props;
        const buttonClassname = classnames(styles.pollButton, {
            [styles.enabled]: enabled
        });

        return (
            <div className={buttonClassname} onClick={::this.handleClick}/>
        );
    }

    handleClick() {
        const {enabled, onButtonClick} = this.props;
        if (enabled)
            onButtonClick();
    }
}
