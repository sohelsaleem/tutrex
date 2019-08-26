$(function () {

    var SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg'];

    function bindUI() {
        $('.save-logo-button').on('click', function () {
            $('#user_edit_logo_classroomLogo').click();
        });

        $('#user_edit_logo_classroomLogo').on('change', function (e) {
            if (!e.target.files || e.target.files.length === 0)
                return;
            var $errors = $('.logo-form').find('.field-errors');
            if (!$errors.hasClass('hidden')) {
                $errors.addClass('hidden');
            }

            var file = e.target.files[0];
            var tmp = file.name.split('.');
            var fileFormat = tmp[tmp.length - 1].toLowerCase();

            if (fileFormat && !(SUPPORTED_FORMATS.indexOf(fileFormat) < 0)) {
                $('.preloader').removeClass('hidden');
                var fr = new FileReader();
                fr.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.className = 'logo';
                    $('.logo-container').html(image);
                };
                fr.readAsDataURL(file);
                sendLogo();
            } else {
                $errors.removeClass('hidden');
            }
        });
        $('.delete-logo-button').on('click', deleteLogo);
    }

    function sendLogo() {
        var fd = new FormData($("#edit-logo-form").get(0));
        $.ajax({
            url: $('.save-logo-button').attr('data-href'),
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (result) {
                $('#logo-form-block').html(result.form);
                bindUI();
            }
        });
    }

    function deleteLogo() {
        $.ajax({
            url: $('.delete-logo-button').attr('data-href'),
            type: 'POST',
            success: function (result) {
                $('#logo-form-block').html(result.form);
                bindUI();
            }
        });
    }

    bindUI();
});