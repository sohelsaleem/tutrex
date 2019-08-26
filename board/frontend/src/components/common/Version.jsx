import React, {Component, PropTypes} from 'react';
import styles from './Version.scss';

export default class Version extends Component {
    static propTypes = {
        serverVersion: PropTypes.string,
        onAppear: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onAppear();
    }

    render() {
        const version = this.createVersionString();
        const {serverVersion} = this.props;

        return (
            <div className={styles.version}>
                <span>Version {version}</span>
                <span> / </span>
                <span>Server Version {serverVersion}</span>
            </div>
        );
    }

    createVersionString() {
        const version = process.env.BUILD_VERSION;
        const buildNumber = process.env.BUILD_NUMBER;

        if (!buildNumber)
            return version;

        return version + '-' + buildNumber;
    }
}
