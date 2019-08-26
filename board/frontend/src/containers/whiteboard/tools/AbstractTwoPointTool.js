import DrawingTool from './DrawingTool';

export default class AbstractTwoPointTool extends DrawingTool {
    doFormCommandBody(point) {
        return {
            startPoint: this.serializePoint(this.startPoint),
            point: this.serializePoint(point)
        };
    }
}
