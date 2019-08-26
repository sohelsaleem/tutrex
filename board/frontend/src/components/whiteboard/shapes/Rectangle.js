import AbstractTwoPointShape from './AbstractTwoPointShape';

export default class Rectangle extends AbstractTwoPointShape {
    createShape(startPoint, endPoint) {
        const {paper}= this.props;
        const bounds = new paper.Rectangle(startPoint, endPoint);
        return new paper.Path.Rectangle(bounds);
    }
}

