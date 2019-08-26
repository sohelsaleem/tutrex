'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');
const TextChatHistory = require('../textchat/TextChatHistory');
const VideoChatInfo = require('../videochat/VideoChatInfo');
const WhiteboardHistory = require('../whiteboard/WhiteboardHistory');
const FileHistory = require('../file/FileHistory');
const AttendeeList = require('./AttendeeList');
const LessonRecord = require('../lessonRecord/LessonRecord');
const RoomFileStorage = require('./RoomFileStorage');
const TeacherGoneTimer = require('./TeacherGoneTimer');
const Poll = require('../poll/Poll');

const _ = require('lodash');
const wrap = require('co').wrap;
const moment = require('moment');

const RoomNotifierGateway = require('../../datasource/roomNotifier/RoomNotifierGatewayFactory')();

class Room extends AsyncEventEmitter {
    static fromDto(dto) {
        return new Room(dto.id, dto);
    }

    constructor(id, options) {
        logger.debug(options);

        super();
        this.id = id;
        this.options = options;

        this.dirtyObjects = [];
        this.isLessonFinished = false;
        this.documentsList = [];
        this.isPresentationMode = true;

        this.teacher = null;
        this.members = [];

        this.attendeeList = this._watch(new AttendeeList(this.options.maxAttendeeCount));
        this.lessonRecord = this._watch(new LessonRecord());
        this.textChatHistory = this._watch(new TextChatHistory());
        this.whiteboardHistory = this._watch(new WhiteboardHistory());
        this.fileHistory = this._watch(new FileHistory());
        this.videoChatInfo = this._watch(new VideoChatInfo());
        this.roomFileStorage = this._watch(new RoomFileStorage(this.id));
        this.teacherGoneTimer = this._watch(new TeacherGoneTimer(this.options.teacherGoneTimeout));
        this.poll = this._watch(new Poll());
        this.isPaused = false;
        this.totalPauseTime = 0;
        this.lastPauseTimestamp = 0;

        this._listenEvents();
    }

    _watch(object) {
        this.dirtyObjects.push(object);
        return object;
    }

    _listenEvents() {
        this.attendeeList
            .on('removed', user => this._clearRemovingUserResource(user))
            .on('removed', user => this._startTimerToRemoveRoomAfterTeacherGone(user))
            .on('added', user => this._stopTimerToRemoveRoomAfterTeacherGone(user));

        this.teacherGoneTimer.on('teacher-gone-timer', () => this.simpleFinishLesson())
    }

    _clearRemovingUserResource(user) {
        this.videoChatInfo.removeByCallerId(user.id);
        this.fileHistory.removeVideo(user);
    }

    _startTimerToRemoveRoomAfterTeacherGone(user) {
        if (!user.isTeacher)
            return;

        this.teacherGoneTimer.start();
    }

    _stopTimerToRemoveRoomAfterTeacherGone(user) {
        if (!user.isTeacher)
            return;

        this.teacherGoneTimer.stop();
    }

    simpleFinishLesson() {
        const sharedDocumentsInLesson = {
            documentsList: [],
            roomId: this.id
        };

        wrap(this.finishLesson.bind(this, sharedDocumentsInLesson, this.teacher))()
            .catch(e => logger.error(e.stack || e));
    }

    _dispose() {
        this.dirtyObjects.forEach(dirtyObject => {
            if (dirtyObject.dispose)
                dirtyObject.dispose();
            if (dirtyObject.removeAllListeners)
                dirtyObject.removeAllListeners();
        });
    }

    addUser(user) {
        if (this.checkIsLessonFinished())
            throw new Error('Lesson is finished');

        if (user.isTeacher)
            this.teacher = user;

        this.attendeeList.addMember(user);
    }

    removeUser(user) {
        this.attendeeList.removeMemberById(user.id);
    }

    getUser(id) {
        return this.attendeeList.getMemberById(id);
    }

    toDto() {
        return _.assign({}, this.options, {
            id: this.id,
            teacherId: _.get(this.teacher, 'id', 0),
            isPaused: this.isPaused,
            totalPauseTime: this.totalPauseTime,
            lastPauseTimestamp: this.lastPauseTimestamp
        });
    }

    addDocumentUrlAndName(documentUrl, documentName) {
        this.documentsList.push({
            documentUrl,
            documentName
        });
    }

    * finishLesson(sharedDocumentsInLesson, user) {
        yield RoomNotifierGateway.tryFinishLesson(sharedDocumentsInLesson);

        this.isLessonFinished = true;
        this.isPaused = false;
        this.emit('finishedLesson', user);
    }

    toggleBetweenWebinarOrPresentationMode(user) {
        this.isPresentationMode = !this.isPresentationMode;
        this.emit('toggledBetweenWebinarOrPresentationMode', user);
    }

    checkIsPresentationMode() {
        return this.isPresentationMode;
    }

    checkIsTeacherInRoom() {
        return this.attendeeList.userList.some(member => {
            return member.isTeacher;
        });
    }

    checkIsLessonFinished() {
        return this.isLessonFinished;
    }

    getMemberList() {
        return this.members.slice();
    }

    getTextChatHistory() {
        return this.textChatHistory;
    }

    getWhiteboardHistory() {
        return this.whiteboardHistory;
    }

    getAttendeeList() {
        return this.attendeeList;
    }

    getVideoChatInfo() {
        return this.videoChatInfo;
    }

    getFileHistory() {
        return this.fileHistory;
    }

    getLessonRecord() {
        return this.lessonRecord;
    }

    getDocumentsList() {
        return this.documentsList;
    }

    getPoll() {
        return this.poll;
    }

    pauseLesson(user) {
        if (this.isPaused) {
            return;
        }

        this.isPaused = true;
        this.lastPauseTimestamp = moment().utc().unix();
        this.emit('pausedLesson', user);
    }

    addTime(user, duration) {
        this.isPaused = false;
        this.totalPauseTime = moment().utc().unix() - this.lastPauseTimestamp;
        this.options.approxDuration += duration;
        this.emit('addedTime', user);
    }
}

module.exports = Room;
