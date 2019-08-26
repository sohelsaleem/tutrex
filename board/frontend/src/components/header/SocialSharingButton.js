import React, {Component, PropTypes} from 'react';
import styles from './SocialSharingButton.scss';

import {
    ShareButtons,
    generateShareIcon
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const GooglePlusIcon = generateShareIcon('google');
const TwitterIcon = generateShareIcon('twitter');

const socialsList = [
    {
        button: FacebookShareButton,
        icon: FacebookIcon
    },
    {
        button: TwitterShareButton,
        icon: TwitterIcon
    },
    {
        button: GooglePlusShareButton,
        icon: GooglePlusIcon
    }
];

export default class SocialSharingButton extends Component {
    static PropTypes = {
        room: PropTypes.object.isRequired
    };

    renderSocialElement(item, index){
        const {
            room
        } = this.props;

        const shareUrl = room.lessonLink;
        const title = 'Tutrex';

        const SocialButton = item.button;
        const SocialIcon = item.icon;

        return (
                <div className={styles.shareButton} key={index}>
                    <SocialButton
                        url={shareUrl}
                        quote={title}>
                        <SocialIcon
                            size={50}
                            round/>
                    </SocialButton>
                </div>
        );
    }

    render() {
        return (
            <div className={styles.optionsList}>
                {socialsList.map(::this.renderSocialElement)}
            </div>
        );
    }
}
