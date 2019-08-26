import React, {Component, PropTypes} from 'react';
import styles from './CircularSmallOneColorProgress.scss';

export default class CircularSmallOneColorProgress extends Component {
    static propTypes = {
        color: PropTypes.string
    };

    static defaultProps = {
        color: '#3ea1f6'
    };

    render() {
        const {color} = this.props;

        const stylesPath = {
            stroke: color
        };

        return (
            <div className={styles.loader}>
                <svg className={styles.circular}
                     viewBox='25 25 50 50'>
                    <circle className={styles.path}
                            style={stylesPath}
                            cx='50'
                            cy='50'
                            r='20'
                            fill='none'
                            strokeWidth='2'
                            strokeMiterlimit='10'/>
                </svg>
            </div>
        );
    }
}
