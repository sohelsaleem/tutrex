export default class RequestReducerHelper {

    constructor(targetKey, options = {}) {
        this.resultKey = options.resultKey || targetKey;
        this.processingKey = options.processingKey || targetKey + 'Processing';
        this.errorKey = options.errorKey || targetKey + 'Error';
        this.displayedKey = options.displayedKey || targetKey + 'Displayed';
    }

    getNextState(state, action) {
        this.nextState = {...state};
        this.action = action;

        if (this._isShowAction())
            this._formShowState();
        else if (this._isHideAction())
            this._formHideState();
        else if (this._isCleanAction())
            this._formCleanState();
        else if (this._isSuccessAction())
            this._formResultState();
        else if (this._isFailAction())
            this._formErrorState();
        else
            this._formProcessingState();

        return this.nextState;
    }

    _isShowAction() {
        return this._typeStartsWith('SHOW_');
    }

    _typeStartsWith(prefix) {
        const type = this.action.type;
        const subtype = type.split('/').pop();
        return subtype.slice(0, prefix.length) === prefix;
    }

    _formShowState() {
        this.nextState[this.displayedKey] = true;
        delete this.nextState[this.processingKey];
        delete this.nextState[this.errorKey];
    }

    _isHideAction() {
        return this._typeStartsWith('HIDE_');
    }

    _formHideState() {
        delete this.nextState[this.displayedKey];
        delete this.nextState[this.processingKey];
        delete this.nextState[this.errorKey];
    }

    _isCleanAction() {
        return this._typeStartsWith('CLEAN_');
    }

    _formCleanState() {
        delete this.nextState[this.displayedKey];
        delete this.nextState[this.processingKey];
        delete this.nextState[this.resultKey];
        delete this.nextState[this.errorKey];
    }

    _isSuccessAction() {
        return this._typeEndsWith('_SUCCESS');
    }

    _typeEndsWith(suffix) {
        const type = this.action.type;
        return type.slice(-suffix.length) === suffix;
    }

    _formResultState() {
        delete this.nextState[this.displayedKey];
        delete this.nextState[this.processingKey];
        this.nextState[this.resultKey] = this.action.result;
        delete this.nextState[this.errorKey];
    }

    _isFailAction() {
        return this._typeEndsWith('_FAIL');
    }

    _formErrorState() {
        delete this.nextState[this.processingKey];
        delete this.nextState[this.resultKey];
        this.nextState[this.errorKey] = this.action.error;
    }

    _formProcessingState() {
        this.nextState[this.processingKey] = true;
        delete this.nextState[this.resultKey];
        delete this.nextState[this.errorKey];
    }
}
