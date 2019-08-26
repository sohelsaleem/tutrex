import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class CircleTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="22" height="22" viewBox="0 0 22 22">
                <path fill={fill} fillRule="nonzero" d="M11 22C4.925 22 0 17.075 0 11S4.925
                0 11 0s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>
            </svg>
        );
    }
}
