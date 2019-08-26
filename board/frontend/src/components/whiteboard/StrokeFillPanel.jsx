import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Slider from 'components/slider/Slider';
import ColorPickerButton from './colorPicker/ColorPickerButton';

import styles from './StrokeFillPanel.scss';

export default class StrokeFillPanel extends Component {
    static propTypes = {
        strokeColor: PropTypes.string.isRequired,
        strokeWidth: PropTypes.number.isRequired,
        fillColor: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        enabled: PropTypes.bool.isRequired
    };

    render() {
        const {
            strokeColor,
            strokeWidth,
            fillColor,
            enabled
        } = this.props;
        const panelClassname = classnames(styles.strokeFillPanel, {
            [styles.disabled]: !enabled
        });

        return (
            <div className={panelClassname}>
                <ColorPickerButton buttonClassName={styles.colorButton}
                                   value={fillColor}
                                   textButton='Fill:'
                                   onChange={this.handleChangeFillColor}/>

                <ColorPickerButton buttonClassName={styles.colorButton}
                                   value={strokeColor}
                                   textButton='Borders:'
                                   onChange={this.handleChangeStrokeColor}/>
                <div className={styles.strokeWidthContainer}>
                    <div className={styles.strokeWidthHint}>{strokeWidth}</div>
                    <Slider className={styles.strokeWidth}
                            min={1}
                            max={10}
                            value={strokeWidth}
                            onChange={this.handleChangeThickness}/>
                </div>
            </div>
        );
    }

    handleChangeStrokeColor = value => {
        const {
            strokeWidth,
            fillColor
        } = this.props;

        this.props.onChange(value, strokeWidth, fillColor);
    };

    handleChangeFillColor = value => {
        const {
            strokeColor,
            strokeWidth
        } = this.props;

        this.props.onChange(strokeColor, strokeWidth, value);
    };

    handleChangeThickness = value => {
        const {
            strokeColor,
            fillColor
        } = this.props;

        this.props.onChange(strokeColor, value, fillColor);
    };
}
