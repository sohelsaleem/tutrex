import React, {PropTypes} from 'react';
import AbstractLayer from './AbstractLayer';
import {getFullToolList} from '../toolPanel/ToolRegistry';
import {getBoardCommands} from 'helpers/BoardHelper';
import _ from 'lodash';

export default class ShapeLayer extends AbstractLayer {

    static propTypes = {
        commands: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        pageNumber: PropTypes.number,
        pages: PropTypes.object
    };

    drawOnLayer() {

    }

    getLayerName() {
        return 'shape';
    }

    constructor(props) {
        super(props);
        this.initShapes();
    }

    initShapes() {
        const toolList = getFullToolList();

        this.shapes = {};
        toolList.forEach(description => {
            this.shapes[description.name] = description.shape;
        });

        this.updateShapes = {};
        toolList.forEach(description => {
            this.updateShapes[description.name] = description.updateShape;
        });
    }

    render() {
        const {finished, progress} = getBoardCommands(this.props);

        return (
            <div>
                {finished.map(this.renderShape)}
                {progress.map(this.renderShape)}
            </div>
        );
    }

    renderShape = (command, index) => {
        const Shape = this.getShapeFromCommand(command);

        if (!Shape)
            return null;

        const {paper, canvasWidth, canvasHeight} = this.props;
        const key = this.formShapeKey(command);

        return <Shape command={command}
                      paper={paper}
                      canvasWidth={canvasWidth}
                      canvasHeight={canvasHeight}
                      key={key}/>;

    };

    getShapeFromCommand(command) {
        if (command.kind === 'update')
            return this.updateShapes[command.tool];

        return this.shapes[command.tool];
    }

    formShapeKey(command) {
        if (!command.progressId)
            return command.id;

        return command.id + '_' + command.progressId;
    }
}
