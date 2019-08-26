import CommonUtils from 'helpers/CommonUtils';

class PolygonFactory {
    inscribeToRectangle(paper, startPoint, endPoint, degree) {
        const x1 = startPoint.x;
        const x2 = endPoint.x;
        const y1 = startPoint.y;
        const y2 = endPoint.y;
        const k = (y1 < y2) ? 1 : -1;

        const rectWidth = Math.abs(x1 - x2);
        const xRadius = rectWidth / (2 * Math.sin(2 * Math.PI / degree * Math.round(degree / 4)));
        const rectHeight = Math.abs(y1 - y2);
        const yRadius = rectHeight / (1 + Math.abs(Math.cos(2 * Math.PI / degree * Math.round(degree / 2))));

        const centerX = (x1 + x2) / 2;
        const centerY = Math.min(y1, y2) + (k < 0 && degree % 2 === 1 ? ((degree - 2) * yRadius / (degree - 1)) : yRadius);

        const alpha = 2 * Math.PI / degree;
        const startAngle = -Math.PI / 2;

        const points = CommonUtils.range(degree)
            .map(index => {
                const x = centerX + k * xRadius * Math.cos(index * alpha + startAngle);
                const y = centerY + k * yRadius * Math.sin(index * alpha + startAngle);

                return new paper.Point(x, y);
            });

        const path = new paper.Path(points);
        path.closed = true;
        return path;
    }
}

export default new PolygonFactory();
