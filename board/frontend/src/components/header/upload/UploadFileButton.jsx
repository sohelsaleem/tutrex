import React, {Component, PropTypes} from 'react';
import styles from './UploadFileButton.scss';
import classNames from 'classnames';

import InputFile from 'components/common/InputFile';

export default class UploadFileButton extends Component {
    static propTypes = {
        acceptMimeTypes: PropTypes.array,
        enabled: PropTypes.bool,
        className: PropTypes.string,
        onSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        acceptMimeTypes: [],
        enabled: false
    };

    state = {
        inputFileSelected: false
    };

    render() {
        const {acceptMimeTypes, className, enabled, onSelect} = this.props;
        const {inputFileSelected} = this.state;

        const buttonClassName = classNames(styles.uploadFileButton, className, {
            [styles.enabled]: enabled
        });
        const accept = acceptMimeTypes.join(',');

        return (
            <div className={buttonClassName}
                 onClick={this.handleStartFileSelection}>

                {enabled &&
                <InputFile accept={accept}
                           selected={inputFileSelected}
                           onCancelSelection={this.handleClearSelection}
                           ref='button'
                           onSelect={onSelect}/>
                }
            </div>
        );
    }

    handleStartFileSelection = () => {
        this.setState({
            inputFileSelected: true
        });
    };

    handleClearSelection = () => {
        this.setState({
            inputFileSelected: false
        });
    };
}
