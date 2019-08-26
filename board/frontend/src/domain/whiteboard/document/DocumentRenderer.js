const PDFJS = require('pdfjs-dist');
PDFJS.PDFJS.workerSrc = require('file!pdfjs-dist/build/pdf.worker.js');

import {EventEmitter} from 'events';
import DocumentCache from './DocumentCache';

const documentCache = new DocumentCache();

export function requestPage(documentURL, pageNumber, width) {
    const result = new EventEmitter();

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    let viewport;

    const {documentTask, pageTask} = getDocumentPage(documentURL, pageNumber);

    documentTask.then(document => result.emit('pageCount', document.numPages));

    pageTask
        .then(page => {
            viewport = page.getViewport(1);
            viewport = page.getViewport(width / viewport.width);

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            return page.render({canvasContext, viewport});
        })
        .then(() => {
            result.emit('render', canvas.toDataURL('image/png'), viewport);
        })
        .catch(() => {
            result.emit('error');
        });

    return result;
}

function getDocumentPage(documentURL, pageNumber) {
    if (!documentCache.hasDocument(documentURL)) {
        const documentTask = PDFJS.getDocument(documentURL);
        documentCache.putDocument(documentURL, documentTask);
    }

    if (!documentCache.hasPage(documentURL, pageNumber)) {
        const documentTask = documentCache.getDocument(documentURL);
        const pageTask = documentTask.then(document => document.getPage(pageNumber));
        documentCache.putPage(documentURL, pageNumber, pageTask);
    }

    return {
        documentTask: documentCache.getDocument(documentURL),
        pageTask: documentCache.getPage(documentURL, pageNumber)
    };
}
