import React, {Component, PropTypes} from 'react';
import Dialog from 'components/common/Dialog';
import styles from './AddTimeDialog.scss';
import commonStyles from 'components/ComponentsTheme.scss';
import confirmDialogStyles from 'components/common/ConfirmDialog.scss';
import ClickedSelect from 'components/common/ClickedSelect';

const ADD_TIME_RANGE_DURATION = [5, 10, 15];

export default class AddTimeDialog extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        onFinish: PropTypes.func.isRequired,
        allowedTime: PropTypes.number
    };

    state = {
        duration: 300
    };

    handleAddTime() {
        const {onAdd} = this.props;
        const {duration} = this.state;
        onAdd(duration);
    }

    handleChangeSelect(value) {
        this.setState({duration: value * 60});
    }

    render() {
        const {onFinish, allowedTime} = this.props;
        return (
            <Dialog closable={false} title='Add time or finish lesson'>
                <div className={styles.informationText}>Would you like to add more minutes?</div>
                <ClickedSelect onChange={::this.handleChangeSelect}
                               range={ADD_TIME_RANGE_DURATION.filter(time => time * 60 <= allowedTime)}
                               className={styles.select} defaultIndex={0}/>
                <div className={confirmDialogStyles.buttons}>
                    <button className={commonStyles.buttonRed} onClick={onFinish}>
                        Finish lesson
                    </button>
                    <button className={commonStyles.buttonBlue} onClick={::this.handleAddTime}>
                        Add time
                    </button>
                </div>
            </Dialog>
        );
    }
}
