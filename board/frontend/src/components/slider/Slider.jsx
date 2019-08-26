import React, {Component, PropTypes} from 'react';
import RcSlider  from 'rc-slider';
import './index.css';

export default class Slider extends Component {
    static propTypes = {
        className: PropTypes.any,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        step: 1
    };

    render() {
        const {
            className,
            min,
            max,
            step,
            value,
            onChange
        } = this.props;

        return (
            <div className={className}>
                <RcSlider min={min}
                          max={max}
                          step={step}
                          value={value}
                          onChange={onChange}/>
            </div>
        );
    }
}
