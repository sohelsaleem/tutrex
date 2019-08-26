'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class Poll extends AsyncEventEmitter {
    constructor() {
        super();
        this.clearData();
    }

    getIsActive() {
        return this.isActive;
    }

    addUserAnswered(userId) {
        this.usersAnswered.push(userId);
    }

    clearData() {
        this.question = '';
        this.answers = [];
        this.isActive = false;
        this.usersAnswered = [];
        this.showResults = true;
        this.userId = null;
    }

    setAnswersFromArray(answers) {
        this.answers = answers.map(answer => {
            return {
                text: answer,
                votes: 0
            };
        });
    }

    toDto() {
        return {
            question: this.question,
            answers: this.answers,
            usersAnswered: this.usersAnswered,
            showResults: this.showResults,
            userId: this.userId
        };
    }

    startPoll(question, answers, userId) {
        this.clearData();
        this.question = question;
        this.setAnswersFromArray(answers);
        this.isActive = true;
        this.userId = userId;
        this.emit('startPoll', this.toDto());
    }

    endPoll() {
        this.clearData();
        this.emit('endPoll');
    }

    votePoll(userId, answerKey) {
        this.addUserAnswered(userId);
        this.answers[answerKey].votes++;
        this.emit('updatePoll', this.toDto());
    }

    toggleShowResults() {
        this.showResults = !this.showResults;
        this.emit('updatePoll', this.toDto());
    }
}

module.exports = Poll;
