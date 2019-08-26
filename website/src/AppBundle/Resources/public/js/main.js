var loggedInEventIsHappened = false;


window.addEventListener('storage', storageChange, false);
$(window).focus(function () {
    if (loggedInEventIsHappened) {
        window.location.replace(Routing.generate('homepage'));
    }
});

function storageChange(event) {
    if (event.key === 'logged_in') {
        loggedInEventIsHappened = true;
    }
}

function disableBootstrapCloseButton() {
    $('.close')
        .css('cursor', 'default')
        .prop('disabled', true);
}

function enableBootstrapCloseButton() {
    $('.close')
        .css('cursor', 'pointer')
        .prop('disabled', false);
}


function setPhoneMask($field) {
    $field.mask("+0#");
}