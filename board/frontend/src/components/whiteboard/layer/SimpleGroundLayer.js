import AbstractGroundLayer from './AbstractGroundLayer';

export default class SimpleGroundLayer extends AbstractGroundLayer {

    drawOnLayer() {
        const {width, height} = this.paper.view.viewSize;

        const background = new this.paper.Path.Rectangle([-width / 2, -height / 2, width / 2, height / 2]);
        background.fillColor = 'white';
        background.strokeColor = 'white';
    }
}
