import uuid from 'node-uuid';

export default class DrawCommandBuilder {

    constructor({tool, kind}) {
        this.header = {
            id: uuid.v4(),
            partNumber: 0,
            tool,
            kind
        };
        this._transactionState = 'commit';
        this.keyProgress = false;
        this._body = {};
        this.itemCommandId = null;
    }

    begin() {
        this._transactionState = 'begin';

        return this;
    }

    progress() {
        this.header.progressId = uuid.v4();
        this._transactionState = 'progress';

        return this;
    }

    rollback() {
        this._transactionState = 'rollback';

        return this;
    }

    commit() {
        this._transactionState = 'commit';

        return this;
    }

    increasePartNumber() {
        this.header.partNumber++;
        this.keyProgress = false;

        return this;
    }

    markKeyProgress() {
        this.keyProgress = true;

        return this;
    }

    body(body) {
        this._body = body;

        return this;
    }

    relatedCommandId(itemCommandId) {
        this.itemCommandId = itemCommandId;

        return this;
    }

    build() {
        return {
            ...this.header,
            type: 'draw',
            transactionState: this._transactionState,
            keyProgress: this.keyProgress,
            body: {
                ...this._body,
                itemCommandId: this.itemCommandId
            }
        };
    }
}
