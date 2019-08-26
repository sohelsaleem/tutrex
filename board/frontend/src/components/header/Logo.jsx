import React, {Component, PropTypes} from 'react';
import styles from './Logo.scss';
import DefaultLogo from 'assets/header/logo.png';

export default class Logo extends Component {
    static propTypes = {
        classroomLogo: PropTypes.string
    };

    render() {
        const {classroomLogo} = this.props;
        return (
            <div className={styles.logoContainer}>
                <img className={styles.logo}
                     src={classroomLogo && classroomLogo.length > 0 ? classroomLogo : DefaultLogo}/>
            </div>
        );
    }
}
