import React, {Component, PropTypes} from 'react';

import Dialog from 'components/common/Dialog';
import PieChart from './PieChart';

import styles from './PollModal.scss';
import commonStyles from 'components/ComponentsTheme.scss';

const PIE_COLORS = ['#4c3ef6', '#42b1ec', '#49e2d5', '#22cb8f', '#9ee73f', '#b3c6d9'];

export default class PollShow extends Component {
    static propTypes = {
        poll: PropTypes.object.isRequired,
        onCloseModal: PropTypes.func,
        isTeacher: PropTypes.bool,
        onToggleShowResults: PropTypes.func,
        users: PropTypes.array.isRequired
    };

    render() {
        const {poll, isTeacher} = this.props;
        const pieData = this.createPieData(poll.answers);

        return (
            <Dialog onClose={::this.onCloseModal}
                    title='Poll result'
                    visible={true}
                    dialogClassName={styles.showPollResultsModal}
                    closable={!!isTeacher}>
                <div className={styles.showPollQuestion}>{poll.question}</div>
                <div className={styles.resultsContainer}>
                    <div className={styles.pieContainer}>
                        <PieChart slices={pieData}/>
                    </div>
                    <div className={styles.pieLegend}>
                        {this.renderAnswers()}
                        <div className={styles.optionContainer}>
                            <div className={styles.optionColor} style={{backgroundColor: PIE_COLORS[5]}}/>
                            <div className={styles.optionText}>No answer</div>
                            <div className={styles.optionVotes}>{this.countNotAnsweredUsers()}</div>
                        </div>
                    </div>
                </div>
                {isTeacher &&
                <div>
                    <div className={styles.showResultsCheckboxContainer}>
                        <input type="checkbox" className={styles.showResultsCheckbox} id="showResultsCheckbox" checked={poll.showResults} onChange={::this.onShowResultsToggle}/>
                        <label htmlFor="showResultsCheckbox">Allow students to see poll results</label>
                    </div>
                    <div className={styles.actionContainer}>
                        <button className={commonStyles.buttonBlue} onClick={::this.onCloseModal}>
                            End Poll
                        </button>
                    </div>
                </div>}
            </Dialog>
        );
    }

    onShowResultsToggle() {
        const {onToggleShowResults} = this.props;

        onToggleShowResults();
    }

    onCloseModal() {
        const {onCloseModal} = this.props;
        if (onCloseModal)
            onCloseModal();
    }

    countNotAnsweredUsers() {
        const {poll, users} = this.props;

        return users.filter(userId => !poll.usersAnswered.includes(userId) && poll.userId !== userId).length;
    }

    createPieData() {
        const {poll} = this.props;
        let answers =  poll.answers.map((answer, key) => ({
            color: PIE_COLORS[key],
            value: answer.votes
        }));
        answers.push({
            color: PIE_COLORS[5],
            value: this.countNotAnsweredUsers()
        });

        return answers;
    }

    renderAnswers() {
        const {poll} = this.props;

        return poll.answers.map((answer, key) => {
            return (
                <div className={styles.optionContainer} key={key}>
                    <div className={styles.optionColor} style={{backgroundColor: PIE_COLORS[key]}}/>
                    <div className={styles.optionText}>{answer.text}</div>
                    <div className={styles.optionVotes}>{answer.votes}</div>
                </div>
            );
        });
    }
}
