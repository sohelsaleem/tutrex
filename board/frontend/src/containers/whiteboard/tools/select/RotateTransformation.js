import AffineTransformation from './AffineTransformation';

export default class RotateTransformation extends AffineTransformation {

    doFormTransformationMatrix(matrix, endPoint) {
        const prevAngle = this.startPoint.subtract(this.transformCenter).angle;
        const nextAngle = endPoint.subtract(this.transformCenter).angle;

        const angle = nextAngle - prevAngle;
        matrix.rotate(angle, this.transformCenter);
    }
}
