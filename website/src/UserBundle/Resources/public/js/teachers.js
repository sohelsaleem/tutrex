$(function(){
    var $body = $('body');

    //get add teacher form
    $body.on('click', '.get-add-teacher-modal-button', function(){
       $.ajax({
           url: Routing.generate('user_get_add_teacher-form')
       })
           .done(function(data, textStatus, jqXHR){
               var $addTeacherModal = $('#addTeacherModal');

               $addTeacherModal.find('.modal-body').html(jqXHR.responseJSON.form);
               setPhoneMask($('#add_teacher_form_phone'));
               $addTeacherModal.modal();
           });
    });

    //submit add teacher form
    $body.on('click', '.add-teacher-button', function(e){
       e.preventDefault();

       var $self = $(this);
       var $addTeacherModal = $('#addTeacherModal');

       $self.prop('disabled', true);
       disableBootstrapCloseButton();

      $.ajax({
          url: Routing.generate('user_add_teacher_ajax'),
          method: 'POST',
          data: $('.add-teacher-form').serialize()
      })
          .always(function(){
              $self.prop('disabled', false);
              enableBootstrapCloseButton();
          })
          .fail(function(jqXHR, textStatus, errorThrown){
              $addTeacherModal.find('.modal-title').html('Error');
              $addTeacherModal.find('.modal-body').html('The connection is not established');
          })
          .done(function(data, textStatus, jqXHR){
              if (jqXHR.responseJSON.status == 'success') {
                  var $content = $('.content');

                  $content.find('.alert').remove();

                  $content.prepend('<p class="alert alert-info success-message">' + jqXHR.responseJSON.message + '</p>');
                  $('.teachers-table-row').html(jqXHR.responseJSON.teachersTable);

                  $addTeacherModal.modal('hide');

                  window.scrollTo(0, 0);
              } else {
                  $addTeacherModal.find('.modal-body').html(jqXHR.responseJSON.form);
                  setPhoneMask($('#add_teacher_form_phone'));
              }
          });
    });

    //get delete teacher form
    $body.on('click', '.show-delete-teacher-modal-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $deleteTeacherModal = $('#deleteTeacherModal');

        $.ajax({
           url: Routing.generate('user_get_delete_teacher_form')
        })
            .fail(function(jqXHR, textStatus, errorThrown){
                $deleteTeacherModal.find('.modal-title').html('Error');
                $deleteTeacherModal.find('.modal-body').html('<p class="alert alert-danger danger-message error-message">The connection is not established</p>');
            })
            .done(function(data, textStatus, jqXHR){
                $deleteTeacherModal.find('.modal-title').html('Delete teacher?');
                $deleteTeacherModal.find('.modal-body').html(jqXHR.responseJSON.form);
                $deleteTeacherModal.find('.teacher-id-for-deleting').val($self.siblings('.teacher-id').val());
                $deleteTeacherModal.modal();
            });
    });

    //submit delete teacher modal
    $body.on('click', '.delete-teacher-button', function(){
        var $self = $(this);

        $.ajax({
            url: Routing.generate('user_delete_teacher', {'id': $self.closest('.modal-body').find('.teacher-id-for-deleting').val()})
        })
            .done(function(data, textStatus, jqXHR){
                var $content =  $('.content');

                $content.find('.alert').remove();

                $content.prepend('<p class="alert alert-info success-message">' + jqXHR.responseJSON.message + '</p>');
                $('.teachers-table-row').html(jqXHR.responseJSON.teachersTable);

                $('#deleteTeacherModal').modal('hide');

                window.scrollTo(0, 0);
            });
    });

    //get edit teacher form
    $body.on('click', '.show-edit-teacher-modal-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $editTeacherModal = $('#editTeacherModal');

       $.ajax({
           url: Routing.generate('user_get_edit_teacher_form', {'id': $self.siblings('.teacher-id').val()}),
           method: 'POST'
       })
           .fail(function(){
               $editTeacherModal.find('.modal-title').html('Error');
               $editTeacherModal.find('.modal-body').html('<p class="alert alert-danger danger-message error-message">The connection is not established</p>');
           })
           .done(function(data){
               $editTeacherModal.find('.modal-title').html('Edit teacher');
               $editTeacherModal.find('.modal-body').html(data.form);

               setPhoneMask($editTeacherModal.find('#add_teacher_form_phone'));
               $editTeacherModal.find('.teacher-id-for-editing').val($self.siblings('.teacher-id').val());
               $editTeacherModal.modal();
           });
    });

    //submit edit teacher form
    $body.on('click', '.edit-teacher-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $editTeacherModal = $('#editTeacherModal');

        $self.prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('user_edit_teacher', {'id': $self.closest('.modal-body').find('.teacher-id-for-editing').val()}),
            data: $('.edit-teacher-form').serialize(),
            method: 'POST'
        })
            .always(function(){
                $self.prop('disabled', false);
                enableBootstrapCloseButton();
            })
            .fail(function(){
                $editTeacherModal.find('.modal-title').html('Error');
                $editTeacherModal.find('.modal-body').html('<p class="alert alert-danger danger-message error-message">The connection is not established</p>');
            })
            .done(function(data, textStatus, jqXHR){
                if(jqXHR.responseJSON.status == 'error') {
                    $editTeacherModal.find('.modal-body').html(jqXHR.responseJSON.form);
                    setPhoneMask($editTeacherModal.find('#add_teacher_form_phone'));
                } else {
                    $('.teachers-table-row').html(jqXHR.responseJSON.teachersTable);

                    var $content = $('.content');

                    $content.find('.alert').remove();
                    $content.prepend('<p class="alert alert-info success-message">' + jqXHR.responseJSON.message + '</p>');

                    $('#editTeacherModal').modal('hide');

                    window.scrollTo(0, 0);
                }
            })
    })
});