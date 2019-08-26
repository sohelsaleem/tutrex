import React, {Component, PropTypes} from 'react';
import LessonRecord from './LessonRecord';

export default class LessonRecordPermissionWrapper extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    render() {
        const {user} = this.props;

        if (!user.isTeacher)
            return null;

        return <LessonRecord {...this.props}/>;
    }
}
