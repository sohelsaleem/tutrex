import React, {Component, PropTypes} from 'react';
import CircularSmallOneColorProgress from 'components/common/progress/CircularSmallOneColorProgress';
import styles from './ScreenBeforeWhiteboard.scss';

export default class ScreenBeforeWhiteboard extends Component {
    static propTypes = {
        informationText: PropTypes.string,
        needLoading: PropTypes.bool
    };

    static defaultProps = {
        needLoading: false
    };

    render() {
        const {informationText, needLoading} = this.props;

        return (
            <div className={styles.mainContainer}>
                <div className={styles.informationText}>
                    {informationText}
                </div>
                {needLoading &&
                    <div className={styles.circularContainer}>
                        <CircularSmallOneColorProgress color='#fff'/>
                    </div>
                }
            </div>
        );
    }
}

