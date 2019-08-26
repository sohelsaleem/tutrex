import React, {Component, PropTypes} from 'react';

import MessageItem from './MessageItem';

import { Scrollbars } from 'react-custom-scrollbars';

const SCROLL_AVAILABLE_RANGE = 20;

export default class TextMessagesList extends Component {
    static propTypes = {
        selectedChatId: PropTypes.any,
        myUserId: PropTypes.any,
        messages: PropTypes.array,
        style: PropTypes.object
    };

    autoScrollAvailable = true;

    scrollChatToEnd(){
        if (this.autoScrollAvailable)
            this.refs.scroll.scrollToBottom();
    }

    componentDidMount() {
        this.scrollChatToEnd();
    }

    componentDidUpdate() {
        this.scrollChatToEnd();
    }

    render() {
        const styles = require('./TextMessagesList.scss');
        const messages = this.props.messages || [];

        const {style} = this.props;

        const messagesList = messages.filter(this.isMessageMatchFilter);

        return (
            <div className={styles.listContainer} style={style}>
                <Scrollbars ref='scroll'
                            style={{ height: '100%' }}
                            onScroll={::this.handleScroll}
                            autoHeight
                            autoHeightMax={'100%'}>
                    {messagesList.map(this.renderMessage)}
                </Scrollbars>
            </div>
        );
    }

    handleScroll() {
        const {scroll} = this.refs;

        const scrollRange = scroll.getScrollHeight() - scroll.getScrollTop() - scroll.getClientHeight();
        this.autoScrollAvailable = scrollRange < SCROLL_AVAILABLE_RANGE;
    }

    isMessageMatchFilter = message => {
        const {selectedChatId, myUserId} = this.props;

        if (selectedChatId === 'all')
            return true;

        return message.to === selectedChatId && message.from === myUserId ||
            message.from === selectedChatId && message.to === myUserId;
    };

    renderMessage = (message, index) => {
        const {myUserId} = this.props;

        return <MessageItem key={index}
                            message={message}
                            isMineMessage={myUserId === message.from}/>;
    };
}
