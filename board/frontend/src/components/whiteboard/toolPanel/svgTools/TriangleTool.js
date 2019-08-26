import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class TriangleTool extends Component {
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
                <path fill={fill} fillRule="nonzero" d="M2.535 17.888h14.461l-7.23-14.46-7.231
                14.46zM8.873.741c.493-.986 1.29-.99 1.785 0l8.682 17.362c.493.986-.007
                1.785-1.115 1.785H1.305c-1.108 0-1.609-.795-1.114-1.785L8.873.741z"/>
            </svg>
        );
    }
}
