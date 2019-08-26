$(function () {
    var $NEW_DOMAIN = $('<li><div class="cert-domain"><span class="cert-domain-name"></span><a class="cert-domain-delete btn learnium-danger-btn">Delete</a></div></li>');
    var $NEW_RECORD = $('<div><div class="cert-record"><p class="cert-record-row"><span class="cert-record-key">Type: </span><span class="cert-record-type"></span></p><p class="cert-record-row"><span class="cert-record-key">Name: </span><span class="cert-record-name"></span></p><p class="cert-record-row"><span class="cert-record-key">Value: </span><span class="cert-record-value"></span></p></div></div>');

    var $body = $('body');
    var $spinner = $('.spinner');
    var $addButton = $('.cert-domain-add');
    var $newName = $('.cert-domain-new-name');
    var $domainList = $('.cert-domain-list');
    var $generateButton = $('.cert-generate');
    var $prepareButton = $('.cert-prepare');
    var $recordList = $('.cert-dns-records');
    var $certError = $('.cert-error');
    var $certErrorInfo = $('.cert-error-info');
    var $dnsFailed = $('.cert-dns-failed');

    $addButton.click(function () {
        var name  = $newName.val() ? $newName.val().trim() : null;
        if (name) {
            var $newDomain = $NEW_DOMAIN.clone();
            $newDomain.find('.cert-domain-name').html(name);
            $domainList.append($newDomain);
            $newName.val('');
            $generateButton.addClass('disabled');
        }
    });

    $body.on('click', '.cert-domain-delete', function () {
        $(this).parent().parent().remove();
        $generateButton.addClass('disabled');
    });

    $prepareButton.click(function() {
        var domains = $('.cert-domain-name').map(function () {
            return $(this).html();
        }).get();
        var data = new FormData();
        data.append('domains', JSON.stringify(domains));

        $spinner.removeClass('hidden');

        $.ajax({
            url: Routing.generate('certificate_prepare'),
            data: data,
            method: 'POST',
            processData: false,
            contentType: false,
            success: function (data) {
                $generateButton.removeClass('disabled');
                $dnsFailed.addClass('hidden');
                $recordList.html('');
                $recordList.removeClass('hidden');
                data.domains.forEach(function (domain) {
                    var $aRecord = createRecord('A', domain.name, '34.197.72.4');
                    $recordList.append($aRecord);

                    if (domain.code) {
                        var $txtRecord = createRecord('TXT', domain.name.replace('*', '_acme-challenge'), domain.code);
                        $recordList.append($txtRecord);
                    }
                });
            },
            complete: function () {
                $spinner.addClass('hidden');
            }
        });
    });

    $generateButton.click(function() {
        $spinner.removeClass('hidden');

        $.ajax({
            url: Routing.generate('certificate_generate'),
            data: false,
            method: 'POST',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status === 'success') {
                    location.reload();
                    return;
                }

                $certErrorInfo.html(data.output);
                $certError.removeClass('hidden');
                $dnsFailed.removeClass('hidden');
                $recordList.addClass('hidden');
                $generateButton.addClass('disabled');

                $spinner.addClass('hidden');
            },
            error: function () {
                setTimeout(function () {
                    location.reload();

                    $spinner.addClass('hidden');
                }, 5000);
            }
        });
    });

    function createRecord(type, name, value) {
        var $record = $NEW_RECORD.clone();
        $record.find('.cert-record-type').html(type);
        $record.find('.cert-record-name').html(name);
        $record.find('.cert-record-value').html(value);

        return $record;
    }
});
