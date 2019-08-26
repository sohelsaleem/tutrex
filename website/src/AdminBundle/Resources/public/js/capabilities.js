$(function () {

    formatPhoneNumber();


    var $body = $('body');
    var $changeApiPlanButton = $('.change-api-plan');

    $('.expirationDate-field').datepicker({
        minDate: new Date(),
        showOn: "focus",
        dateFormat: "dd.mm.yy"
    });

    $($body).on('click', '.edit-profile', function (e) {
        e.preventDefault();

        $('.edit-profile-block').addClass('edit');
    });

    $($body).on('click', '.cancel-edit-profile', function (e) {
        e.preventDefault();

        $('.profile-edit-form').find('.help-block').remove();
        $('.edit-profile-block').removeClass('edit');


        $('.name-field').val($('.name-label').html());
        $('.phone-field').val($('.phone-label').html());
        $('.expirationDate-field').val($('.expirationDate-label').html());
    });


    $($body).on('click', '.save-capabilities', function (e) {
        e.preventDefault();

        $.ajax({
            url: Routing.generate('admin_save_capabilities', {'id': $('.teacher-id').val()}),
            data: $('.capabilities-edit-form').serialize(),
            method: 'POST',
            cache: false,
            complete: function (jqXHR) {
                $('.edit-capabilities-block').html(jqXHR.responseJSON.form);
                if (jqXHR.responseJSON.success)
                    $('.cancel-edit-capabilities').click();
            }
        })
    });


    $($body).on('click', '.edit-capabilities', function (e) {
        e.preventDefault();

        $('.edit-capabilities-block').addClass('edit');
    });

    $($body).on('click', '.cancel-edit-capabilities', function (e) {
        e.preventDefault();

        $('.capabilities-edit-form').find('.help-block').remove();
        $('.edit-capabilities-block').removeClass('edit');


        $('.students-in-classroom-field').val($('.students-in-classroom').html());
        $('.hour-lesson-duration-field').val($('.hour-lesson-duration').html());
        $('.teachers-field').val($('.teachers').html());
        $('.storage-limit-field').val($('.storage-limit').html());
    });

    $($body).on('click', '.save-profile', function (e) {
        e.preventDefault();

        $.ajax({
            url: Routing.generate('admin_save_teacher_profile', {'id': $('.teacher-id').val()}),
            data: $('.profile-edit-form').serialize(),
            method: 'POST',
            cache: false,
            complete: function (jqXHR) {
                if (jqXHR.responseJSON.success) {
                    $('.name-label').html($('.name-field').val());
                    $('.phone-label').html($('.phone-field').val());
                    $('.expirationDate-label').html($('.expirationDate-field').val());
                    $('.cancel-edit-profile').click();
                } else {
                    $('.edit-profile-block').html(jqXHR.responseJSON.form);
                }
                formatPhoneNumber();
            }
        })
    });

    $changeApiPlanButton.click(function() {
        $.ajax({
            url: Routing.generate('admin_change_teacher_plan', {user: $('.teacher-id').val(), plan: $('.planSelect').val()}),
            complete: function (jqXHR) {
                if (jqXHR.responseJSON.status === 'success') {
                    location.reload();
                    return;
                }

                var $switchPlanError = $('.switch-plan-error');
                $switchPlanError.html(jqXHR.responseJSON.message);
                $switchPlanError.removeClass('hidden');
            }
        });
    });

    function formatPhoneNumber() {
        setPhoneMask($('#profileEditForm_phone'));
        setPhoneMask($('.phone-label'));
        $('.phone-label').removeClass('hidden');
        $('#profileEditForm_phone').removeClass('hidden');
    }
});
