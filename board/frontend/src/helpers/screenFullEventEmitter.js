import screenfull from 'screenfull';
import {EventEmitter} from 'events';

class ScreenFullEventEmitter extends EventEmitter {
    constructor() {
        super();
        screenfull.onchange(this.handleChange)
    }

    handleChange = () => {
        this.emit('change', screenfull.isFullscreen);
    };
}

export default new ScreenFullEventEmitter();
