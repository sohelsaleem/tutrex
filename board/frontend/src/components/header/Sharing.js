import React, {Component, PropTypes} from 'react';

const onClickOutside = require('react-onclickoutside');
import InviteListenersLink from './InviteListenersLink';
import SocialSharingButton from './SocialSharingButton';
import classNames from 'classnames';
import styles from './Sharing.scss';

class Sharing extends Component {
    static PropTypes = {
        room: PropTypes.object.isRequired
    };

    state = {
        expanded: false,
        copied: null
    };

    renderOptions() {
        const {room} = this.props;
        const {expanded, copied} = this.state;

        const optionsClassName = classNames(styles.optionsContainer,
            {[styles.notVisible]: !expanded}
        );

        return (
            <div className={optionsClassName}>
                <SocialSharingButton room={room}/>
                <InviteListenersLink label='Link to invite listeners'
                                     textToCopy={room.lessonLink}
                                     successMessage='Link copied to clipboard'
                                     handleCopy={::this.handleCopy}
                                     linkType='link'
                                     copied={copied}/>
                <InviteListenersLink label='Lesson Code'
                                     textToCopy={room.lessonCode}
                                     successMessage='Code copied to clipboard'
                                     handleCopy={::this.handleCopy}
                                     linkType='code'
                                     copied={copied}/>
            </div>
        );
    }

    render() {
        return (
            <div className={styles.front} onClick={this.toggleExpandedPart}>
                <div className={styles.sharingButton}
                     ref='socialSharingButton'></div>
                {this.renderOptions()}
            </div>
        );
    }

    toggleExpandedPart = event => {
        if (event.target !== this.refs.socialSharingButton)
            return;

        this.setState({
            expanded: !this.state.expanded
        });
    };

    handleClickOutside = event => {
        this.setState({
            expanded: false
        });
    };

    handleCopy = linkType => {
        this.setState({
            copied: linkType
        });
    };
}

export default onClickOutside(Sharing);
