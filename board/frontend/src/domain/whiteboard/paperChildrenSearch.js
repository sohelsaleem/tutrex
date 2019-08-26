import ChildrenNearPointSearcher from './ChildrenNearPointSearcher';

export function findItemByCommandId(paper, commandId) {
    const layer = paper.project.activeLayer;
    return layer.children.find(item => item.commandId === commandId);
}

export function findItem(paper) {
    return new ChildrenNearPointSearcher(paper);
}
