import React, {Component, PropTypes} from 'react';

import styles from 'components/textChat/TextChatComponent.scss';

const defaultColor = '#D8DBDE';
const enabledColor = '#3EA1F6';

export default class UploadFileButton extends Component {
    static PropTypes = {
        onButtonClick: PropTypes.func.isRequired,
        isEnabled: PropTypes.bool.isRequired
    };

    render() {
        const {isEnabled} = this.props;

        const fillColor = isEnabled ? enabledColor : defaultColor;

        return (
            <div className={styles.uploadFileButton} onClick={::this.handleButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 18">
                    <path fill={fillColor} fillRule="evenodd" d="M11.455 3.857C11.455 1.73 9.528 0 7.159 0 4.871 0 2.864
                        1.945 2.864 4.162c0 .095.02.184.05.268a.789.789 0 0 0-.05.268v7.247c0 1.554 1.285 2.819 2.863
                        2.819 1.579 0 2.864-1.265 2.864-2.819V5.906a.812.812 0 0 0-.818-.805.812.812 0 0
                        0-.818.805v6.04c0 .665-.551 1.207-1.228 1.207A1.219 1.219 0 0 1 4.5 11.945V4.698a.789.789 0 0
                        0-.05-.268.789.789 0 0 0 .05-.268c0-1.204 1.137-2.551 2.66-2.551 1.465 0 2.658 1.007 2.658 2.246
                        0 .076.014.15.035.22a.795.795 0 0 0-.035.218v8.44c0 2.016-1.835 3.654-4.09 3.654-2.256
                        0-4.092-1.638-4.092-3.654V5.906a.812.812 0 0 0-.818-.805.812.812 0 0 0-.818.805v7.247c0
                        .106.022.205.06.297C.44 16.017 2.833 18 5.726 18c2.894 0 5.287-1.985 5.668-4.55a.782.782 0 0 0
                        .06-.297V4.295a.795.795 0 0 0-.035-.219.793.793 0 0 0 .035-.22" opacity=".502"/>
                </svg>
            </div>
        );
    }

    handleButtonClick() {
        this.props.onButtonClick();
    }
}
