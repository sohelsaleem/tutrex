import _ from 'lodash';

const CACHE_PAGE_SIZE = 3;

export default class DocumentCache {

    constructor() {
        this.documentQueue = [];
        this.pageQueue = [];
    }

    putDocument(documentURL, documentTask) {
        this.documentQueue.push({
            documentURL,
            documentTask
        });
    }

    putPage(documentURL, pageNumber, pageTask) {
        this.pageQueue.push({
            documentURL,
            pageNumber,
            pageTask
        });

        this.removeDirtyPageItems();
    }

    removeDirtyPageItems() {
        const dirtyPageItems = this.pageQueue.slice(0, -CACHE_PAGE_SIZE);
        this.pageQueue = this.pageQueue.slice(-CACHE_PAGE_SIZE);

        dirtyPageItems.forEach(pageItem => this.disposePageCacheItem(pageItem));

        this.removeDirtyDocumentItems()
    }

    disposePageCacheItem({pageTask}) {
        pageTask.then(page => page.cleanup());
    }

    removeDirtyDocumentItems() {
        const dirtyDocumentItems = this.documentQueue.filter(({documentURL}) => {
            return this.pageQueue.every(p => p.documentURL !== documentURL);
        });

        this.documentQueue = _.difference(this.documentQueue, dirtyDocumentItems);

        dirtyDocumentItems.forEach(documentItem => this.disposeDocumentCacheItem(documentItem));
    }

    disposeDocumentCacheItem({documentTask}) {
        documentTask.destroy();
    }

    getDocument(documentURL) {
        const documentItem = this.documentQueue.find(i => i.documentURL === documentURL);
        return documentItem && documentItem.documentTask;
    }

    hasDocument(documentURL) {
        return Boolean(this.getDocument(documentURL));
    }

    getPage(documentURL, pageNumber) {
        const pageItem = this.pageQueue.find(i => i.documentURL === documentURL && i.pageNumber === pageNumber);
        return pageItem && pageItem.pageTask;
    }

    hasPage(documentURL, pageNumber) {
        return Boolean(this.getPage(documentURL, pageNumber));
    }
}
