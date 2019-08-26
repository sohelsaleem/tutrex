import InteractiveTool from './InteractiveTool';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';

export default class DrawingTool extends InteractiveTool {
    constructor(props) {
        super(props);

        this.startPoint = null;
        this.commandBuilder = null;
    }

    onMouseDown(event) {
        this.commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: 'create'
        });

        this.startPoint = event.point;

        this.doOnMouseDown(event.point);
        this.sendBeginCommand(event.point);
    }

    doOnMouseDown(point) {
        // can be overriden
    }

    onMouseDrag(event) {
        this.doOnMouseDrag(event.point);
        this.sendProgressCommand(event.point);
    }

    doOnMouseDrag(point) {
        // can be overriden
    }

    onMouseUp(event) {
        this.doOnMouseUp(event.point);
        this.sendCommitCommand (event.point);

        this.startPoint = null;
        this.commandBuilder = null;
    }

    doOnMouseUp(point) {
        // can be overriden
    }

    sendBeginCommand(point) {
        const command = this.commandBuilder.body(this.formCommandBody(point))
            .begin()
            .build();
        this.commandCallback(command);
    }

    formCommandBody(point) {
        const {stroke, fill} = this.props;

        return {
            stroke,
            fill,
            ...this.doFormCommandBody(point)
        };
    }

    doFormCommandBody(point) {
        throw new Error('This method should be overridden');
    }

    sendProgressCommand(point) {
        const command = this.commandBuilder.body(this.formCommandBody(point))
            .progress()
            .build();

        this.commandCallback(command);
    }

    sendCommitCommand (point) {
        const command = this.commandBuilder.body(this.formCommandBody(point))
            .commit()
            .build();

        this.commandCallback(command);
    }
}
