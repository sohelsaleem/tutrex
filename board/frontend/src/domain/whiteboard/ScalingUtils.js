class ScalingUtils {
    // scaling common functions
    getCanvas() {
        return document.getElementById('canvas');
    }

    serializePoint(point) {
        const serializedPoint = {};
        serializedPoint.x = this.serializeCoordinateX(point.x);
        serializedPoint.y = this.serializeCoordinateY(point.y);
        return serializedPoint;
    }

    serializeCoordinateX(x) {
        return x / this.getCanvas().scrollWidth;
    }

    serializeCoordinateY(y) {
        return y / this.getCanvas().scrollHeight;
    }

    deserializePoint(point) {
        const normalPoint = {};
        normalPoint.x = point.x * this.getCanvas().scrollWidth;
        normalPoint.y = point.y * this.getCanvas().scrollHeight;
        return normalPoint;
    }

    deserializeCoordinateX(x) {
        return x * this.getCanvas().scrollWidth;
    }

    deserializeCoordinateY(y) {
        return y * this.getCanvas().scrollHeight;
    }

}

export default new ScalingUtils();
