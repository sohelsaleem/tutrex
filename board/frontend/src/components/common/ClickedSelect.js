import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import styles from './ClickedSelect.scss';

export default class ClickedSelect extends Component {
    static propTypes = {
        range: PropTypes.array.isRequired,
        defaultIndex: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string
    };

    static defaultProps = {
        defaultIndex: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            index: props.defaultIndex
        };
    }

    up = () => {
        const {index} = this.state;
        const {onChange, range} = this.props;
        const newIndex = index + 1 > range.length - 1 ? range.length - 1 : index + 1;
        this.setState({index: newIndex}, onChange(range[newIndex]));
    };

    down = () => {
        const {index} = this.state;
        const {onChange, range} = this.props;
        const newIndex = index - 1 < 0 ? 0 : index - 1;
        this.setState({index: newIndex}, onChange(range[newIndex]));
    };

    render() {
        const {range, className} = this.props;
        const {index} = this.state;
        const value = range[index];
        const upClassname = classnames(styles.control, styles.up, index === range.length - 1 ? styles.disabled : '');
        const downClassname = classnames(styles.control, styles.down, index === 0 ? styles.disabled : '');
        const containerClassname = classnames(styles.container, className ? className : '');
        return (
            <div className={containerClassname}>
                <div className={upClassname} onClick={this.up}/>
                <div className={styles.value}>{value}</div>
                <div className={downClassname} onClick={this.down}/>
            </div>
        )
    }
}
