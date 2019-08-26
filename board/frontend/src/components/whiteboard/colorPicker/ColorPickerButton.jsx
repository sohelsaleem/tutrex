import React, {Component, PropTypes} from 'react';
import ColorPicker from './ColorPicker';
import classNames from 'classnames';

import styles from './ColorPickerButton.scss';

const onClickOutside = require('react-onclickoutside');

class ColorPickerButton extends Component {
    static propTypes = {
        buttonClassName: PropTypes.string,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        textButton: PropTypes.string
    };

    state = {
        pickerVisible: false
    };

    render() {
        const {buttonClassName, value, onChange, textButton} = this.props;
        const {pickerVisible} = this.state;

        const previewColorClass = classNames(styles.previewColor, {
            [styles.transparentColor]: value === 'transparent'
        });

        const previewStyle = {
            backgroundColor: value
        };

        return (
            <div className={styles.colorPickerButtonContainer}>
                <div className={buttonClassName}>{textButton}</div>

                <div className={previewColorClass}
                     style={previewStyle}
                     onClick={this.handleTogglePicker}>
                    {pickerVisible && <ColorPicker value={value}
                                                   onChange={this.handleChangeColor}/>}
                </div>
            </div>
        );
    }

    handleTogglePicker = () => {
        this.setState({
            pickerVisible: !this.state.pickerVisible
        });
    };

    handleChangeColor = color => {
        this.props.onChange(color);
        this.hidePicker();
    };

    hidePicker() {
        this.setState({
            pickerVisible: false
        });
    }

    handleClickOutside = event => {
        this.hidePicker();
    };
}

export default onClickOutside(ColorPickerButton);
