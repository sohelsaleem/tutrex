$(function(){
    var $body = $('body');
    var $landingModal = $('#landingModal');
    var timezone = jstz.determine();
    var $joinLessonModal = $('#joinLessonModal');
    var $joinLessonError = $('.join-lesson-error');
    var $joinLessonFormGroup = $joinLessonModal.find('.form-group');

    $.ajax({
        url: Routing.generate('app_set_timezone'),
        method: 'POST',
        data: {'timezoneName': timezone.name()}
    });

    $('.nav-join-lesson').click(function (e) {
        e.preventDefault();
        $joinLessonModal.modal();
    });

    $('#joinLessonButton').click(function () {
        $joinLessonError.addClass('hidden');
        $joinLessonFormGroup.removeClass('has-error');
        $.ajax({
            url: Routing.generate('lesson_start_by_code', {code: $('#joinLessonCode').val()}),
            method: 'POST',
            cache: false,
            error: function() {
                $joinLessonError.removeClass('hidden');
                $joinLessonFormGroup.addClass('has-error');
            },
            success: function(data, textStatus, jqXHR) {
                window.location.href = jqXHR.responseJSON.route;
            }
        });
    });

    //get the registration form
   $('.register-button').on('click', function(e){
       e.preventDefault();

       $.ajax({
           url: Routing.generate('user_get_registration_form'),
           method: 'POST',
           cache: false,
           error: function() {
               $landingModal.find('.modal-title').html('Error');
               $landingModal.find('.modal-body').html('The connection is not established');
           },
           success: function(data, textStatus, jqXHR) {
               if (jqXHR.responseJSON.message == 'logged') {
                   window.location.href = jqXHR.responseJSON.route;
               } else {
                   $landingModal.find('.modal-title').html('Registration');
                   $landingModal .find('.modal-body').html(jqXHR.responseJSON.form);
                   setPhoneMask($('#fos_user_registration_form_phone'));
                   $('#landingModal').modal();
               }
           }
       });
   });
    $('.try-button').on('click', function (){

    });
    //submit the registration form
    $body .on('submit', '.registration-form', function(e){
        e.preventDefault();

        $('.register-button').prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('register'),
            data: $(this).serialize(),
            method: 'POST',
            cache: false,
            complete: function(jqXHR) {
                $('.register-button').prop('disabled', false);
                enableBootstrapCloseButton();

                $landingModal.find('.modal-body').html(jqXHR.responseJSON.form);
                setPhoneMask($('#fos_user_registration_form_phone'));

                if (jqXHR.responseJSON.message == 'success') {
                    $landingModal.find('.modal-body').html(jqXHR.responseJSON.confirmation);
                }
            }
        });
    });

    //get the login form
    $('.login-button').on('click', function(e){
        e.preventDefault();

        $.ajax({
            url: Routing.generate('login_ajax'),
            method: 'POST',
            cache: false,
            error: function() {
                $landingModal.find('.modal-title').html('Error');
                $landingModal.find('.modal-body').html('The connection is not established');
            },
            success: function(data, textStatus, jqXHR) {
                if (jqXHR.responseJSON.message == 'logged') {
                    window.location.href = jqXHR.responseJSON.route;
                } else {
                    $landingModal.find('.modal-title').html('Log in');
                    $landingModal.find('.modal-body').html(jqXHR.responseJSON.form);
                    $('#landingModal').modal();
                }
            }
        });
    });

    //submit the login form
    $body .on('submit', '.login-form', function(e){
        e.preventDefault();

        $('.login-button').prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('check_login_ajax'),
            data: $(this).serialize(),
            method: 'POST',
            cache: false,
            complete: function(jqXHR){
                $('.login-button').prop('disabled', false);
                enableBootstrapCloseButton();

                if(jqXHR.responseJSON.success) {
                    window.location.href = jqXHR.responseJSON.route;
                } else {
                    var loginError = $('.login-error');

                    if (loginError .length != 0) {
                        loginError .remove();
                    }

                    $landingModal.find('.modal-body').prepend('<div class="login-error alert alert-danger danger-message error-message">' + jqXHR.responseJSON.message + '</div>')
                }
            }
        })
    });

    //go from the login form to the registration form
    $body.on('click', '.login-register-button', function(e){
        e.preventDefault();

        $.ajax({
            url: Routing.generate('user_get_registration_form'),
            method: 'POST',
            cache: false,
            error: function() {
                $landingModal.find('.modal-title').html('Error');
                $landingModal.find('.modal-body').html('The connection is not established');
            },
            success: function(data, textStatus, jqXHR) {
                $landingModal.find('.modal-title').html('Register');
                $landingModal.find('.modal-body').html(jqXHR.responseJSON.form);
                setPhoneMask($('#fos_user_registration_form_phone'));
            }
        });
    });

    //go from the login form to the reset password form
    $body.on('click', '.forgot-password-link', function(e){
        e.preventDefault();

        $.ajax({
            url: Routing.generate('reset_password_ajax'),
            method: 'POST',
            cache: false,
            error: function() {
                $landingModal.find('.modal-title').html('Error');
                $landingModal.find('.modal-body').html('The connection is not established');
            },
            success: function(data, textStatus, jqXHR) {
                $landingModal.find('.modal-title').html('Reset password');
                $landingModal.find('.modal-body').html(jqXHR.responseJSON.form);
            }
        });
    });

    //submit the reset password form
    $body.on('click', '.restore-button', function(e){
        e.preventDefault();

        $(this).prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('reset_send_email_ajax'),
            data: $('.user-restore').serialize(),
            method: 'POST',
            cache: false,
            complete: function(jqXHR) {
                $(this).prop('disabled', false);
                enableBootstrapCloseButton();

                if (jqXHR.responseJSON.message == 'fail') {
                    $landingModal.find('.modal-body').html(jqXHR.responseJSON.form);
                } else {
                    $landingModal.find('.modal-body').html(jqXHR.responseJSON.confirmation);
                }
            }
        });
    });
});