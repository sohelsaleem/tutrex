import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class ArrowTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="26" height="21" viewBox="0 0 26 21">
                <path fill={fill} fillRule="nonzero" d="M12.224 18.51l.796-4.078H1.882A1.879
                1.879 0 0 1 0 12.55V8.09c0-1.043.84-1.883 1.882-1.883h11.133l-.79-3.945C11.86.486
                13.959-.72 15.326.488l9.298 8.467c.847.741.847 2.062.014 2.791L15.3 20.224c-1.331
                1.22-3.56-.007-3.077-1.714zm11.067-8.063a.086.086 0 0 1-.003-.003l.003.003zm.015-.193a.149.149
                0 0 0-.004.003l.004-.003zm-.114.103L14.257 2.22l1.197 5.986H2v4.225h13.449l-.233 1.192-.948 4.837 8.924-8.104z"/>
            </svg>
        );
    }
}
