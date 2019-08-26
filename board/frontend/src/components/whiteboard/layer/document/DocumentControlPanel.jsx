import React, {Component, PropTypes} from 'react';
import styles from './DocumentControlPanel.scss';

import DocumentPager from './DocumentPager';
import DocumentZoomer from './DocumentZoomer';
import DocumentFullScreen from './DocumentFullScreen';

export default class DocumentControlPanel extends Component {
    static propTypes = {
        canUseWhiteboard: PropTypes.bool.isRequired,
        pageNumber: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        zoomValue: PropTypes.number,
        onSelectPage: PropTypes.func.isRequired,
        onZoomChange: PropTypes.func.isRequired,
        onFullScreenChange: PropTypes.func.isRequired

    };

    render() {
        return (
            <div className={styles.documentPanel}>
                <DocumentPager {...this.props}/>
                <DocumentZoomer {...this.props}/>
                <DocumentFullScreen {...this.props}/>
            </div>
        );
    }
}
