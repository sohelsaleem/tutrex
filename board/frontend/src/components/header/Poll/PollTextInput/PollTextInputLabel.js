import React, {Component, PropTypes} from 'react';
import styles from './PollTextInputLabel.scss';

export default class PollTextInputLabel extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        titleFontSize: PropTypes.string.isRequired,
        charsLeft: PropTypes.number.isRequired
    };

    render() {
        const {title, titleFontSize, charsLeft} = this.props;

        return (
            <div className={styles.pollTextInputLabel}>
                <div style={{fontSize: titleFontSize}}>{title}</div>
                <div className={styles.pollTextInputCharsLeft}>{charsLeft} characters</div>
            </div>
        );
    }
}