function StorageController(parentId, maxUploadSize) {
    this.parentId = parentId;
    this.maxUploadSize = maxUploadSize;
    this.xhr = null;
}

StorageController.prototype.createFolder = function (name, callbacks) {
    if (!validateItemName(name)) {
        return callbacks.onValidationError && callbacks.onValidationError();
    }
    $.ajax({
        url: Routing.generate('storage_create_folder'),
        method: 'POST',
        data: {
            parentId: this.parentId,
            name: name
        },
        success: callbacks.onSuccess ? callbacks.onSuccess : null,
        error: callbacks.onError ? callbacks.onError : null
    });
};

StorageController.prototype.renameItem = function (itemId, name, callbacks) {
    if (!validateItemName(name)) {
        return callbacks.onValidationError && callbacks.onValidationError();
    }
    $.ajax({
        url: Routing.generate('storage_rename_item', {id: itemId}),
        method: 'PUT',
        data: {
            name: name
        },
        success: callbacks.onSuccess ? callbacks.onSuccess : null,
        error: callbacks.onError ? callbacks.onError : null
    });
};

function validateItemName(name) {
    return name.trim().length !== 0;
}


StorageController.prototype.deleteItem = function (itemId, callbacks) {
    $.ajax({
        url: Routing.generate('storage_delete_item', {id: itemId}),
        method: 'DELETE',
        success: callbacks.onSuccess ? callbacks.onSuccess : null,
        error: callbacks.onError ? callbacks.onError : null
    });
};


StorageController.prototype.uploadFiles = function (files, callbacks) {
    if (!validateFiles(files, this.maxUploadSize))
        return callbacks.onValidationError();
    callbacks.onStartUploading();
    var fd = new FormData();
    Array.from(files).forEach(function (file, index) {
        fd.append('file[' + index + ']', file);
    });
    fd.append('parentId', this.parentId);
    var _self = this;
    this.xhr = $.ajax({
        url: Routing.generate('storage_create_item'),
        method: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success: function (data) {
            _self.xhr = null;
            callbacks.onSuccess(data);
        },
        error: function (error) {
            _self.xhr = null;
            callbacks.onError(error);
        },
        progress: callbacks.onProgress
    });
};

function validateFiles(files, maxUploadSize) {
    var SUPPORTED_FORMATS = ['ppt', 'pptx', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'mp4', 'mp3', 'odt', 'ods', 'odp', 'txt', 'csv', 'gif', 'svg'];
    var MAX_FILE_SIZE = 1024 * 1024 * maxUploadSize;

    var validFiles = Array.from(files).filter(function (file) {
        var tmp = file.name.split('.');
        var fileFormat = tmp[tmp.length - 1].toLowerCase();
        if (SUPPORTED_FORMATS.indexOf(fileFormat) < 0)
            return false;
        return file.size < MAX_FILE_SIZE;
    });
    return validFiles.length === files.length;
}

StorageController.prototype.cancelUploading = function () {
    if (this.xhr) {
        this.xhr.abort();
        this.xhr = null;
    }
};
