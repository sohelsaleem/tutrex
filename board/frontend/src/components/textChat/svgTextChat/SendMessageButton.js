import React, {Component, PropTypes} from 'react';

const defaultColor = '#D8DBDE';
const enabledColor = '#3EA1F6';

const styles = require('../TextChatComponent.scss');

export default class SendMessageButton extends Component {
    static PropTypes = {
        onClickSendMessageButton: PropTypes.func.isRequired,
        isEnabled: PropTypes.bool.isRequired
    };

    render() {
        const {onClickSendMessageButton, isEnabled} = this.props;

        const fillColor = isEnabled ? enabledColor : defaultColor;

        return (
            <div className={styles.sendMessageButton} onClick={onClickSendMessageButton}>
                <svg width="18" height="15" viewBox="0 0 18 15">
                    <path fill={fillColor} fillRule="nonzero" d="M17.683 7.12L.882.118C-.108-.295.005.51.005.51l.708
                6.268s-.045.24.3.3l5.186.333-5.186.332c-.346.06-.301.3-.301.3l-.708
                6.27s-.112.805.877.393l16.8-7.003c.718-.3.002-.583.002-.583z"/>
                </svg>
            </div>
        );
    }
}
