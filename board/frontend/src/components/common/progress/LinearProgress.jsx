import React, {Component, PropTypes} from 'react';
import styles from './LinearProgress.scss';

export default class LinearProgress extends Component {
    static propTypes = {
        progress: PropTypes.number,
        withHint: PropTypes.bool
    };

    static defaultProps = {
        progress: 0,
        withHint: false
    };

    render() {
        const {progress, withHint} = this.props;
        const percents = Math.round(progress * 100);
        const hint = withHint && `${percents}%`;

        return (
            <div className={styles.progress}>
                <div className={styles.bar}
                     style={{width: `${percents}%`}}></div>
                <div className={styles.hint}>{hint}</div>
            </div>
        );
    }
}
