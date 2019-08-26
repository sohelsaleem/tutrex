import AffineTransformation from './AffineTransformation';

export default class ScaleTransformation extends AffineTransformation {

    doFormTransformationMatrix(matrix, endPoint) {
        const angle = this.startMatrix.rotation;

        const prevRadius = this.getRadiusVector(this.startPoint);
        const nextRadius = this.getRadiusVector(endPoint);

        const scaleFactor = Math.max(nextRadius.x / prevRadius.x, nextRadius.y / prevRadius.y);
        matrix.scale(scaleFactor, this.transformCenter);
    }

    getRadiusVector(point) {
        const angle = this.startMatrix.rotation;

        return point.subtract(this.transformCenter)
            .rotate(-angle)
            .abs();
    }
}
