$(function () {

    bindUI();
    var folderId = $('#parent_id').length > 0 ? $('#parent_id').val() : null;
    var maxUploadSize = $('.storage-container').data('upload-limit');
    var storageController = new StorageController(folderId, maxUploadSize);
    initStorageParameters();


    function initStorageParameters() {
        var $container = $('.storage-parameters-container');
        var $progress = $container.find('.progress-value');
        var $total = $container.find('.storage-parameters-total');
        var $used = $container.find('.storage-parameters-used');
        $total.text(STORAGE_PARAMETERS.total);
        $used.text(STORAGE_PARAMETERS.used);
        var pct = (STORAGE_PARAMETERS.usedRaw / STORAGE_PARAMETERS.totalRaw) * 100;
        $progress.css({width: pct + '%'});
        $container.removeClass('hidden');
        if (STORAGE_PARAMETERS.totalRaw > STORAGE_PARAMETERS.usedRaw) {
            $('.subscription-error').addClass('hidden');
        }
    }

    function bindUI() {
        bindCreateFolderUI();
        bindUploadFileUI();
        bindContentUI();
    }

    function bindCreateFolderUI() {
        var $formGroup = $('#createFolderModal').find('.form-group');
        $('.create-folder').on('click', function () {
            $('#createFolderModal').modal('show');
        });

        $('.create-folder-button').on('click', function () {
            hideError($formGroup);
            var name = $('#folder_name').val();
            var onValidationError = showError.bind(undefined, $formGroup);
            storageController.createFolder(name, {
                onValidationError: onValidationError,
                onSuccess: function (data) {
                    clear();
                    updateUI(data);
                }
            });
        });

        $('.create-folder-cancel-button').on('click', function () {
            clear();
        });

        function clear() {
            $('#createFolderModal').modal('hide');
            $('#folder_name').val('');
            hideError($formGroup);
        }
    }

    function bindUploadFileUI() {
        var $input = $('.upload-input');
        $('.upload-button').on('click', function () {
            clearFileInputField($input);
            hideFileErrors();
            $input.click();
        });

        $input.on('change', function () {
            if (!this.files || !this.files.length)
                return;
            var _self = this;
            storageController.uploadFiles(this.files, {
                onValidationError: showFileClientError,
                onSuccess: function (data) {
                    hideProcessing();
                    updateUI(data);
                    removeWindowAlert();
                },
                onStartUploading: function () {
                    showUploadModal(_self.files);
                    addWindowAlert();
                },
                onError: function (error) {
                    hideUploadModal();
                    hideProcessing();
                    showFileServerError(error);
                    removeWindowAlert();
                },
                onProgress: onUploadProgress
            });
        });

        $('.upload-cancel-button').on('click', function () {
            storageController.cancelUploading();
        });
    }

    function clearFileInputField($input) {
        try {
            $input.val('');
            $input.val('x');
            $input.val(null);
        } catch (e) {
        }
    }

    function bindContentUI() {
        bindRenameItemUI();
        bindDeleteItemUI();
        bindRowClick();
        bindDownloadClick();
        initDnd();
    }

    function bindRowClick() {
        $('.content-row').on('click', function (e) {
            if ($(e.target).hasClass('more-button'))
                return;
            var href = $(e.target).parents('.content-row').attr('data-href') || $(e.target).attr('data-href');
            if (!href)
                return;
            window.location.href = href;
        });
    }

    function bindDownloadClick() {
        $('.download-link').on('click', function (e) {
            if (Number(STORAGE_PARAMETERS.totalRaw) < Number(STORAGE_PARAMETERS.usedRaw)) {
                $('.subscription-error').removeClass('hidden');
                e.preventDefault();
                return false;
            }
        });
    }

    function bindRenameItemUI() {
        $('.edit-name-button').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $modal = $('#renameModal');
            var $formGroup = $modal.find('.form-group');
            hideError($formGroup);

            var $row = $(e.target).parents('.content-row');
            var $resultContainer = $(e.target).parent().find('.item-name');
            var itemType = $row.find('.content-type').val();
            var itemId = $row.find('.content-id').val();


            $modal.find('.item-type').text(itemType);
            $modal.find('.item-name')
                .text($resultContainer.text())
                .val($resultContainer.text());
            $modal.modal('show');

            var $renameButton = $('.rename-item-button');

            $renameButton.off('click');
            $renameButton.on('click', onRename.bind(this, itemId, $row, $formGroup));
        });


        function onRename(itemId, $row, $formGroup) {
            hideError($formGroup);
            var name = $('#item_name').val();
            var onValidationError = showError.bind(undefined, $formGroup);
            storageController.renameItem(itemId, name, {
                onValidationError: onValidationError,
                onSuccess: function (data) {
                    $('#renameModal').modal('hide');
                    $row.find('.item-name').text(name);
                    if (data.isFolder)
                        $row.attr('data-href', data.itemUrl);
                }
            });
        }
    }

    function bindDeleteItemUI() {
        $('.delete-item').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $modal = $('#deleteModal');

            var $row = $(e.target).parents('.content-row');
            var $itemNameContainer = $row.find('.item-name');
            var itemType = $row.find('.content-type').val();
            var itemId = $row.find('.content-id').val();


            $modal.find('.item-type').text(itemType);
            if (itemType === 'folder')
                $('.item-folder-note').removeClass('hidden');
            else
                $('.item-folder-note').addClass('hidden');
            $modal.find('.item-name')
                .text($itemNameContainer.text());
            $modal.modal('show');

            var $deleteButton = $('.delete-item-button');

            $deleteButton.off('click');
            $deleteButton.on('click', onDelete.bind(this, itemId, $row));
        });


        function onDelete(itemId, $row) {
            showProcessing();
            $('#deleteModal').modal('hide');
            addWindowAlert();
            storageController.deleteItem(itemId, {
                onSuccess: function (data) {
                    hideProcessing();
                    removeWindowAlert();
                    $row.remove();
                    STORAGE_PARAMETERS.used = data.storage.used;
                    STORAGE_PARAMETERS.total = data.storage.total;
                    STORAGE_PARAMETERS.usedRaw = data.storage.usedRaw;
                    STORAGE_PARAMETERS.totalRaw = data.storage.totalRaw;
                    initStorageParameters();
                }
            });
        }
    }

    function initDnd() {
        var holder = document.getElementById('dropzone-holder');
        var $content = $('.content-table');
        holder.ondragover = function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#dropzone').removeClass('hidden');
            $content.addClass('blurred');
            hideFileErrors();
            return false;
        };


        holder.ondragleave = function (e) {
            if (e.target !== holder)
                return;
            console.log(e.target);
            e.preventDefault();
            e.stopPropagation();
            $('#dropzone').addClass('hidden');
            $content.removeClass('blurred');
            return false;
        };
        holder.ondrop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#dropzone').addClass('hidden');
            $content.removeClass('blurred');

            if (!e.dataTransfer.files || !e.dataTransfer.files.length)
                return;

            storageController.uploadFiles(e.dataTransfer.files, {
                onValidationError: showFileClientError,
                onSuccess: function (data) {
                    hideProcessing();
                    updateUI(data);
                    removeWindowAlert();
                },
                onStartUploading: function () {
                    showUploadModal(e.dataTransfer.files);
                    addWindowAlert();
                },
                onError: function (error) {
                    hideUploadModal();
                    hideProcessing();
                    showFileServerError(error);
                    removeWindowAlert();
                },
                onProgress: onUploadProgress
            });
        };
    }

    function updateUI(data) {
        if (!data)
            return;
        $('.content-wrapper').html(data.content);
        bindContentUI();
        resizeSidebar();
        initStorageParameters();
    }

    function showError($formGroup) {
        $formGroup.addClass('has-error');
        $formGroup.find('.help-block').removeClass('hidden');
    }

    function hideError($formGroup) {
        $formGroup.removeClass('has-error');
        $formGroup.find('.help-block').addClass('hidden');
    }

    function showFileClientError() {
        $('.file-error').removeClass('hidden');
    }

    function showFileServerError(error) {
        if (error.statusText === 'abort')
            return;
        $('.storage-error').removeClass('hidden');
    }

    function hideFileErrors() {
        $('.upload-errors>p').addClass('hidden');
    }

    function showUploadModal(files) {
        var $modal = $('#progressModal');
        var uploadText = files.length > 1 ? files.length + ' files' : files[0].name;
        $modal.find('.upload-body').text(uploadText);
        $modal.find('.progress-value').css({width: '0'});
        $modal.modal('show');
    }

    function hideUploadModal() {
        $('#progressModal').modal('hide');
    }

    function onUploadProgress(e) {
        var $progress = $('#progressModal').find('.progress-value');
        if (!e.lengthComputable)
            return;
        var pct = (e.loaded / e.total) * 100;
        $progress.css({width: pct + '%'});

        if (pct >= 100) {
            hideUploadModal();
            showProcessing();
        }
    }

    function showProcessing() {
        $('#processingModal').modal('show');
    }

    function hideProcessing() {
        $('#processingModal').modal('hide');
    }
});

function addWindowAlert() {
    window.onbeforeunload = function () {
        return "Data will be lost if you leave the page, are you sure?";
    };
}

function removeWindowAlert() {
    window.onbeforeunload = function () {
        return null;
    };
}
