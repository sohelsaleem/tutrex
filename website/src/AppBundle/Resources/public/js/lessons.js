$(function () {
    var $body = $('body');
    var timezone = jstz.determine();

    $.ajax({
        url: Routing.generate('app_set_timezone'),
        method: 'POST',
        data: {'timezoneName': timezone.name()}
    });


    $body.on('click', '.show-create-lesson-modal-button', function () {
        var $createLessonModal = $('#createLessonModal');

        $.ajax({
            url: Routing.generate('lesson_create'),
            method: 'POST'
        })
            .done(function (data, textStatus, jqXHR) {
                $createLessonModal.find('.modal-body').html(jqXHR.responseJSON.form);
                setTimeAndDataPicker();
                $createLessonModal.modal();
            });
    });

    $body.on('click', '.create-lesson-button', function () {
        $(this).prop('disabled', true);

        $('.create-lesson-form').submit();
    });

    $body.on('submit', '.create-lesson-form', function (e) {
        e.preventDefault();

        var $createLessonModal = $('#createLessonModal');

        $.ajax({
            url: Routing.generate('lesson_create'),
            method: 'POST',
            data: $(this).serialize()
        })
            .done(function (data, textStatus, jqXHR) {
                if (data.status == 'error') {
                    $createLessonModal.find('.modal-body').html(jqXHR.responseJSON.form);
                    setTimeAndDataPicker();
                } else {
                    window.location.replace(data.route);
                }
            });
    });

    $body.on('click', '.invite-lesson', function (e) {
        e.preventDefault();
        var $lessonLinkModal = $('#lessonLinkModal');
        var lessonLink = $(this).attr('href');
        var lessonCode = $(this).data('code');
        var $lessonLink = $lessonLinkModal.find('.lesson-link');
        var $lessonCode = $lessonLinkModal.find('.lesson-code');

        $lessonLink.attr('href', lessonLink);
        $lessonLink.html(lessonLink);
        $lessonCode.html(lessonCode);
        $lessonLinkModal.modal();
    });

    $body.on('click', '.delete-lesson', function (e) {
        e.preventDefault();
        $('.delete-lesson-button').attr('href', $(this).attr('href'));
        $('#deleteLessonModal').modal();
    });
    $body.on('click', '.edit-lesson, .edit-lesson-button', function (e) {
        e.preventDefault();
        var url = $(this).data('url') || $(this).attr('href');
        editLessonAjaxRequest(url);
    });

    $('#editLessonModal').on('hidden.bs.modal', function () {
        $('.edit-lesson-form').remove();
    });

    function editLessonAjaxRequest(url) {
        $.ajax({
            url: url,
            method: 'POST',
            data: $('.edit-lesson-form').serialize()
        })
            .done(function (data) {
                if (data.status === 'success') {
                    window.location.replace(data.path);
                } else {
                    var $editLessonModal = $('#editLessonModal');

                    $editLessonModal.find('.modal-body').html(data.form);
                    $editLessonModal.find('.edit-lesson-button').data('url', url);

                    setTimeAndDataPicker();

                    $editLessonModal.modal();
                }
            });
    }

    function setTimeAndDataPicker() {
        $('.new-lesson-time-field').timepicker();

        var $datePicker = $(".new-lesson-date-field");

        $datePicker.datepicker({
            minDate: new Date(),
            showOn: 'focus',
            dateFormat: 'dd.mm.yy'
        });

        if (!$datePicker.val())
            $datePicker.datepicker('setDate', new Date());
    }
});
