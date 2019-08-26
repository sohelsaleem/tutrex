import AbstractTwoPointShape from './AbstractTwoPointShape';
import PolygonFactory from './PolygonFactory';

export default class Triangle extends AbstractTwoPointShape {
    createShape(startPoint, endPoint) {
        const {paper}= this.props;
        return PolygonFactory.inscribeToRectangle(paper, startPoint, endPoint, 3);
    }
}


