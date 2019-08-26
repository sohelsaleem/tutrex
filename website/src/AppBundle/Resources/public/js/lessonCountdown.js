$(function(){
    updateTimeToLesson();
});

function updateTimeToLesson() {
    var $lessonTimer = $('#lesson-timer');
    var $timerCaption = $('.timer-caption');

    var token = $('#token').val();
    var lessonTime = moment($('#lessonTime').val(), 'DD.MM.YYYY HH:mm');
    var diff = lessonTime.diff(moment());
    var diffDuration = moment.duration(diff);
    var isLessonStarted = diffDuration.asMilliseconds() <= 0;
    var hoursLeft = diffDuration.hours();
    var timeLeft = moment.utc(diff);

    if (isLessonStarted)
        window.location.replace(Routing.generate('lesson_check_user', {token: token, fromTimerPage: true}));

    if (hoursLeft >= 15) {
        $timerCaption.html('The lesson will start on');
        $lessonTimer.html(lessonTime.format('D MMM YYYY HH:mm'));
        return;
    }

    $timerCaption.html('The lesson will start in');
    $lessonTimer.html(timeLeft.format('HH:mm:ss'));

    setTimeout(updateTimeToLesson, 1000);
}
