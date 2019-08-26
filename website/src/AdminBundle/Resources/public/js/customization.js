var $landingImagePreview = $('.landingImagePreview');
var $landingImage = $('#customization_landingImage');
var $uploadLandingImageButton = $('.uploadLandingImageButton');
var $landingImageFileInput = $('#customization_landingImageFile');
var $landingImageBottomPreview = $('.landingImageBottomPreview');
var $landingImageBottom = $('#customization_landingImageBottom');
var $uploadLandingImageBottomButton = $('.uploadLandingImageBottomButton');
var $landingImageBottomFileInput = $('#customization_landingImageBottomFile');
var $logo = $('#customization_logo');
var $logoPreview = $('.logoPreview');
var $uploadLogoButton = $('.uploadLogoButton');
var $logoFileInput = $('#customization_logoFile');

$uploadLandingImageButton.click(function () {
    $landingImageFileInput.click();
});

$landingImageFileInput.change(function () {
    var file = $(this).prop('files')[0];
    var data = new FormData();
    data.append('file', file);
    data.append('type', 'landingImage');
    $.ajax({
        url: Routing.generate('admin_customization_upload_image'),
        data: data,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            $landingImagePreview.attr('src', data.file);
            $landingImage.val(data.file);
        },
        error: function (e) {
            console.log(e);
        }
    });
});

$uploadLandingImageBottomButton.click(function () {
    $landingImageBottomFileInput.click();
});

$landingImageBottomFileInput.change(function () {
    var file = $(this).prop('files')[0];
    var data = new FormData();
    data.append('file', file);
    data.append('type', 'landingImageBottom');
    $.ajax({
        url: Routing.generate('admin_customization_upload_image'),
        data: data,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            $landingImageBottomPreview.attr('src', data.file);
            $landingImageBottom.val(data.file);
        },
        error: function (e) {
            console.log(e);
        }
    });
});

$uploadLogoButton.click(function () {
    $logoFileInput.click();
});

$logoFileInput.change(function () {
    var file = $(this).prop('files')[0];
    var data = new FormData();
    data.append('file', file);
    data.append('type', 'logo');
    $.ajax({
        url: Routing.generate('admin_customization_upload_image'),
        data: data,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            $logoPreview.attr('src', data.file);
            $logo.val(data.file);
        },
        error: function (e) {
            console.log(e);
        }
    });
});