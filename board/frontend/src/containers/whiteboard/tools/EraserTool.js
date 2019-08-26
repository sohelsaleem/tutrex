import InteractiveTool from './InteractiveTool';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';
import {findItem} from  'domain/whiteboard/paperChildrenSearch';

export default class EraserTool extends InteractiveTool {
    constructor(props) {
        super(props);
    }

    getToolName() {
        return 'eraser';
    }

    onMouseDown(event) {
        this.removeItemBelow(event.point);
    }

    removeItemBelow(point) {
        const dirtyItem = findItem(this.paper)
            .nearPoint(point)
            .withTolerance(10)
            .getLast();

        if (!dirtyItem)
            return;

        this.sendRemoveCommand(dirtyItem);
    }

    sendRemoveCommand(item) {
        this.commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: 'remove'
        });

        const command = this.commandBuilder.relatedCommandId(item.commandId)
            .build();

        this.commandCallback(command);
    }

    onMouseDrag(event) {
        this.removeItemBelow(event.point);
    }
}
