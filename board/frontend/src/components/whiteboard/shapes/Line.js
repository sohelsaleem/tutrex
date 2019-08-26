import AbstractTwoPointShape from './AbstractTwoPointShape';

export default class Line extends AbstractTwoPointShape {
    createShape(startPoint, endPoint) {
        const {paper} = this.props;

        return new paper.Path({
            segments: [
                startPoint,
                endPoint
            ],
            closed: true
        });
    }
}


