var $body = $('body');
var $openDeleteModalButton = $('.open-delete-reseller-modal-button');
var $deleteResellerButton = $('.delete-reseller-button');
var $openCertModalButton = $('.open-cert-modal-button');
var $certModalContent = $('.cert-modal-content');
var $certModalError = $('.cert-modal-error');
var $certErrorMessage = $('.cert-modal-error-message');
var $certErrorInfoContainer = $('.cert-modal-error-info-container');
var $certErrorInfo = $('.cert-modal-error-info');

$openDeleteModalButton.click(function () {
    $deleteResellerButton.attr('href', $(this).data('href'));
});

$openCertModalButton.click(function () {
    var url = $(this).data('href');
    $.ajax({
        url: url,
        data: null,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (res) {
            $certModalError.addClass('hidden');
            $certModalContent.html(res.content);
        },
        error: function (e) {
            $certModalContent.html('');
            $certErrorInfoContainer.addClass('hidden');
            $certErrorMessage.html(e.responseJSON.message);
            $certModalError.removeClass('hidden');
        }
    });
});

$body.on('click', '.cert-code-button', function (e) {
    e.preventDefault();
    $(this).addClass('disabled');
    var url = $(this).attr('href');
    $.ajax({
        url: url,
        data: null,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (res) {
            $certModalError.addClass('hidden');
            $certModalContent.html(res.content);
        },
        error: function (e) {
            $certModalContent.html('');
            $certErrorInfoContainer.addClass('hidden');
            $certErrorMessage.html(e.responseJSON.message);
            $certModalError.removeClass('hidden');
        }
    });
});

$body.on('click', '.cert-generate-button', function (e) {
    e.preventDefault();
    $(this).addClass('disabled');
    var url = $(this).attr('href');
    $.ajax({
        url: url,
        data: null,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (res) {
            $certModalError.addClass('hidden');
            location.reload();
        },
        error: function (e) {
            $certModalContent.html('');
            $certErrorInfoContainer.removeClass('hidden');
            $certErrorMessage.html(e.responseJSON.message);
            $certErrorInfo.html(e.responseJSON.additionalInfo);
            $certModalError.removeClass('hidden');
        }
    });
});