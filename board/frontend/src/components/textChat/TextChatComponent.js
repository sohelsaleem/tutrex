import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import TextMessagesList from './TextMessagesList';
import SendMessageButton from './svgTextChat/SendMessageButton';
import UploadFileButton from './svgTextChat/UploadFileButton';
import ChatsListButtonComponent from 'components/textChat/ChatsListButtonComponent';
import UploadFileDialog from './UploadFileDialog/UploadFileDialog';

import playAudio from 'helpers/AudioHelper';
import {MESSAGE_TYPE_TEXT, MESSAGE_TYPE_LINK} from './messageTypes';

const styles = require('./TextChatComponent.scss');

const KEY_ENTER = 13;
const gotNewMessageSound = require('assets/sounds/ding.wav');

export default class TextChatComponent extends Component {
    static propTypes = {
        onSendMessage: PropTypes.func.isRequired,
        chatItemList: PropTypes.array,
        username: PropTypes.string,
        userId: PropTypes.any,
        teacherId: PropTypes.any,
        attendeeList: PropTypes.array,
        onAppear: PropTypes.func.isRequired,
        onFileUpload: PropTypes.func.isRequired,
        onFileUploadFromStorage: PropTypes.func.isRequired,
        uploadInProgress: PropTypes.bool,
        uploadedFileUrl: PropTypes.string,
        uploadedFileName: PropTypes.string,
        uploadProgress: PropTypes.any,
        isUploadFromStorage: PropTypes.bool,
        onCancelUploading: PropTypes.func.isRequired,
        maxUploadSize: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            selectedUserChat: {},
            showUploadDialog: false
        };
    }

    componentDidMount() {
        this.props.onAppear();
    }

    componentWillReceiveProps(props) {
        if (this.isGotNewMessage(props)) {
            playAudio(gotNewMessageSound);
        }
    }

    componentDidUpdate(prevProps) {
        const progressFinished = prevProps.uploadInProgress && !this.props.uploadInProgress;
        const hasURL = Boolean(this.props.uploadedFileUrl);
        if (progressFinished) {
            const {uploadedFileName, uploadedFileUrl} = this.props;
            this.hideUploadFileDialog();
            if (hasURL)
                this.sendMessage(uploadedFileName, MESSAGE_TYPE_LINK, {url: uploadedFileUrl});
        }
    }

    isGotNewMessage(props) {
        return this.props.newMessagesCounter !== props.newMessagesCounter;
    }

    selectTeacherChat(userList, teacherId) {
        if (!userList)
            return;

        const teacher = this.findTeacher(userList, teacherId);

        this.setState({
            selectedUserChat: teacher
        });
    }

    findTeacher(userList, teacherId) {
        const teacher = userList.find(user => user.isTeacher);

        if (!teacher)
            return this.makeFakeTeacher(teacherId);

        return teacher
    }

    makeFakeTeacher(id) {
        return {
            id,
            isTeacher: true
        };
    }

    handleKeyboardDown = event => {
        const {keyCode} = event;

        if (keyCode !== KEY_ENTER)
            return;

        event.preventDefault();

        const {text} = this.state;

        this.sendMessage(text);

        this.setState({
            text: ''
        });

    };

    handleOnClickSendMessageButton() {
        const {text} = this.state;

        this.sendMessage(text);

        this.setState({
            text: ''
        });
    }

    sendMessage(text, type, params) {
        if (text.trim() === '')
            return;

        const chatItem = {
            to: this.getChatIdForUser(this.state.selectedUserChat),
            toName: this.getChatNameForUser(this.state.selectedUserChat),
            name: this.props.username,
            from: this.props.userId,
            text: text,
            type: type || MESSAGE_TYPE_TEXT,
            params: params || {}
        };
        this.props.onSendMessage(chatItem);
    }

    handleTextChange = ({target: {value}}) => {
        this.setState({
            text: value
        });
    };

    handleSelectChat = user => () => {
        this.setState({
            selectedUserChat: user
        });
    };

    renderAttendee = (user, index) => {
        const name = this.getChatNameForUser(user);

        const {selectedUserChat} = this.state;
        const isSelectedUserChat = user === selectedUserChat;
        const selectorClassNames = classNames(styles.expandPanelItem, {
            [styles.selectorActive]: isSelectedUserChat
        });

        return (
            <div key={index}
                 onClick={this.handleSelectChat(user)}
                 className={selectorClassNames}>
                {name}
            </div>
        );
    };

    getChatNameForUser(user) {
        return _.get(user, 'name', 'All');
    }

    getChatIdForUser(user) {
        return _.get(user, 'id', 'all');
    }

    showUploadFileDialog() {
        this.setState({
            showUploadDialog: true
        });
    }

    hideUploadFileDialog() {
        this.setState({
            showUploadDialog: false
        });
    }

    render() {
        const {text, selectedUserChat, showUploadDialog} = this.state;
        const {
            chatItemList,
            attendeeList,
            userId,
            teacherId,
            onFileUpload,
            onFileUploadFromStorage,
            uploadInProgress,
            uploadedFileName,
            uploadProgress,
            isUploadFromStorage,
            onCancelUploading,
            maxUploadSize
        } = this.props;

        const isTeacher = userId === teacherId;
        const isEnabled = Boolean(text);
        const chatListAttendeeList = [
            {},
            ...attendeeList.filter(attendee => attendee.id !== userId)
        ];

        return (
            <div className={styles.textChatContainer}>
                <TextMessagesList messages={chatItemList}
                                  myUserId={userId}
                                  selectedChatId={this.getChatIdForUser(selectedUserChat)}/>
                <div className={styles.chatListButtonContainer}>
                    <ChatsListButtonComponent attendeeList={chatListAttendeeList}
                                              currentUserChat={selectedUserChat}
                                              onRenderAttendee={::this.renderAttendee}/>
                </div>
                <div className={styles.inputContainer}>
                    <input ref="input"
                           value={text}
                           autoComplete="off"
                           placeholder='Type text here...'
                           className={styles.textChatInput}
                           onKeyDown={::this.handleKeyboardDown}
                           onChange={::this.handleTextChange}/>
                    <div className={styles.spacer}/>
                    {isTeacher && <UploadFileButton onButtonClick={::this.showUploadFileDialog}
                                                    isEnabled={!showUploadDialog}
                    />}
                    {showUploadDialog && <UploadFileDialog inProgress={uploadInProgress}
                                                           onUpload={onFileUpload}
                                                           onUploadFromStorage={onFileUploadFromStorage}
                                                           onClose={::this.hideUploadFileDialog}
                                                           fileName={uploadedFileName}
                                                           progress={uploadProgress}
                                                           isFromStorage={isUploadFromStorage}
                                                           onCancelUploading={onCancelUploading}
                                                           maxUploadSize={maxUploadSize}
                    />}
                    <SendMessageButton onClickSendMessageButton={::this.handleOnClickSendMessageButton}
                                       isEnabled={isEnabled}/>
                </div>
            </div>
        );
    }
}
