import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class UndoTool extends Component {
    static propTypes = {
        enabled: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {enabled, isHover} = this.props;

        const active = enabled;
        const fill = active ? (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor) : styles.toolsIconInActiveColorLight;

        return (
            <svg width="20" height="16" viewBox="0 0 20 16">
                <path fill={fill} fillRule="nonzero" d="M7.733 12.15C14.352 11.997
                19.682 6.633 19.782 0a13.494 13.494 0 0 1-10.58 5.1c-.496
                0-.986-.026-1.469-.078v-3.15c0-.651-.375-.818-.85-.36L.355
                7.808a1.125 1.125 0 0 0 0 1.639l6.53 6.296c.469.453.85.292.85-.36V12.15z"/>
            </svg>
        );
    }
}
