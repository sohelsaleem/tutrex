import AffineTransformation from './AffineTransformation';

export default class TranslateTransformation extends AffineTransformation {

    doFormTransformationMatrix(matrix, endPoint) {
        const offset = endPoint.subtract(this.startPoint);
        matrix.translate(offset);
    }
}
