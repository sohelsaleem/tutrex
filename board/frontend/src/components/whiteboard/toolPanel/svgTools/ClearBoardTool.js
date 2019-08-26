import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class ClearBoardTool extends Component {
    static propTypes = {
        enabled: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {enabled, isHover} = this.props;

        const active = enabled;
        const fill = active ? (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor) : styles.toolsIconInActiveColorLight;

        return (
            <svg width="15" height="19" viewBox="0 0 15 19">
                <path fill={fill} fillRule="nonzero" d="M11.083 1.056h2.644c.576 0
                1.05.472 1.05 1.055v1.056H0V2.11c0-.587.47-1.055 1.05-1.055h2.644C3.694.469
                4.168 0 4.754 0h5.27c.586 0 1.06.473 1.06 1.056zM1.056 4.222v12.669c0
                1.165.941 2.109 2.105 2.109h8.455a2.11 2.11 0 0 0 2.106-2.11V4.223H1.056z"/>
            </svg>
        );
    }
}
