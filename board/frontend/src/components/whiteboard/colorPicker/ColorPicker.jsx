import React, {Component, PropTypes} from 'react';

import classNames from 'classnames';
import styles from './ColorPicker.scss';

const COLORS = [
    'transparent',
    '#0f0c12',
    '#ffffff',
    '#4cd64c',
    '#fffe71',
    '#ffb762',
    '#ff4e4e',
    '#c448ea',
    '#84ffd6',
    '#5deaff',
    '#7075f7',
    '#31379e'
];

export default class ColorPicker extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className={styles.colorPicker}>
                <div className={styles.colorGrid}>
                    {COLORS.map(this.renderColorRectangle)}
                </div>
            </div>
        );
    }

    renderColorRectangle = (color, index) => {
        const colorClass = classNames(styles.colorRectangle, {
            [styles.transparentColor]: color === 'transparent'
        });


        const style = {
            backgroundColor: color
        };

        return <div key={index}
                    className={colorClass}
                    onClick={this.handleChangeColor(color)}
                    style={style}></div>;
    };

    handleChangeColor = color => () => {
        this.props.onChange(color);
    };
}
