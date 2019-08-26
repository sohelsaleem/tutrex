import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class PencilTool extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        isHover: PropTypes.bool.isRequired
    };

    render() {
        const {selected, isHover} = this.props;

        const active = selected;
        const fill = active ? styles.toolsIconActiveColor : (isHover ? styles.toolsIconHoverColor : styles.toolsIconInactiveColor);

        return (
            <svg width="23" height="22" viewBox="0 0 23 22">
                <path fill={fill} fillRule="nonzero" d="M21.258 2.227a2.697 2.697 0 0 1 0 3.819L7.393 19.938a.475.475
                0 0 1-.136.108s-.027 0-.027.027c-.054.027-.08.054-.135.054h-.027L1.056 21.97a.875.875 0 0 1-.812-.19A.78.78
                0 0 1 0 21.21c0-.08 0-.162.027-.243l1.842-5.985v-.027c.027-.054.027-.108.054-.135 0 0
                0-.028.027-.028.027-.054.054-.108.108-.135L15.923.792a2.697 2.697 0 0 1 3.818 0l1.517
                1.435zm-19.2 17.738l3.223-1.002-2.248-2.248-.975 3.25zM17.115 1.929L15.49 3.554l2.979 2.979
                1.624-1.625a1.079 1.079 0 0 0 0-1.543l-1.462-1.463a1.07 1.07 0 0 0-1.516.027z"/>
            </svg>
        );
    }
}

