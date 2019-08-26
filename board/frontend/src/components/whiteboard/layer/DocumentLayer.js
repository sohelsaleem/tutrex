import React from 'react';
import AbstractGroundLayer from './AbstractGroundLayer';

import styles from './DocumentLayer.scss';
import CircularProgress from 'components/common/progress/CircularProgress';
import DocumentControlPanelContainer from 'containers/whiteboard/document/DocumentControlPanelContainer';
import ErrorDialog from 'components/common/ErrorDialog';

import {requestPage} from 'domain/whiteboard/document/DocumentRenderer';

export default class DocumentLayer extends AbstractGroundLayer {

    state = {
        pageCount: 0,
        displayDocumentFailError: false
    };

    constructor(props) {
        super(props);
        this.pageRequest = null;
    }

    componentDidUpdate(nextProps) {
        if (nextProps.pageNumber !== this.props.pageNumber) {
            this.drawOnLayer();
        }
    }

    drawOnLayer() {
        const {documentURL, pageNumber, id: boardId} = this.props;

        this.pageRequest = requestPage(documentURL, pageNumber, this.paper.view.viewSize.width)
            .once('render', this.handleDocumentRendered)
            .once('pageCount', this.savePageCount)
            .once('error', this.handleDocumentFail);

        this.props.onRenderingChange(boardId, 'process');
    }

    handleDocumentRendered = (image, size) => {
        this.drawDocument(image, size);

        const {id: boardId} = this.props;
        this.props.onRenderingChange(boardId, 'success');
    };

    handleDocumentFail = () => {
        this.setState({
            displayDocumentFailError: true
        })
    };

    drawDocument(image, size) {
        const currentLayer = this.paper.project.activeLayer;
        this.layer.activate();
        this.layer.removeChildren();

        this.doDrawDocument(image, size);

        currentLayer.activate();
    }

    doDrawDocument(image, size) {
        const {width, height} = size;

        const border = new this.paper.Path.Rectangle([-width / 2, -height / 2], [width, height]);
        border.strokeWidth = 3;
        border.strokeColor = 'black';

        new this.paper.Raster({
            source: image,
            position: [0, 0]
        });
    }

    savePageCount = pageCount => {
        this.setState({pageCount});
    };

    onDispose() {
        if (this.pageRequest) {
            this.pageRequest.removeAllListeners();
            this.pageRequest = null;
        }
    }

    render() {
        const {rendering} = this.props;
        const {pageCount, displayDocumentFailError} = this.state;

        const renderingInProcess = rendering === 'process';

        return (
            <div>
                <DocumentControlPanelContainer pageCount={pageCount}/>

                {displayDocumentFailError && <ErrorDialog errorMessage='This file cannot be opened because it is broken'
                                                          timeout={2000}
                                                          autoClose
                                                          onClose={this.handleCloseDocumentError}/>}
                {renderingInProcess && this.renderRenderingSpinner()}
            </div>
        );
    }

    handleCloseDocumentError = () => {
        this.setState({
            displayDocumentFailError: false
        });

        const {id: boardId} = this.props;
        this.props.onRenderingChange(boardId, 'failure');
        this.props.onCloseBoard(boardId);
    };

    renderRenderingSpinner() {
        return (
            <div className={styles.loader}>
                <CircularProgress/>
            </div>
        );
    }
}
