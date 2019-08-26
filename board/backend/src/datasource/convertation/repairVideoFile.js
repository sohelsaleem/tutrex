'use strict';

const spawn = require('child_process').spawn;
const EventEmitter = require('events').EventEmitter;

module.exports = function (inputPath, outputPath) {
    return new RepairVideoFileTask(inputPath, outputPath).run();
};

class RepairVideoFileTask extends EventEmitter {

    constructor(inputPath, outputPath) {
        super();
        this.inputPath = inputPath;
        this.outputPath = outputPath;

        this.process = null;
    }

    run() {
        this._spawnConverterProcess();
        this._listenEvents();

        return this;
    }

    _spawnConverterProcess() {
        this.process = spawn(config.ffmpeg, [
            '-i', this.inputPath,
            '-c:v', 'copy',
            '-c:a', 'copy',
            this.outputPath
        ]);
    }

    _listenEvents() {
        this.process.on('exit', () => {
            this.emit('finish');
            this._dispose();
        });

        this.process.on('error', error => {
            this.emit('error', error);
            this._dispose();
        });
    }

    _dispose() {
        this.process.removeAllListeners();

        this.process = null;

        this.emit('end');
    }

    promise() {
        return new Promise((resolve, reject) => {
            this.once('finish', resolve);
            this.once('error', reject);
            this.once('end', () => this.removeAllListeners());
        });
    }
}
