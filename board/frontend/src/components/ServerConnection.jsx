import React, {Component, PropTypes} from 'react';
import CircularSmallOneColorProgress from 'components/common/progress/CircularSmallOneColorProgress';
import styles from './ServerConnection.scss';

export default class ServerConnection extends Component {
    static propTypes = {
        internetFail: PropTypes.bool.isRequired
    };

    static defaultProps = {
        internetFail: false
    };

    render() {
        const {internetFail} = this.props;

        return (
            <div className={styles.mainContainer}>
                {internetFail &&
                    <div className={styles.textsContainer}>
                        <div className={styles.informationText}>Network has been lost.</div>
                        <div className={styles.informationText}>Establish connection...</div>
                    </div>
                }
                <CircularSmallOneColorProgress color='#fff'/>
            </div>
        );
    }
}
