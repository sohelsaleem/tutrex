$(function () {
    var $body = $('body');
    var $contactUsModal = $('#contactUsModal');
    var $planTabs = $('.plan-tab');
    var $planTabsContent = $('.plan-tab-content');
    var activeTabClass = 'plan-tab_active';

    $planTabs.click(function () {
        $planTabs.removeClass(activeTabClass);
        $(this).addClass(activeTabClass);

        var contentId = $(this).data('content-id');
        $planTabsContent.addClass('hidden');
        $('#' + contentId).removeClass('hidden');
    });

    $body.on('paste', '#creditCardInput', function (e) {
        e.preventDefault();
    });

    $body.on('paste', '#creditCardExpMonth', function (e) {
        e.preventDefault();
    });

    $body.on('paste', '#creditCardExpYear', function (e) {
        e.preventDefault();
    });

    $body.on('paste', '#creditCardCVC', function (e) {
        e.preventDefault();
    });

    $body.on('submit', '.update-card-form', function (event) {
        event.preventDefault();

        var $form = $('.update-card-form');

        // Disable the submit button to prevent repeated clicks:
        $form.find('.submit').prop('disabled', true);
        disableBootstrapCloseButton();

        // Request a token from Stripe:
        Stripe.card.createToken($form, function (status, response) {
            stripeResponseHandler(status, response, $form);
        });
    });

    $('.contact-us-button').click(function () {
        $contactUsModal.modal('show');
    });

    $('.send-contact-us').click(function () {
        var data = new FormData();
        data.append('message', $('#contactUsMessage').val());
        $.ajax({
            url: Routing.generate('subscription_contact_us'),
            data: data,
            method: 'POST',
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (e) {
                console.log(e);
            }
        });
    });

    function stripeResponseHandler(status, response, $form) {
        if (response.error) { // Problem!
            // Show the errors on the form:
            $form.find('.payment-errors').html(response.error.message).show();
            $form.find('.submit').prop('disabled', false); // Re-enable submission
            enableBootstrapCloseButton();
        } else { // Token was created!

            // Get the token ID:
            var token = response.id;

            $form.find("input").each(function (i, el) {
                var attr = $(el).attr('name');
                if (attr && (attr !== "stripeToken" || attr !== "submit")) {
                    $(el).val("");
                }
            });

            // Insert the token ID into the form so it gets submitted to the server:
            $form.append($('<input type="hidden" name="stripeToken">').val(token));

            $.ajax({
                url: Routing.generate('user_change_card_ajax', {'id': $('#user-id').val()}),
                data: $form.serialize(),
                method: 'POST'
            })
                .done(function (data, textStatus, jqXHR) {
                    $form.find('.submit').prop('disabled', false);
                    enableBootstrapCloseButton();

                    if (jqXHR.responseJSON.message == 'success') {
                        $('#editCreditCardModal').modal('hide');

                        var $content = $('.content');

                        $content.find('.alert').remove();
                        $content.prepend('<p class="alert alert-success success-message">Credit card info was successfully updated</p>');

                        window.scrollTo(0, 0);

                        $('.credit-card-block').html(jqXHR.responseJSON.cardBlock);
                    } else {
                        $('.payment-errors').html(jqXHR.responseJSON.result);
                    }
                })
        }
    }

    //get edit card form
    $body.on('click', '.edit-credit-card', function (e) {
        e.preventDefault();

        $.ajax({
            url: Routing.generate('user_get_edit_card_from_ajax')
        })
            .done(function (data, textStatus, jqXHR) {
                var $editCreditCardModal = $('#editCreditCardModal');

                $editCreditCardModal.find('.modal-body').html(jqXHR.responseJSON.form);
                $("#creditCardInput").mask('9999 9999 9999 9999');

                $editCreditCardModal.modal();
            });
    });

    $body.on('click', '.delete-credit-card', function (e) {
        e.preventDefault();

        $('#deleteCreditCardModal').modal();
    });

    $body.on('click', '.delete-card-button', function () {
        var $self = $(this);

        $(this).prop('disabled', true);
        disableBootstrapCloseButton();

        $.ajax({
            url: Routing.generate('user_delete_card_ajax')
        })
            .done(function (data, textStatus, jqXHR) {
                enableBootstrapCloseButton();
                $self.prop('disabled', false);

                $('#deleteCreditCardModal').modal('hide');

                var $content = $('.content');

                $content.find('.alert').remove();
                $content.prepend('<p class="alert alert-success success-message">Your credit card info was successfully deleted!</p>');

                window.scrollTo(0, 0);

                $('.credit-card-block').html(jqXHR.responseJSON.cardBlock);
            });
    });

    $body.on('click', '.change-plan-button', function () {

        var $changePlanModal = $('#changePlanModal');

        $('.change-plan-button').prop('disabled', true);
        disableBootstrapCloseButton();
        var coupon = $('#coupon').val();

        $.ajax({
            url: Routing.generate('user_change_plan'),
            data: {
                stripe_plan_id: $(this).parents('#changePlanModal').find('.plan-id-in-modal').val(),
                numberOfTeachers: $('.new-number-of-teachers').html(),
                numberOfStudents: $('.new-number-of-students').html(),
                coupon: coupon
            },
            method: 'POST'
        })
            .done(function (data, textStatus, jqXHR) {


                $('.change-plan-button').prop('disabled', false);
                enableBootstrapCloseButton();

                $changePlanModal.modal('hide');

                var $content = $('.content');

                $content.find('.alert').remove();

                var messageClass = 'info-message';
                var alertClass = 'info';

                if (data.status == 'success') {
                    messageClass = 'success-message';
                    alertClass = 'success';
                } else if (data.status = 'error') {
                    messageClass = 'error-message';
                    alertClass = 'danger';
                }

                $content.prepend('<p class="alert alert-' + alertClass + ' ' + messageClass + '">' + jqXHR.responseJSON.message + '</p>');

                window.scrollTo(0, 0);

                $('.user-subscription-info').html(jqXHR.responseJSON.userSubscriptionInfo);
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
            });
    });

    function bindUI() {
        $('.plan').toArray().forEach(function (container) {
            new Plan(container);
        });
    }

    bindUI();

});

function Plan(container) {
    this.$container = $(container);
    this.currentIndex = {
        numberOfTeachers: 0,
        studentsInClassroom: 0
    };
    this.numberOfTeachers = this.$container.attr('data-teachers').split(',');
    this.studentsInClassroom = this.$container.attr('data-students').split(',');
    this.initUI();
}

Plan.prototype.initUI = function () {
    var self = this;
    this.$container.find('.plan-period').on('click', function () {
        self.$container.find('.plan-period').removeClass('active');
        $(this).addClass('active');
        self.onChange();
    });

    this.$container.find('.plan-parameter').each(function (i, parameter) {
        var $parameter = $(parameter);
        if (!$parameter.attr('data-enabled'))
            return;
        var key = $parameter.attr('data-key');
        $parameter.find('.parameter-controls').each(function (i, parameterControl) {
            var $parameterControl = $(parameterControl);
            $parameterControl.on('click', function () {
                if ($parameterControl.hasClass('disabled'))
                    return;
                var nextIndex = self.currentIndex[key];
                if ($parameterControl.hasClass('parameter-up')) {
                    nextIndex++;
                } else {
                    nextIndex--;
                }
                if (nextIndex < 0) {
                    nextIndex = 0;
                }
                if (nextIndex === self[key].length) {
                    nextIndex = self[key].length - 1;
                }
                $parameter.find('.parameter-controls').removeClass('disabled');
                if (nextIndex === 0) {
                    $parameter.find('.parameter-down').addClass('disabled');
                }
                if (nextIndex === self[key].length - 1) {
                    $parameter.find('.parameter-up').addClass('disabled');
                }
                self.currentIndex[key] = nextIndex;
                $parameter.find('.parameter-value').html(self[key][nextIndex]);
                self.onChange();
            });
        });
    });

    this.$container.find('.show-change-plan-modal-button').on('click', function () {
        var state = self.getState();
        $.ajax({
            url: Routing.generate('user_pre_change_plan'),
            data: self.getState(),
            method: 'POST'
        })
            .done(function (data, textStatus, jqXHR) {
                var $changePlanModal = $('#changePlanModal');

                $changePlanModal.find('.modal-body').html(jqXHR.responseJSON.changePlanModal);
                $('.plan-id-in-modal').val(state.stripe_plan_id);

                $changePlanModal.modal();
            });
    });
};

Plan.prototype.onChange = function () {
    $.ajax({
        url: Routing.generate('user_get_plan_by_teachers_and_students'),
        method: 'POST',
        data: this.getState()
    }).done(this.onRequestDone.bind(this));
};

Plan.prototype.onRequestDone = function (data) {
    this.$container.find('.plan-price-value').html(data.planPrice);
    this.$container.find('.plan-stripe-id').val(data.stripePlanId);
    this.$container.find('.plan-period-value').html(data.period);
};

Plan.prototype.getState = function () {
    var state = {};
    state.period = this.getPeriod();
    state.planName = this.getPlanName();
    state.numberOfTeachers = this.getNumberOfTeachers();
    state.numberOfStudents = this.getNumberOfStudents();
    state.stripe_plan_id = this.getStripePlanId();
    return state;
};

Plan.prototype.getPeriod = function () {
    return this.$container.find('.plan-period.active').html();
};

Plan.prototype.getPlanName = function () {
    return this.$container.find('.plan-name').html();
};

Plan.prototype.getNumberOfTeachers = function () {
    return this.$container.find('.numberOfTeachers').find('.parameter-value').html();
};

Plan.prototype.getNumberOfStudents = function () {
    return this.$container.find('.studentsInClassroom').find('.parameter-value').html();
};

Plan.prototype.getStripePlanId = function () {
    return this.$container.find('.plan-stripe-id').val();
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
