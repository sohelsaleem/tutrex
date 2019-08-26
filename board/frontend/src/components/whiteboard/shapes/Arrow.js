import AbstractTwoPointShape from './AbstractTwoPointShape';

const INTERNAL_ARROW_ANGLE = Math.PI / 2 * 0.25;

const EXTERNAL_ARROW_ANGLE = Math.PI / 2 * 0.5;

const MAX_INTERNAL_ARROW_SIZE = 37;

const MAX_EXTERNAL_ARROW_SIZE = 45;

const INTERNAL_ARROW_SIZE_SCALE = 0.33;

const EXTERNAL_ARROW_SIZE_SCALE = 0.37;

export default class Arrow extends AbstractTwoPointShape {
    createShape(startPoint, endPoint) {
        const {paper} = this.props;

        this.savePoints(startPoint, endPoint);

        const internalLength = Math.min(MAX_INTERNAL_ARROW_SIZE, this.arrowDistance * INTERNAL_ARROW_SIZE_SCALE);
        const externalLength = Math.min(MAX_EXTERNAL_ARROW_SIZE, this.arrowDistance * EXTERNAL_ARROW_SIZE_SCALE);

        const segments = [
            this.startPoint,
            this.createPointByDirection(-INTERNAL_ARROW_ANGLE / 2, internalLength),
            this.createPointByDirection(-EXTERNAL_ARROW_ANGLE / 2, externalLength),
            this.endPoint,
            this.createPointByDirection(+EXTERNAL_ARROW_ANGLE / 2, externalLength),
            this.createPointByDirection(+INTERNAL_ARROW_ANGLE / 2, internalLength)
        ];

        return new paper.Path({
            segments,
            closed: true
        });
    }
    savePoints(startPoint, endPoint) {
        const {paper} = this.props;
        this.startPoint = new paper.Point(startPoint);
        this.endPoint = new paper.Point(endPoint);

        const direction = this.startPoint.subtract(this.endPoint);

        this.arrowDistance = direction.getDistance(new paper.Point(0, 0));
        this.mainAngle = Math.atan2(direction.y, direction.x);
    }

    createPointByDirection(angle, length) {
        return this.makePolarFromEndPoint(length, this.mainAngle + angle);
    }

    makePolarFromEndPoint(distance, angle) {
        return this.makePolarPoint(distance, angle)
            .add(this.endPoint);
    }

    makePolarPoint(distance, angle) {
        const {paper} = this.props;
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);

        return new paper.Point(x, y);
    }
}


