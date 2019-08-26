import React, {Component, PropTypes} from 'react';
import styles from './MacroToolButton.scss';
import classNames from 'classnames';

const onClickOutside = require('react-onclickoutside');

class MacroToolButton extends Component {
    static propTypes = {
        children: PropTypes.array
    };

    state = {
        expanded: false,
        selectedIndex: 0
    };

    render() {
        const {expanded} = this.state;

        return (
            <div className={styles.macroToolButton}>
                {this.renderSelectedItem(expanded)}
                {expanded && this.renderOptions()}
            </div>
        );
    }

    collapse = () => {
        this.setState({expanded: false});
    };

    renderSelectedItem(isExpanded) {
        const {selectedIndex} = this.state;
        const {children} = this.props;

        const ExpandButtonClassName = classNames(styles.expandButton, {
           [styles.activeExpandButton]: isExpanded
        });

        return (
            <div className={styles.front}>
                {children[selectedIndex]}
                <div className={ExpandButtonClassName} onClick={this.toggleExpand}></div>
            </div>
        );
    }

    toggleExpand = () => {
        const nextExpaned = !this.state.expanded;
        this.setState({expanded: nextExpaned});
    };

    renderOptions() {
        return (
            <div className={styles.optionsContainer}>
                <div className={styles.optionsList}>
                    {React.Children.map(this.props.children, this.wrapToolButton)}
                </div>
            </div>
        );
    }

    wrapToolButton = (child, index) => {
        const props = Object.assign({}, child.props, {
            onSelect: (...args) => {
                this.selectItem(child);
                child.props.onSelect(...args);
            }
        });

        return React.cloneElement(child, props);
    };

    selectItem(child) {
        const nextIndex = this.props.children.indexOf(child);

        this.setState({
            selectedIndex: nextIndex,
            expanded: false
        });
    }

    handleClickOutside = event => {
        this.collapse();
    }
}

export default onClickOutside(MacroToolButton);
