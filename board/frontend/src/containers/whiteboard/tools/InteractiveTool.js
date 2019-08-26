import AbstractTool from './AbstractTool';
import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export default class InteractiveTool extends AbstractTool {
    activate() {
        this.tool = new this.paper.Tool();
        this.tool.onMouseDown = ::this.onMouseDown;
        this.tool.onMouseUp = ::this.onMouseUp;
        this.tool.onMouseDrag = ::this.onMouseDrag;
        this.tool.onMouseMove = ::this.onMouseMove;
        this.tool.onKeyDown = ::this.onKeyDown;

        this.tool.minDistance = this.minDistance || 1;
        this.tool.maxDistance = this.maxDistance || 2000;
    }

    onMouseDown(event) {

    }

    onMouseDrag(event) {

    }

    onMouseUp(event) {

    }

    onMouseMove(event) {

    }

    onKeyDown(event) {

    }

    serializePoint(point) {
        return ScalingUtils.serializePoint(this.pointToDTO(point));
    }

    pointToDTO(point) {
        return {
            x: point.x,
            y: point.y
        };
    }

    deactivate() {
        this.onDeactivate();
        return this.tool && this.tool.remove();
    }

    onDeactivate() {

    }
}
