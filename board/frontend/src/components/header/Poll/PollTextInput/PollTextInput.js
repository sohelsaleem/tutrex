import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import PollTextInputLabel from "./PollTextInputLabel";
import styles from './PollTextInput.scss';

export const POLL_INPUT_PARAMS = {
    question: {
        type: 'question',
        charsLimit: 300,
        titleFontSize: '14px'
    },
    answer: {
        type: 'answer',
        charsLimit: 150,
        titleFontSize: '12px'
    }
};

export default class PollTextInput extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        inputParams: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        onChange: PropTypes.func
    };

    state = {
        value: ''
    };

    get value() {
        return this.state.value;
    }

    onChange(e) {
        const {onChange} = this.props;
        this.setState({value: e.target.value}, () => {
            if (onChange) {
                onChange();
            }
        });
    }

    render() {
        const {title, inputParams} = this.props;
        const {charsLimit, titleFontSize} = inputParams;
        const {value} = this.state;
        const charsLeft = charsLimit - value.length;

        return (
            <div>
                <PollTextInputLabel title={title} titleFontSize={titleFontSize} charsLeft={charsLeft}/>
                {this.renderInput()}
            </div>
        );
    }

    renderInput() {
        const {inputParams, placeholder} = this.props;
        const {charsLimit, type} = inputParams;
        const {value} = this.state;

        if (type === POLL_INPUT_PARAMS.question.type) {
            const textareaClassname = classnames(styles.pollTextInput, styles.pollTextInputQuestion);

            return <textarea className={textareaClassname}
                             value={value}
                             onChange={::this.onChange}
                             maxLength={charsLimit}/>;
        }

        return <input className={styles.pollTextInput}
                      value={value}
                      onChange={::this.onChange}
                      maxLength={charsLimit}
                      placeholder={placeholder}/>;
    }
}