import React, {Component, PropTypes} from 'react';
import styles from './ToolsTheme.scss';

export default class SelectTool extends Component {
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
                <path fill={fill} fillRule="nonzero" stroke="#AEB5BD" strokeWidth=".3" d="M14.916
                10.152l4.293-2.574a.578.578 0 0 0-.122-1.046L1.753 1.027a.578.578 0 0 0-.723.735l5.635
                16.725a.577.577 0 0 0 1.032.13l2.413-3.72 4.39 4.4a.576.576 0 0 0 .817 0l3.97-3.962a.578.578
                0 0 0 0-.818l-4.37-4.365zm-.006 7.92l-4.487-4.496a.577.577 0 0 0-.894.093l-2.15 3.316-4.89-14.511
                15.028 4.772-3.83 2.296a.578.578 0 0 0-.112.905l4.487 4.479-3.152 3.145z"/>
            </svg>
        );
    }
}
