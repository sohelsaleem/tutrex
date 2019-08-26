import AbstractTwoPointShape from './AbstractTwoPointShape';

export default class Circle extends AbstractTwoPointShape {
    createShape(startPoint, endPoint) {
        const {paper}= this.props;
        const bounds = new paper.Rectangle(startPoint, endPoint);
        return new paper.Path.Ellipse(bounds);
    }
}
