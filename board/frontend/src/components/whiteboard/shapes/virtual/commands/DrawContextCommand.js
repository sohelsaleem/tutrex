import Command from './Command';
import {createToolByName} from '../../../toolPanel/ToolRegistry';

export default class DrawContextCommand extends Command {

    constructor(stroke, fill) {
        super();
        this.stroke = stroke;
        this.fill = fill;

        this.originalStroke = null;
        this.originalFill = null;
    }

    execute(item) {
        this.saveOriginalDrawContext(item);

        const {stroke, fill} = this;

        createToolByName(item.tool)
            .setDrawContext(item, {stroke, fill});
    }

    saveOriginalDrawContext(item) {
        this.originalStroke = {
            color: item.strokeColor,
            width: item.strokeWidth
        };
        this.originalFill = {
            color: item.fillColor
        };
    }

    undo(item) {
        const stroke = this.originalStroke;
        const fill = this.originalFill;

        createToolByName(item.tool)
            .setDrawContext(item, {stroke, fill});
    }
}
