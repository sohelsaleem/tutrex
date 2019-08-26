import React, {Component, PropTypes} from 'react';
import styles from './ChangeFullScreenModeButton.scss';

export default class ChangeFullScreenModeButton extends Component {
    static propTypes = {
        className: PropTypes.any,
        onFullScreenChange: PropTypes.func.isRequired
    };

    render() {
        const {onFullScreenChange} = this.props;

        return <div className={styles.changeFullScreenModeButton}
                    onClick={onFullScreenChange}></div>;
    }
}
