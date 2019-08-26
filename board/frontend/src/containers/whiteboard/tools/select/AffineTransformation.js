import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';
import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export default class AffineTransformation {

    constructor(startPoint, selectedItem) {
        this.startPoint = startPoint;
        this.startMatrix = selectedItem.matrix.clone();
        this.transformCenter = selectedItem.bounds.center;

        this.commandBuilder = null;
    }

    createCommandBuilder(toolName, itemCommandId) {
        this.commandBuilder = new DrawCommandBuilder({
            tool: toolName,
            kind: 'affine'
        });
        this.commandBuilder.begin()
            .relatedCommandId(itemCommandId)
            .body(this.formBody(this.startMatrix));


        return this.commandBuilder;
    }

    formBody(matrix) {
        return {
            matrix: this.serializeMatrix(matrix),
            startMatrix: this.serializeMatrix(this.startMatrix)
        };
    }

    serializeMatrix(matrix) {
        const matrixValues = matrix.values.slice();
        matrixValues[4] = ScalingUtils.serializeCoordinateX(matrixValues[4]);
        matrixValues[5] = ScalingUtils.serializeCoordinateY(matrixValues[5]);

        return matrixValues;
    }

    updateCommandBuilder(endPoint, {isProgress}) {
        if (isProgress)
            this.commandBuilder.progress();
        else if (this.isIdentityTransformation(endPoint))
            this.commandBuilder.rollback();
        else
            this.commandBuilder.commit();

        const matrix = this.formTransformationMatrix(endPoint);
        return this.commandBuilder.body(this.formBody(matrix));
    }

    formTransformationMatrix(endPoint) {
        const matrix = this.startMatrix.clone().reset();
        this.doFormTransformationMatrix(matrix, endPoint);
        return matrix.append(this.startMatrix.clone());
    }

    doFormTransformationMatrix(matrix, endPoint) {
        throw new Error('method <doFormTransformationMatrix> must be implemented');
    }

    isIdentityTransformation(endPoint) {
        return this.startPoint.equals(endPoint);
    }
}
