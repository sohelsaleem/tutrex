import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class LineTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="20" height="21" viewBox="0 0 20 21">
                <path fill={fill} fillRule="nonzero" d="M18 0L0 19l1.452 1.375 18-19z"/>
            </svg>
        );
    }
}

