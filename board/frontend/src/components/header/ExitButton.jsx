import React, {Component, PropTypes} from 'react';
import styles from './ExitButton.scss';

export default class ExitButton extends Component {
    static propTypes = {
        user: PropTypes.object,
        onChangeDialogNameWhenFinishLesson: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className={styles.exitButtonContainer}>
                <div className={styles.exitButton}
                     onClick={::this.handleToggleDialog}></div>
            </div>
        );
    }

    handleToggleDialog() {
        const {user} = this.props;

        const finishDialogByTeacher = user.isTeacher;
        const nameOfDialog = finishDialogByTeacher ? 'finishDialog' : 'disconnectDialog';

        this.props.onChangeDialogNameWhenFinishLesson(nameOfDialog);
    }
}
