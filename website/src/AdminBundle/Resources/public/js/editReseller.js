$(function () {
    var $allowSubdomainsLabel = $('#reseller_allowSubdomains').parent();
    var $expirationDateInput = $('#reseller_expirationDate');
    var $externalDomainInput = $('#reseller_externalDomain');
    var $checkBoxes = $('input[type=checkbox]');

    $expirationDateInput.datepicker({
        minDate: new Date(),
        showOn: "focus",
        dateFormat: "dd.mm.yy"
    });

    $checkBoxes.each(function () {
        if ($(this).prop('checked'))
            $(this).parent().addClass('checked-label');
        $(this).change(function () {
            $(this).parent().toggleClass('checked-label');
        });
    });

    if (!$externalDomainInput.val())
        $allowSubdomainsLabel.addClass('disabled');

    $externalDomainInput.on('input', function () {
        if (!$(this).val())
            return $allowSubdomainsLabel.addClass('disabled');
        $allowSubdomainsLabel.removeClass('disabled');
    });
});
