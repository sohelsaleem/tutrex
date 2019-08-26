import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class EraserTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="20" height="23" viewBox="0 0 20 23">
                <path fill={fill} fillRule="nonzero" d="M18.969 20.843c.235 0 .426.242.426.54v.44c0
                .298-.19.54-.426.54H.633c-.236 0-.427-.242-.427-.54v-.44c0-.298.191-.54.427-.54h18.336zM4.514
                18.86L.741 15.086a2.537 2.537 0 0 1 0-3.583l5.382-5.381L11.503.74a2.537 2.537 0 0 1 3.583
                0l3.775 3.774c.476.476.74 1.113.74 1.791 0 .679-.263 1.315-.74 1.792L8.098 18.86a2.526 2.526
                0 0 1-1.792.741 2.524 2.524 0 0 1-1.792-.74zM1.458 12.22a1.523 1.523 0 0 0 0 2.15l3.773
                3.774a1.522 1.522 0 0 0 2.15 0l5.022-5.021L6.48 7.198 1.458 12.22z"/>
            </svg>
        );
    }
}

