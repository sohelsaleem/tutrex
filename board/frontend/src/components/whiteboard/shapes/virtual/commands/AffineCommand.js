import Command from './Command';
import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export default class AffineCommand extends Command {

    constructor(paper, matrixValues, startMatrixValues) {
        super();
        this.paper = paper;

        this.matrixValues = matrixValues;
        this.startMatrixValues = startMatrixValues;
    }

    deserializeMatrix(matrixValues) {
        const values = matrixValues.slice();
        values[4] = ScalingUtils.deserializeCoordinateX(values[4]);
        values[5] = ScalingUtils.deserializeCoordinateY(values[5]);

        return new this.paper.Matrix(...values);
    }

    execute(item) {
        item.matrix = this.deserializeMatrix(this.matrixValues);
    }

    undo(item) {
        item.matrix = this.deserializeMatrix(this.startMatrixValues);
    }
}
