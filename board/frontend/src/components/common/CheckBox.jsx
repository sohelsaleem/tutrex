import React, {Component, PropTypes} from 'react';
import styles from './CheckBox.scss';
import classNames from 'classnames';

export default class CheckBox extends Component {
    static propTypes = {
        checked: PropTypes.bool,
        partialChecked: PropTypes.bool,
        label: PropTypes.any,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        checked: false
    };

    render() {
        const {checked, partialChecked, label, onChange} = this.props;

        const boxClassName = classNames(styles.iconBox, {
            [styles.iconBoxChecked]: checked && !partialChecked,
            [styles.iconBoxPartialChecked]: checked && partialChecked
        });

        return (
            <label className={styles.label}>
                {label}
                <input type='checkbox'
                       className={styles.checkBox}
                       checked={checked}
                       onChange={onChange}/>

                <span className={boxClassName}></span>
            </label>
        );
    }
}
