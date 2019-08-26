import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class TextTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <path fill={fill} fillRule="evenodd" d="M19.048 0H.952A.953.953 0 0 0
                0 .952V3.81a.953.953 0 0 0 1.905 0V1.905h7.143v16.19H7.143a.953.953 0
                0 0 0 1.905h5.714a.953.953 0 0 0 0-1.905h-1.905V1.905h7.143V3.81a.953.953
                0 0 0 1.905 0V.952A.953.953 0 0 0 19.048 0"/>
            </svg>
        );
    }
}

