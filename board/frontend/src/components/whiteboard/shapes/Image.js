import AbstractShape from './AbstractShape';

export default class Image extends AbstractShape {
    draw() {
        const {paper, command} = this.props;
        const {body: {imageURL}} = command;

        const raster = new paper.Raster({
            crossOrigin: 'anonymous',
            source: imageURL
        });
        this.saveMainItem(raster);
    }
}
