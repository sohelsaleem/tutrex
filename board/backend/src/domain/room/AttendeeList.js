'use strict';

const _ = require('lodash');
const AsyncEventEmitter = require('../AsyncEventEmitter');

const Capabilities = require('../../controllers/helpers/Capabilities');

class AttendeeList extends AsyncEventEmitter {
    constructor(maxAttendeeCount) {
        super();
        this.maxAttendeeCount = maxAttendeeCount;

        this.userList = [];
        this.kickedList = [];
        this.allUsers = [];
    }

    addMember(member) {
        if (this.isMemberAlreadyIn(member))
            throw new Error('You have entered the room in another browser tab.');

        if (this.hasKickedWithId(member.id))
            throw new Error('You were dropped from the room.');

        if (this.isExceededLimitOfInviters())
            throw new Error('This classroom is full');

        const wasPreviouslyInLesson = this.wasPreviouslyInLesson(member);
        member.firstLogin = !wasPreviouslyInLesson;
        if (!wasPreviouslyInLesson)
            this.allUsers.push(member);
        this.userList.unshift(member);
        this.emit('added', member);
    }

    isMemberAlreadyIn(newMember) {
        const memberAlreadyIn = this.getMemberById(newMember.id);

        if (!memberAlreadyIn)
            return false;

        const memberRestoring = memberAlreadyIn.tabId === newMember.tabId;

        if (memberRestoring)
            this.removeMemberById(memberAlreadyIn.id);

        return !memberRestoring;
    }

    getMemberById(id) {
        return this.userList.find(m => m.id === id);
    }

    wasPreviouslyInLesson(member) {
        return Boolean(this.allUsers.find(m => m.id === member.id));
    }

    isExceededLimitOfInviters() {
        return this.userList.filter(user => !user.isTeacher).length >= this.maxAttendeeCount;
    }

    removeMemberById(memberId) {
        const member = this.getMemberById(memberId);
        this.userList = this.userList.filter(m => m.id !== memberId);

        if (member)
            this.emit('removed', member);
    }

    getList() {
        return this.userList.slice();
    }

    changeMediaStateForMember(memberId, mediaState) {
        const member = this.getMemberById(memberId);
        if (member) {
            member.mediaState = mediaState;
            this.emit('updated', member);
        }
    }

    changeCapabilitiesForMember(memberId, capabilities) {
        const member = this.getMemberById(memberId);
        if (member) {
            // update new capabilities field
            member.capabilities = Object.assign({}, member.capabilities, capabilities);

            // remove media state, if no video and audio capabilities
            if (!capabilities[Capabilities.CAMERA] && member.mediaState.video) {
                member.mediaState.video = false;
            }
            if (!capabilities[Capabilities.MIC] && member.mediaState.audio) {
                member.mediaState.audio = false;
            }
            this.emit('updated', member);
        }
    }

    addKickedUser(memberId) {
        if (!this.hasKickedWithId(memberId)) {
            this.kickedList.push(memberId);
        }

    }

    hasKickedWithId(memberId) {
        return this.kickedList.some(id => id === memberId);
    }

    changeRaiseHandForMember(memberId, isRaiseHand) {
        const member = this.getMemberById(memberId);

        if (member) {
            member.isRaiseHand = isRaiseHand;
            this.emit('updated', member);
        }
    }
}

module.exports = AttendeeList;
