$(function () {
    var $body = $('body');

    //user filter start
    var $userFilter = $('.user-filter');

    $userFilter.on('change', function () {
        $.ajax({
            url: Routing.generate('admin_get_filtered_teachers'),
            data: {name: $('#userFilter_name').val()},
            method: 'POST',
            cache: false,
            complete: function (jqXHR) {
                $('.teachers-table-block').html(jqXHR.responseJSON.teachers);
            }
        });
    });

    $userFilter.on('submit', function (e) {
        e.preventDefault();
    });

    var nameTimerId;

    $userFilter.on('input', function () {
        clearTimeout(nameTimerId);

        nameTimerId = setTimeout(function () {
            $('.user-filter').change();
        }, 500);
    });

    $userFilter.on('blur', function (e) {
        e.preventDefault();
    });
    //user filter end

    $body.on('click', '.ban-action', function () {
        var self = this;
        var message = 'banned';

        if ($(self).closest('.teacher-row').hasClass('unbanned')) {
            message = 'unbanned';
        }

        $.ajax({
            url: Routing.generate('admin_ban_user'),
            method: 'POST',
            data: {message: message, userId: $(self).closest('.teacher-row').data('user-id')},
            cache: false,
            complete: function () {
                $(self).closest('.teacher-row').toggleClass('banned unbanned');
            }
        })
    });


    $(document).on('click', '.show-delete-teacher-modal', function (e) {
        e.preventDefault();

        var $self = $(this);
        var $deleteTeacherModal = $('#delete-teacher-modal');
        var id = $self.siblings('.teacher-id').val();

        $deleteTeacherModal.find('.teacher-id').val(id);
    });

    $(document).on('click', '.delete-teacher-button', function () {
        var $deleteTeacherModal = $('#delete-teacher-modal');
        var id = $deleteTeacherModal.find('.teacher-id').val();
        $.ajax({
            url: Routing.generate('admin_delete_teacher', {'id': id})
        })
            .done(function () {
                window.location.replace(Routing.generate('admin_show_teachers'));
            });
    });
});