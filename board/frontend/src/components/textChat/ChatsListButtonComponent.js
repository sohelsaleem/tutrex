import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside'
import {Scrollbars} from 'react-custom-scrollbars'
import _ from 'lodash';

const styles = require('./TextChatComponent.scss');

class ChatsListButtonComponent extends Component {
    static propTypes = {
        attendeeList: PropTypes.array,
        onRenderAttendee: PropTypes.func.isRequired,
        currentUserChat: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            showChatsList: false
        };
    }

    handleCloseChatsList(){
        this.setState({showChatsList: false});
    }

    handleToggleChatsList(){
        const showChatsList = !this.state.showChatsList;
        this.setState({showChatsList});
    }

    handleClickOutside = event => {
        this.handleCloseChatsList();
    };

    getAttendeeListWithRightOrders(attendeeList, currentUserChat){
        if(!attendeeList) return null;

        const newAttendeeList = attendeeList.filter(element => {
            return _.get(element, 'id', 'all') !== _.get(currentUserChat, 'id', 'all');
        });

        newAttendeeList.push(currentUserChat);

        return newAttendeeList;
    }

    render() {
        const {
            attendeeList,
            onRenderAttendee,
            currentUserChat
        } = this.props;

        const {
            showChatsList
        } = this.state;


        return (
            <div className={styles.buttonContainer} onClick={::this.handleToggleChatsList}>
                <div className={styles.divTo}>To:</div>

                <div className={styles.expandPanel}>
                    <Scrollbars autoHeight
                                autoHeightMax={'20em'}>
                        {showChatsList ?
                            this.getAttendeeListWithRightOrders(attendeeList, currentUserChat).map(onRenderAttendee)
                            : onRenderAttendee(currentUserChat)
                        }
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

export default onClickOutside(ChatsListButtonComponent);
