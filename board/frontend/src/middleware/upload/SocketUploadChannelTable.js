class SocketUploadChannelTable {
    constructor() {
        this.table = {};
    }

    put(id, channel) {
        this.table[id] = channel;
    }

    remove(id) {
        delete this.table[id];
    }

    find(id) {
        return this.table[id];
    }
}

module.exports = new SocketUploadChannelTable();
