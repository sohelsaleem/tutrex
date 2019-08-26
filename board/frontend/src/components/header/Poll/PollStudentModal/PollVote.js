import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import Dialog from 'components/common/Dialog';

import styles from 'components/header/Poll/PollModal.scss';
import commonStyles from 'components/ComponentsTheme.scss';

export default class PollVote extends Component {
    static propTypes = {
        poll: PropTypes.object.isRequired,
        onSelectAnswer: PropTypes.func.isRequired
    };

    state = {
        selectedAnswer: null
    };

    render () {
        const {poll} = this.props;

        return (
            <Dialog title='Select an option' visible={true} dialogClassName={styles.votePollModal} closable={false}>
                <div className={styles.votePollQuestion}>{poll.question}</div>
                <div className={styles.votePollAnswers}>
                    {this.renderAnswers()}
                </div>
                <div className={styles.actionContainer}>
                    <button className={commonStyles.buttonBlue} onClick={::this.onSendAnswer}>
                        Send
                    </button>
                </div>
            </Dialog>
        );
    }

    onSendAnswer() {
        const {onSelectAnswer} = this.props;
        const {selectedAnswer} = this.state;

        onSelectAnswer(selectedAnswer);
    }

    onSelectAnswer(selectedAnswer) {
        this.setState({selectedAnswer});
    }

    renderAnswers() {
        const {poll} = this.props;
        const {selectedAnswer} = this.state;

        return poll.answers.map((answer, key) => {
            const checkboxClassname = classnames(styles.votePollAnswerCheckbox, {
                [styles.selected]: selectedAnswer === key
            });

            return (
                <div className={styles.votePollAnswerContainer} onClick={this.onSelectAnswer.bind(this, key)} key={key}>
                    <div className={checkboxClassname}/>
                    <div className={styles.votePollAnswerText}>{answer.text}</div>
                </div>
            );
        });
    }
}
