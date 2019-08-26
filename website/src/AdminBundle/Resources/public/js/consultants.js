$(function(){
    $(document).on('click', '.get-add-consultant-form-button', function(){
        $.ajax({
            url: Routing.generate('admin_get_consultant_form')
        })
            .done(function(data){
                var $addConsultantModal = $('#add-consultant-modal');

                $addConsultantModal.find('.consultant-form').html(data.form);
                $addConsultantModal.modal();
            });
    });

    $(document).on('click', '.add-consultant-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $addConsultantModal = $('#add-consultant-modal');

        $self.prop('disabled', true);

        $.ajax({
            url: Routing.generate('admin_add_consultant'),
            method: 'POST',
            data: $addConsultantModal.find('.add-consultant-form').serialize()
        })
            .always(function(){
                $self.prop('disabled', false);
            })
            .fail(function(){
                $addConsultantModal.find('.modal-title').html('Error');
                $addConsultantModal.find('.modal-body').html('The connection is not established');
            })
            .done(function(data){
                if (data.status == 'success') {
                    window.location.replace(Routing.generate('admin_show_consultants'));
                } else {
                    $addConsultantModal.find('.consultant-form').html(data.form);
                }
            });
    });

    $(document).on('click', '.get-edit-consultant-form-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $editConsultantModal = $('#edit-consultant-modal');
        var id =  $self.siblings('.consultant-id').val();

        $.ajax({
            url: Routing.generate('admin_get_consultant_form', {'id': id}),
            method: 'POST'
        })
            .fail(function(){
                $editConsultantModal.find('.modal-title').html('Error');
                $editConsultantModal.find('.modal-body').html('<p class="alert alert-danger danger-message error-message">The connection is not established</p>');
            })
            .done(function(data){
                $editConsultantModal.find('.consultant-id').val(id);
                $editConsultantModal.find('.consultant-form').html(data.form);

                $editConsultantModal.modal();
            });
    });

    $(document).on('click', '.edit-consultant-button', function(e){
        e.preventDefault();

        var $self = $(this);
        var $editConsultantModal = $('#edit-consultant-modal');
        var id = $editConsultantModal.find('.consultant-id').val();

        $self.prop('disabled', true);

        $.ajax({
            url: Routing.generate('admin_edit_consultant', {'id': id}),
            data: $editConsultantModal.find('.add-consultant-form').serialize(),
            method: 'POST'
        })
            .always(function(){
                $self.prop('disabled', false);
            })
            .fail(function(){
                $editConsultantModal.find('.modal-title').html('Error');
                $editConsultantModal.find('.modal-body').html('<p class="alert alert-danger danger-message error-message">The connection is not established</p>');
            })
            .done(function(data){
                if (data.status == 'success') {
                    window.location.replace(Routing.generate('admin_show_consultants'));
                } else {
                    $editConsultantModal.find('.consultant-form').html(data.form);
                }
            })
    });

    $(document).on('click', '.show-delete-consultant-modal', function(e){
        e.preventDefault();

        var $self = $(this);
        var $deleteConsultantModal = $('#delete-consultant-modal');
        var id =  $self.siblings('.consultant-id').val();

        $deleteConsultantModal.find('.consultant-id').val(id);
    });

    $(document).on('click', '.delete-consultant-button', function(){
        var $deleteConsultantModal = $('#delete-consultant-modal');
        var id = $deleteConsultantModal.find('.consultant-id').val();

        $.ajax({
            url: Routing.generate('admin_delete_consultant', {'id': id})
        })
            .done(function(){
                window.location.replace(Routing.generate('admin_show_consultants'));
            });
    });

    $(document).on('click', '.show-reset-consultant-password-modal', function(e){
        e.preventDefault();

        var $self = $(this);
        var $resetConsultantPasswordModal = $('#reset-consultant-password-modal');
        var id =  $self.siblings('.consultant-id').val();

        $resetConsultantPasswordModal.find('.consultant-id').val(id);
    });

    $(document).on('click', '.reset-consultant-password-button', function(){
        var $self = $(this);

        var $resetConsultantPasswordModal = $('#reset-consultant-password-modal');
        var $messageModal = $('#message-modal');
        var id = $resetConsultantPasswordModal.find('.consultant-id').val();

        $self.prop('disabled', true);

        $.ajax({
            url: Routing.generate('admin_reset_consultant_password', {'id': id})
        })
            .done(function(){
                $self.prop('disabled', false);

                var modalTitle = $resetConsultantPasswordModal.find('.modal-title').html();

                $messageModal.find('.modal-title').html(modalTitle);
                $messageModal.find('.message').html('The consultant password reset message has been sent');
                $resetConsultantPasswordModal.modal('hide');
                $messageModal.modal('show');
            });
    });
});