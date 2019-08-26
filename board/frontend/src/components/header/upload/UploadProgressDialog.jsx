import React, {Component, PropTypes} from 'react';
import Dialog from 'components/common/Dialog';
import LinearProgress from 'components/common/progress/LinearProgress';
import CircularSmallOneColorProgress from 'components/common/progress/CircularSmallOneColorProgress';
import ConfirmDialog from 'components/common/ConfirmDialog';
import customStyle from 'components/ComponentsTheme.scss';
import styles from './UploadProgressDialog.scss';

export default class UploadProgressDialog extends Component {
    static propTypes = {
        fileName: PropTypes.string.isRequired,
        uploadRequestId: PropTypes.string,
        progress: PropTypes.number,
        error: PropTypes.object,
        onCancelUploading: PropTypes.func.isRequired,
        isFromStorage: PropTypes.bool,
        needConverting: PropTypes.bool
    };

    state = {
        needConfirmCancel: false
    };

    render() {
        const {fileName, isFromStorage} = this.props;
        const {needConfirmCancel} = this.state;

        const title = `Uploading file ${fileName}`;

        return (
            <Dialog title={title}
                    onClose={this.handleCancel}>
                {!isFromStorage && this.renderProgressBody()}

                {isFromStorage &&
                <div className={styles.circularContainer}>
                    <CircularSmallOneColorProgress/>
                </div>}

                {!isFromStorage && <div className={styles.cancelButtonContainer}>
                    <button onClick={this.handleCancel} className={customStyle.buttonGrey}>Cancel</button>
                </div>}

                {needConfirmCancel && <ConfirmDialog title={title}
                                                     text='Are you sure you want to cancel uploading a file?'
                                                     onConfirm={this.handleConfirmCancel}
                                                     onClose={this.handleDeclineCancelConfirmation}/>}
            </Dialog>
        );
    }

    renderProgressBody() {
        if (this.props.error)
            return this.renderError();

        return this.renderUploadingProgress();
    }

    renderError() {
        console.log(this.props.error);
        return <div className={styles.errorText}>Error has occurred. Please try again later</div>;
    }

    renderUploadingProgress() {
        const {progress, needConverting} = this.props;

        if (progress >= 1 && needConverting)
            return this.renderConvertingProgress();

        return <LinearProgress progress={progress}
                               withHint/>;
    }

    renderConvertingProgress() {
        return (
            <div className={styles.convertingProgress}>
                <div>Converting the file...</div>
                <div className={styles.circularContainer}>
                    <CircularSmallOneColorProgress/>
                </div>
            </div>
        );
    }

    handleCancel = () => {
        this.setState({
            needConfirmCancel: true
        });
    };

    handleDeclineCancelConfirmation = () => {
        this.setState({
            needConfirmCancel: false
        });
    };

    handleConfirmCancel = () => {
        const {uploadRequestId, onCancelUploading} = this.props;
        onCancelUploading(uploadRequestId);
    };
}
