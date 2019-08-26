import React, {Component, PropTypes} from 'react';

import Dialog from 'components/common/Dialog';
import PollTextInput, {POLL_INPUT_PARAMS} from 'components/header/Poll/PollTextInput/PollTextInput';

import styles from 'components/header/Poll/PollModal.scss';
import commonStyles from 'components/ComponentsTheme.scss';

const POLL_MAXIMUM_ANSWERS = 5;

export default class PollCreate extends Component {
    static propTypes = {
        onCreatePoll: PropTypes.func.isRequired,
        onCloseModal: PropTypes.func.isRequired
    };

    state = {
        publishDisabled: true
    };

    getNonEmptyAnswers() {
        const {option0, option1, option2, option3, option4} = this.refs;

        return [option0, option1, option2, option3, option4].reduce((result, option) => {
            const value = option.value.trim();
            if (value) {
                result.push(value);
            }

            return result;
        }, []);
    }

    isFormValid() {
        const {question} = this.refs;

        return question.value.trim() && this.getNonEmptyAnswers().length > 1;
    }

    onCreatePoll() {
        const {onCreatePoll} = this.props;
        const {question} = this.refs;
        const answers = this.getNonEmptyAnswers();

        onCreatePoll({
            question: question.value.trim(),
            answers: answers
        });
    }

    onInputChange() {
        this.setState({
            publishDisabled: !this.isFormValid()
        });
    }

    renderAnswers() {
        return [...Array(POLL_MAXIMUM_ANSWERS).keys()].map(key => {
            const placeholder = key > 1 ? '(optional)' : '';

            return <PollTextInput title={`Option ${key + 1}`}
                                  inputParams={POLL_INPUT_PARAMS.answer}
                                  key={key}
                                  placeholder={placeholder}
                                  ref={`option${key}`}
                                  onChange={::this.onInputChange}/>
        });
    }

    render() {
        const {onCloseModal} = this.props;
        const {publishDisabled} = this.state;

        return (
            <Dialog onClose={onCloseModal} title='Create poll' visible={true} dialogClassName={styles.createPollModal}>
                <PollTextInput title='Question'
                               inputParams={POLL_INPUT_PARAMS.question}
                               ref='question'
                               onChange={::this.onInputChange}/>
                {this.renderAnswers()}
                <div className={styles.actionContainer}>
                    <button className={commonStyles.buttonBlue}
                            onClick={::this.onCreatePoll}
                            disabled={publishDisabled}>
                        Publish Poll
                    </button>
                </div>
            </Dialog>
        );
    }
}
