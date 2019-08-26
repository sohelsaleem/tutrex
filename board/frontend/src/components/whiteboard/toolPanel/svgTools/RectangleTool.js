import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class RectangleTool extends Component {
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
                <path fill={fill} fillRule="nonzero" d="M2 18h16V2H2v16zM0
                1.99C0 .892.898 0 1.99 0h16.02C19.108 0 20 .898 20 1.99v16.02c0
                1.099-.898 1.99-1.99 1.99H1.99C.892 20 0 19.102 0 18.01V1.99z"/>
            </svg>
        );
    }
}

