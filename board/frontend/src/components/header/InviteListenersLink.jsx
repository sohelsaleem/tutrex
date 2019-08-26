import React, {Component, PropTypes} from 'react';
import styles from './InviteListenersLink.scss';

import CopyEditField from '../common/CopyEditField';

export default class InviteListenersLink extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        textToCopy: PropTypes.string.isRequired,
        successMessage: PropTypes.string.isRequired,
        handleCopy: PropTypes.func.isRequired,
        linkType: PropTypes.string.isRequired,
        copied: PropTypes.string
    };

    handleDidCopy = () => {
        const {handleCopy, linkType} = this.props;
        handleCopy(linkType);
    };

    render() {
        const {label, textToCopy, successMessage, linkType, copied} = this.props;
        const linkCopied = linkType === copied;

        return (
            <div className={styles.linkTab}>
                <div>{label}</div>
                <CopyEditField value={textToCopy}
                               className={styles.linkField}
                               onDidCopy={this.handleDidCopy}/>
                <div className={styles.copyButton}></div>
                {linkCopied && <div className={styles.linkCopied}>{successMessage}</div>}
            </div>
        );
    }
}
