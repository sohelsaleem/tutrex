import React, {Component, PropTypes} from 'react';
import styles from "./PollModal.scss";
import commonStyles from "../../ComponentsTheme.scss";
import Dialog from "../../common/Dialog";

export default class PollCancelModal extends Component {
    static propTypes = {
        onEndPoll: PropTypes.func.isRequired,
        onCancelEndPoll: PropTypes.func.isRequired
    };

    render()  {
        const {onEndPoll, onCancelEndPoll} = this.props;

        return (
            <Dialog onClose={onCancelEndPoll}
                    title='' visible={true}
                    dialogClassName={styles.endPollModal}
                    closable={false}>
                <div className={styles.endPollTitle}>Are you sure you want to finish the poll?</div>
                <div className={styles.actionContainer}>
                    <button className={commonStyles.buttonRed} onClick={onCancelEndPoll}>
                        No
                    </button>
                    <button className={commonStyles.buttonBlue} onClick={onEndPoll}>
                        Yes
                    </button>
                </div>
            </Dialog>
        );
    }
}