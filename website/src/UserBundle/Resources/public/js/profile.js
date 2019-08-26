$(function(){
    var $body = $('body');

    //get change-password form
   $('.change-password-button').on('click', function(){
       var $changePasswordModal = $('#changePasswordModal');

      $.ajax({
          url: Routing.generate('change_password_ajax'),
          method: 'POST',
          cache: false,
          error: function() {
              $changePasswordModal.find('.modal-title').html('Error');
              $changePasswordModal.find('.modal-body').html('The connection is not established');
          },
          success: function(data, textStatus, jqXHR) {
              if (jqXHR.responseJSON.message == 'banned') {
                  window.location.replace(jqXHR.responseJSON.route);
              } else {
                  $('#changePasswordModal').find('.modal-body').html(jqXHR.responseJSON.form);
              }

              $('#changePasswordModal').modal();
          }
      });
   });

    //submit change-password form
    $body.on('click', '.form-change-password-button', function(e){
        e.preventDefault();

        $(this).prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('change_password_ajax'),
            method: 'POST',
            data: $('.fos_user_change_password').serialize(),
            cache: false,
            complete: function(jqXHR){
                enableBootstrapCloseButton();

                if (jqXHR.responseJSON.message == 'success') {
                    var $content = $('.content');

                    $content.find('.alert').remove();
                    $content.prepend('<p class="alert alert-success success-message">The password has been changed</p>');

                    $('#changePasswordModal').modal('hide');

                    window.scrollTo(0, 0);
                } else {
                    $('#changePasswordModal').find('.modal-body').html(jqXHR.responseJSON.form);
                }
            }
       });
    });


    $(document).on('click', '.edit-button', function() {
        var form = $(this).parents('form');

        $.ajax({
            url: $(this).attr('data-href'),
            method: 'POST',
            success: function (response){
                form.html(response.form);
                setPhoneMask($('#user_edit_phone_phone'));

                form.find('.view-field-block').hide();
                form.find('.edit-field-block').show();
            }

        });
    });
/*    //get edit name form
    $body.on('click', '.edit-name-button', function(){
        var self = $(this);

        $.ajax({
            url: Routing.generate('user_get_edit_name_form_ajax', {'id': $('#user-id').val()}),
            method: 'POST'
        })
            .done(function(data, textStatus, jqXHR){
                $('.edit-name-form').html(jqXHR.responseJSON.form);

                var $editNameForm = $('.edit-name-form');

                $($editNameForm).find('.edit-button, .profile-field').hide();
                $($editNameForm).find('.save-button').show();
                $($editNameForm).find('.cancel-button').show();
                $($editNameForm).find('input').show();
            });
    });

    //get edit email form
    $body.on('click', '.edit-email-button', function(){
        $.ajax({
            url: Routing.generate('user_get_edit_email_form_ajax', {'id': $('#user-id').val()}),
            method: 'POST'
        })
            .done(function(data, textStatus, jqXHR){
                $('.edit-email-form').html(jqXHR.responseJSON.form);

                var $editEmailForm = $('.edit-email-form');

                $($editEmailForm).find('.edit-button').hide();
                $($editEmailForm).find('.save-button').show();
                $($editEmailForm).find('.cancel-button').show();
                $($editEmailForm).find('input').show();
            });
    });*/

    $body.on('click', '.cancel-button', function(){
        var form = $(this).parents('form');
        form.find('.view-field-block').show();
        form.find('.edit-field-block').hide();
    });

    $(document).on('click', '.save-button', function (){
        var self = $(this), form = $(this).parents('form');
        $.ajax({
            url: $(this).attr('data-href'),
            method: 'POST',
            data: form.serialize(),
            success: function (response) {
                form.html(response.form);
                //setPhoneMask($('#user_edit_phone_phone'));

                if(response.message == 'invalid') {
                    form.find('.view-field-block').hide();
                    form.find('.edit-field-block').show();
                }
            }
        })
    });

  /*  $body.on('click', '.save-email-button', function(){
        $.ajax({
            url: Routing.generate('user_edit_email_ajax', {'id': $('#user-id').val()}),
            method: 'POST',
            data: $('.edit-email-form').serialize()
        })
            .done(function(data, textStatus, jqXHR){
                if (jqXHR.responseJSON.message == 'invalid') {
                    $('.edit-email-form').html(jqXHR.responseJSON.form);

                    var editEmailForm =  $('.edit-email-form');

                    $(editEmailForm).find('input').show();
                    $(editEmailForm).find('.save-button').show();
                    $(editEmailForm).find('.cancel-button').show();
                    $(editEmailForm).find('.edit-button').hide();
                } else {
                    $('.edit-email-form').html(jqXHR.responseJSON.form);
                }
            });
    });

    $body.on('click', '.save-name-button', function(){
        $.ajax({
            url: Routing.generate('user_edit_name_ajax', {'id': $('#user-id').val()}),
            method: 'POST',
            data: $('.edit-name-form').serialize()
        })
            .done(function(data, textStatus, jqXHR){
                if (jqXHR.responseJSON.message == 'invalid') {
                    $('.edit-name-form').html(jqXHR.responseJSON.form);

                    var editNameForm =  $('.edit-name-form');

                    $(editNameForm).find('input').show();
                    $(editNameForm).find('.save-button').show();
                    $(editNameForm).find('.cancel-button').show();
                    $(editNameForm).find('.edit-button').hide();
                } else {
                    $('.edit-name-form').html(jqXHR.responseJSON.form);
                }
            });
    });
*/
    $(document).on('submit', '.edit-email-form', function(e){
        e.preventDefault();

        $('.save-button').click();
    });

    $(document).on('submit', '.edit-name-form', function(e){
        e.preventDefault();

        $('.save-button').click();
    });

    $(document).on('submit', '.edit-phone-form', function(e){
        e.preventDefault();

        $('.save-button').click();
    });
});

