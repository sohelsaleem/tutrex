const Capabilities = require('../../controllers/helpers/Capabilities');

module.exports = function (authInfo, tabId) {
    return {
        user: mapUser(authInfo.user, tabId),
        room: mapRoom(authInfo.room)
    };
};

function mapUser(dto, tabId) {
    const capabilities = dto.is_teacher ? getTeacherCapabilities() : getStudentCapabilities();
    const mediaState = dto.is_teacher ? getTeacherTrackEnableMap() : getStudentTrackEnableMap();
    return {
        id: dto.id,
        tabId,
        name: dto.name,
        isTeacher: dto.is_teacher,
        capabilities: capabilities,
        exitLink: dto.exit_link,
        mediaState: mediaState,
        isRaiseHand: getDefaultRaiseHandState()
    };
}

function mapRoom(dto) {
    return {
        id: dto.id,
        name: dto.name,
        lessonLink: dto.lesson_link,
        lessonCode: dto.lesson_code,
        maxAttendeeCount: dto.number_of_students,
        startTime: parseInt(dto.start_time),
        approxDuration: parseInt(dto.approx_duration),
        maxDuration: parseInt(dto.max_duration),
        isFilesSharingNotAvailable: dto.is_files_sharing_not_available,
        canRecordClass: dto.can_record_class,
        teacherGoneTimeout: dto.teacher_gone_timeout,
        classroomLogo: dto.classroom_logo,
        maxUploadSize: dto.max_upload_size
    };
}

function getTeacherCapabilities() {
    const capabilities = {};
    capabilities[Capabilities.WHITEBOARD] = true;
    capabilities[Capabilities.CAMERA] = true;
    capabilities[Capabilities.MIC] = true;
    capabilities[Capabilities.RAISE_HAND] = false;
    capabilities[Capabilities.MANAGE_RAISE_HANDS] = true;
    return capabilities;
}

function getStudentCapabilities() {
    const capabilities = {};
    capabilities[Capabilities.WHITEBOARD] = false;
    capabilities[Capabilities.CAMERA] = false;
    capabilities[Capabilities.MIC] = false;
    capabilities[Capabilities.RAISE_HAND] = true;
    capabilities[Capabilities.MANAGE_RAISE_HANDS] = false;
    return capabilities;
}

function getTeacherTrackEnableMap() {
    return {
        video: true,
        audio: true
    };
}

function getStudentTrackEnableMap() {
    return {
        video: false,
        audio: false
    };
}

function getDefaultRaiseHandState() {
    return false;
}
