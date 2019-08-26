import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class RedoTool extends Component {
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
                <path fill={fill} fillRule="nonzero" d="M12.048 3.85C5.43 4.003.1 9.367 0 16a13.494
            13.494 0 0 1 10.579-5.1c.496 0 .987.026 1.47.078v3.15c0
            .651.374.818.849.36l6.53-6.296c.469-.453.474-1.181 0-1.639L12.898.257c-.47-.453-.85-.292-.85.36V3.85z"/>
            </svg>
        );
    }
}
