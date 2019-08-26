import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import InformationDialog from 'components/common/InformationDialog';
import FilesShareDialog from 'components/filesShareDialog/FilesShareDialog';
import ConfirmDialog from 'components/common/ConfirmDialog';

import {
    getDocumentsList,
    finishLesson,
    addTime
} from 'actions/room';

import {
    changeDialogNameWhenFinishLesson
} from 'actions/displayStates';
import AddTimeDialog from "../../components/dialogs/AddTimeDialog";

class LessonFinishContainer extends Component {
    static propTypes = {
        finishLessonError: PropTypes.bool,
        onChangeDialogNameWhenFinishLesson: PropTypes.func.isRequired,
        onGetDocumentsList: PropTypes.func.isRequired,
        gettingDocumentsList: PropTypes.bool,
        documentsList: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            showNeedFinishDialog: false,
            showNeedAddTimeDialog: false,
            showNeedDisconnectDialog: false,
            showNeedDialogThatTeacherFinishedLesson: false,
            showNeedFilesShareDialog: false,
            showNeedToTeacherDialogThatMeetingTimeIsOver: false,
            showNeedToTeacherDialogThatFailDuringDocumentsSharing: false,
            gotDocumentsList: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const {
            onChangeDialogNameWhenFinishLesson
        } = this.props;

        if (this.isToggledOneOfDialogs(nextProps)) {
            this.toggleNeedfullDialog(nextProps.dialogNameWhenFinishLesson);
            onChangeDialogNameWhenFinishLesson(null);
        }

        if (this.isGettingDocumentsList(nextProps)) {
            this.setState({
                gotDocumentsList: false
            });
        }

        if (this.isGotDocumentsList(nextProps)) {
            this.setState({
                gotDocumentsList: true
            });
        }

        if (this.isLessonFinished(nextProps)) {
            this.closeLesson(nextProps)
        }

        if (this.isGotFinishLessonError(nextProps)) {
            this.toggleShowNeedToTeacherDialogThatFailDuringFinishLesson();
        }
    }

    toggleNeedfullDialog(nameOfDialog) {
        switch (nameOfDialog) {
            case 'finishDialog':
                this.restartDocumentsList();
                this.toggleFinishDialog();
                break;
            case 'disconnectDialog':
                this.toggleDisconnectDialog();
                break;
            case 'filesShareDialog':
                this.toggleFilesShareDialog();
                break;
            case 'dialogThatMeetingTimeIsOver':
                this.restartDocumentsList();
                this.toggleShowDialogThatMeetingTimeIsOver();
                break;
            case 'dialogAddTime':
                this.toggleShowAddTimeDialog();
                break;
        }
    }

    restartDocumentsList() {
        this.setState({
            gotDocumentsList: false
        });
        this.props.onGetDocumentsList();
    }

    isToggledOneOfDialogs(nextProps) {
        return !this.props.dialogNameWhenFinishLesson && nextProps.dialogNameWhenFinishLesson;
    }

    isGotFinishLessonError(nextProps) {
        return !this.props.finishLessonError && nextProps.finishLessonError;
    }

    isGettingDocumentsList(nextProps) {
        return nextProps.gettingDocumentsList;
    }

    isGotDocumentsList(nextProps) {
        return this.props.gettingDocumentsList && !nextProps.gettingDocumentsList && nextProps.documentsList;
    }

    closeLesson(nextProps) {
        const isTeacher = nextProps.user.isTeacher;
        if (isTeacher) {
            window.top.location.href = nextProps.user.exitLink;
        } else {
            this.toggleDialogThatTeacherFinishedLesson()
        }
    }

    isLessonFinished(nextProps) {
        return nextProps.isLessonFinished;
    }

    toggleDialogThatTeacherFinishedLesson() {
        this.setState({
            showNeedDialogThatTeacherFinishedLesson: !this.state.showNeedDialogThatTeacherFinishedLesson
        });
    }

    handleCloseDialogThatTeacherFinishedLesson() {
        this.toggleDialogThatTeacherFinishedLesson();
        this.redirectToExitLink();
    }

    redirectToExitLink() {
        window.top.location.href = this.props.user.exitLink;
    }

    handleFilesShareDialogCloseWithShare() {
        this.toggleFilesShareDialog();
    };

    handleFilesShareDialogCloseWithoutShare() {
        this.toggleFilesShareDialog();
        this.props.onFinishLesson([]);
    }

    toggleFilesShareDialog() {
        this.setState({
            showNeedFilesShareDialog: !this.state.showNeedFilesShareDialog
        });
    }

    toggleShowDialogThatMeetingTimeIsOver() {
        this.setState({
            showNeedToTeacherDialogThatMeetingTimeIsOver: !this.state.showNeedToTeacherDialogThatMeetingTimeIsOver
        });
    }

    toggleFinishDialog() {
        this.setState({
            showNeedFinishDialog: !this.state.showNeedFinishDialog
        });
    }

    toggleDisconnectDialog() {
        this.setState({
            showNeedDisconnectDialog: !this.state.showNeedDisconnectDialog
        });
    }

    toggleShowAddTimeDialog() {
        this.setState({
            showNeedAddTimeDialog: !this.state.showNeedAddTimeDialog
        });
    }

    handleDialogThatMeetingTimeIsOverClose() {
        this.toggleShowDialogThatMeetingTimeIsOver();
        this.showFilesShareDialogOrExit();
    }

    toggleShowNeedToTeacherDialogThatFailDuringFinishLesson() {
        this.setState({
            showNeedToTeacherDialogThatFailDuringDocumentsSharing: !this.state.showNeedToTeacherDialogThatFailDuringDocumentsSharing
        });
    }

    handleCloseFinishDialogAndShowFilesShareDialogOrExit() {
        this.toggleFinishDialog();
        this.showFilesShareDialogOrExit();
    }

    showFilesShareDialogOrExit() {
        const {documentsList} = this.props;

        if (documentsList && documentsList.length > 0) {
            this.props.onChangeDialogNameWhenFinishLesson('filesShareDialog');
        } else {
            this.props.onFinishLesson([]);
        }
    }

    handleExitMeeting() {
        window.top.location.href = this.props.user.exitLink;
    }

    handleFinishLessonWithoutAddingTime() {
        this.toggleShowAddTimeDialog();
        this.showFilesShareDialogOrExit();
    }

    handleAddingTime(duration) {
        this.toggleShowAddTimeDialog();
        const {onAddTime} = this.props;
        onAddTime(duration);
    }

    render() {
        const {
            showNeedFinishDialog,
            showNeedDisconnectDialog,
            showNeedDialogThatTeacherFinishedLesson,
            showNeedFilesShareDialog,
            showNeedToTeacherDialogThatMeetingTimeIsOver,
            showNeedToTeacherDialogThatFailDuringDocumentsSharing,
            showNeedAddTimeDialog,
            gotDocumentsList
        } = this.state;

        const {
            onGetDocumentsList,
            onFinishLesson,
            documentsList,
            gettingDocumentsList,
            room
        } = this.props;

        return (
            <div>
                {showNeedFinishDialog && <ConfirmDialog title='Finish meeting'
                                                        text='Are you sure you want to finish meeting? All attendees will be dropped out of the Room.'
                                                        yesText='Finish'
                                                        noText='Cancel'
                                                        enabledConfirm={gotDocumentsList}
                                                        onConfirm={::this.handleCloseFinishDialogAndShowFilesShareDialogOrExit}
                                                        onClose={::this.toggleFinishDialog}/>}

                {showNeedDisconnectDialog && <ConfirmDialog title='Disconnect from Meeting'
                                                            text='Are you sure you want to disconnect from meeting?'
                                                            yesText='Disconnect'
                                                            noText='Cancel'
                                                            onConfirm={::this.handleExitMeeting}
                                                            onClose={::this.toggleDisconnectDialog}/>}

                {showNeedDialogThatTeacherFinishedLesson &&
                <InformationDialog onClose={::this.handleCloseDialogThatTeacherFinishedLesson}
                                   text='Teacher has finished the lesson'
                                   okText="Close lesson"/>}

                {showNeedFilesShareDialog && <FilesShareDialog onConfirm={::this.handleFilesShareDialogCloseWithShare}
                                                               onClose={::this.handleFilesShareDialogCloseWithoutShare}
                                                               onGetDocumentsList={onGetDocumentsList}
                                                               onFinishLesson={onFinishLesson}
                                                               documentsList={documentsList}
                                                               gettingDocumentsList={gettingDocumentsList}/>}

                {showNeedToTeacherDialogThatMeetingTimeIsOver &&
                <InformationDialog onClose={::this.handleDialogThatMeetingTimeIsOverClose}
                                   title='Meeting time is over'
                                   text='You may purchase Advanced Subscription to have unlimited meetings and "Record meeting" feature'
                                   okText="Finish"/>}
                {showNeedToTeacherDialogThatFailDuringDocumentsSharing &&
                <InformationDialog onClose={::this.toggleShowNeedToTeacherDialogThatFailDuringFinishLesson}
                                   title="Lesson was not finished"
                                   text='Try again later'
                                   okText="Ok"/>}

                {
                    showNeedAddTimeDialog &&
                    <AddTimeDialog onAdd={::this.handleAddingTime}
                                   onFinish={::this.handleFinishLessonWithoutAddingTime}
                                   allowedTime={room.maxDuration - room.approxDuration}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {user, room} = state.room.authInfo;

    return {
        user,
        room,
        isLessonFinished: state.room.isLessonFinished,
        documentsList: state.room.documentsList,
        gettingDocumentsList: state.room.gettingDocumentsList,
        finishLessonError: state.room.finishLessonError,
        dialogNameWhenFinishLesson: state.displayStates.dialogNameWhenFinishLesson
    };
};

const mapDispatchToProps = {
    onGetDocumentsList: getDocumentsList,
    onFinishLesson: finishLesson,
    onChangeDialogNameWhenFinishLesson: changeDialogNameWhenFinishLesson,
    onAddTime: addTime
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonFinishContainer);
