import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import styles from './ToolButton.scss';

export default class ToolButton extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
        onSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        disabled: false
    };

    state = {
        isHover: false
    };

    handleOnMouseOver() {
        this.setState({
            isHover: true
        });
    }

    handleOnMouseOut(){
        this.setState({
            isHover:  false
        });
    }

    render() {
        const {
            icon,
            selected,
            disabled,
            onSelect
        } = this.props;

        const {isHover} = this.state;

        const enabled = !disabled;

        const className = classNames(styles.tool, {
            [styles.toolDisabled]: disabled
        });

        const Icon = icon || null;

        return (
            <div className={className}
                 onClick={enabled && onSelect}
                 onMouseOver={::this.handleOnMouseOver}
                 onMouseOut={::this.handleOnMouseOut}>
                {icon && <Icon enabled={enabled} selected={selected} isHover={isHover}/>}
            </div>
        );
    }
}
