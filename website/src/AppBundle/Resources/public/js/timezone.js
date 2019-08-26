$(function() {
    var timezone = jstz.determine();

    $.ajax({
        url: Routing.generate('app_set_timezone'),
        method: 'POST',
        data: {'timezoneName': timezone.name()}
    })
        .done(function(){
           window.location.replace(Routing.generate('lesson_consultant_lesson_start'));
        });
});