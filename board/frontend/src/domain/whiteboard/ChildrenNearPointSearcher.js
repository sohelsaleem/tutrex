import _ from 'lodash';

export default class ChildrenNearPointSearcher {
    constructor(paper) {
        this.layer = paper.project.activeLayer;

        this.point = null;
        this.tolerance = 2;
        this.filterPredicate = _.stubTrue;

        this.baseHitOptions = {
            segments: true,
            stroke: true,
            fill: true
        };
    }

    nearPoint(point) {
        this.point = point;
        return this;
    }

    withTolerance(tolerance) {
        this.tolerance = tolerance;
        return this;
    }

    except(...notInterestedItems) {
        return this.filter(item => !notInterestedItems.includes(item));
    }

    filter(predicate) {
        const prevPredicate = this.filterPredicate;
        this.filterPredicate = item => prevPredicate(item) && predicate(item);
        return this;
    }

    getLast() {
        return this.search()
            .shift();
    }

    search() {
        return this.layer.hitTestAll(this.point, this.getHitOptions())
            .map(r => r.item)
            .filter(this.filterPredicate);
    }

    getHitOptions() {
        return {
            ...this.baseHitOptions,
            tolerance: this.tolerance
        };
    }
}
