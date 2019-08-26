import React, {Component, PropTypes} from 'react';
import styles from './UploadDocumentButton.scss';
import UploadFileButton from './UploadFileButton';

import {documentMimeTypes} from 'domain/whiteboard/upload/documentFileRestrictions';

export default class UploadDocumentButton extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        onSelect: PropTypes.func.isRequired
    };

    render() {
        const {enabled, onSelect} = this.props;

        const acceptMimeTypes = documentMimeTypes.join(',');

        return (
            <UploadFileButton className={styles.uploadDocumentButton}
                              enabled={enabled}
                              acceptMimeTypes={documentMimeTypes}
                              onSelect={onSelect}/>
        );
    }
}
