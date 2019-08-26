import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import styles from './StorageListIcon.scss';

export default class StorageListIcon extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        asset: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        width: '1.5rem',
        height: '1.5rem'
    };

    render() {
        const {onClick, asset, className, width, height} = this.props;
        const style = {
            backgroundImage: `url(${asset})`,
            width,
            height,
            cursor: Boolean(onClick) ? 'pointer' : 'default'
        };

        return (
            <div className={classnames(styles.icon, className)} style={style} onClick={onClick ? onClick : () => {
            }}/>
        );
    }
}
