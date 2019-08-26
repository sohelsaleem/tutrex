'use strict';

const spawn = require('child_process').spawn;
const EventEmitter = require('events').EventEmitter;

module.exports = function (source, destination) {
    return new PdfConvertationTask(source, destination).run();
};

class PdfConvertationTask extends EventEmitter {

    constructor(source, destination) {
        super();
        this.source = source;
        this.destination = destination;

        this.process = null;
        this.stdout = [];
        this.stderr = [];
    }

    run() {
        this._spawnConverterProcess();
        this._listenEvents();

        return this;
    }

    _spawnConverterProcess() {
        this.process = spawn(config.unoconv, [
            '-o', this.destination,
            this.source
        ]);
    }

    _listenEvents() {
        this._listenStreamEvents();
        this._listenProcessEvents();
    }

    _listenStreamEvents() {
        this.process.stdout.on('data', data => {
            this.stdout.push(data);
        });

        this.process.stderr.on('data', data => {
            this.stderr.push(data);
        });
    }

    _listenProcessEvents() {
        this.process.on('exit', () => {
            if (this.stderr.length > 0)
                this.emit('error', this._getStderrError());
            else
                this.emit('finish');

            this._dispose();
        });

        this.process.on('error', error => {
            this.emit('error', error);
            this._dispose();
        });
    }

    _getStderrError() {
        return new Error(Buffer.concat(this.stderr).toString());
    }

    cancel() {
        this.process.kill('SIGKILL');

        return this;
    }

    _dispose() {
        this.process.stdout.removeAllListeners();
        this.process.stderr.removeAllListeners();
        this.process.removeAllListeners();

        this.process = null;
        this.stdout = [];
        this.stderr = [];

        this.emit('end');
    }
}
