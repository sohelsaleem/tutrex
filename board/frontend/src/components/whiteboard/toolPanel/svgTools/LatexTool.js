import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class LatexTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="20" height="16" viewBox="0 0 20 16">
                <path fill={fill} fillRule="nonzero" d="M14.37.094L8.7.13C6.964.142 5.584.506 4.288
                1.716c-1.124 1.05-1.952 2.382-2.816 3.64 1.342.096 1.632-.52 2.6-1.282a4.146 4.146
                0 0 1 3-.95c-1 2.814-2.4 6.05-4.434 8.27-.838.926-2.258 1.89-2.584 3.174-.336 1.32
                1 1.682 2 1.278C3.333 15.33 4.1 14 4.76 12.864a40.874 40.874 0 0 0 2.118-4.4c.634-1.478
                1.24-2.966 1.852-4.454.361-.88.481-.904 1.4-.912h2.473A142.99 142.99 0 0 0 9.978 9.32c-.628
                1.6-1.75 3.924-.952 5.638s3.032 1.078 4.248.214c1.522-1.078 2.27-2.8 3.11-4.4-1.052
                0-1.214.046-1.8.91-.37.54-1.088 1.096-1.8 1-1.872-.258-.2-3.654.132-4.55a48.01 48.01
                0 0 1 1.13-2.786c.23-.524.442-1.068.7-1.58.332-.66.344-.646 1.084-.678.652-.028 2.474.316
                3.032-.06.6-.4.898-2.256 1.138-2.948-1.838-.184-3.784.004-5.63.014z"/>
            </svg>
        );
    }
}

