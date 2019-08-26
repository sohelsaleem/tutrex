import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import {MESSAGE_TYPE_LINK} from './messageTypes';

import styles from './MessageItem.scss';

export default function MessageItem({message, isMineMessage}) {
    const messageItemClassNames = classNames(styles.messageItem, {
        [styles.mineMessage]: isMineMessage
    });

    const bubbleMessageClassNames = classNames(styles.bubbleMessage, {
        [styles.bubbleRightMessage]: isMineMessage,
        [styles.bubbleLeftMessage]: !isMineMessage
    });

    return (
        <div className={messageItemClassNames}>
            {renderMessageTitle({message, isMineMessage})}
            <div className={bubbleMessageClassNames}>
                {renderMessageBody(message)}
            </div>
        </div>
    );
}

function renderMessageTitle({message, isMineMessage}) {
    const title = isMineMessage ? message.toName : message.name;

    return (
        <div className={styles.messageNameContainer}>
            {isMineMessage && <div className={styles.divTo}>To</div>}
            <div>{title}</div>
        </div>
    );
}

function renderMessageBody(message) {
    if (message.type === MESSAGE_TYPE_LINK)
        return <a href={message.params.url} target='_blank'>{message.text}</a>;
    return message.text;
}
