'use strict';

const UserHelper = require('./helpers/UserHelper');
const DocumentUploader = require('../domain/room/upload/DocumentUploader');
const FileUploader = require('../domain/room/upload/FileUploader');
const uploadSessionsTable = require('../domain/room/upload/UploadSessionsTable');
const StorageGateway = require('../datasource/storage/StorageGatewayFactory')();
const fileTypes = require('../domain/room/upload/uploadedFileTypes');

module.exports = function (listenMessage) {
    listenMessage('upload:document', uploadDocument);
    listenMessage('upload:document:cancel', cancelUploading);
    listenMessage('upload:image', uploadImage);
    listenMessage('upload:image:cancel', cancelUploading);
    listenMessage('upload:file', uploadFile);
    listenMessage('upload:file:cancel', cancelUploading);
    listenMessage('room:documents:list', getDocumentsList);
    listenMessage('storage:list', getStorageList);
    listenMessage('storage:upload:image', uploadImageFromStorage);
    listenMessage('storage:upload:document', uploadDocumentFromStorage);
    listenMessage('storage:upload:file', uploadFileFromStorage);
    listenMessage('storage:available', isStorageItemAvailable);
};

function* uploadDocument(client, message, responseChannel) {
    const requestId = message.requestId;
    const documentStream = message.stream;
    const documentName = message.name;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const documentUploader = new DocumentUploader(room, documentName);
    uploadSessionsTable.put(requestId, documentUploader);

    documentUploader.upload(documentStream)
        .once('finish', documentURL => {
            room.getWhiteboardHistory()
                .addDocument(documentURL, user);
            room.addDocumentUrlAndName(documentURL, documentName);
            responseChannel.sendAnswer({documentURL});
        })
        .once('cancel', error => responseChannel.sendAnswer({cancelled: true}))
        .once('error', error => responseChannel.sendError(501, error.message))
        .once('end', () => {
            documentUploader.removeAllListeners();
            uploadSessionsTable.remove(requestId);
        });
}

function* cancelUploading(client, message) {
    const requestId = message.requestId;
    const uploadSession = uploadSessionsTable.find(requestId);

    if (!uploadSession)
        return;

    uploadSession.cancel();
}

function* uploadImage(client, message, responseChannel) {
    yield upload(client, message, responseChannel, fileTypes.IMAGE);
}

function* uploadFile(client, message, responseChannel) {
    yield upload(client, message, responseChannel, fileTypes.FILE);
}

function* upload(client, message, responseChannel, type) {
    const requestId = message.requestId;
    const fileStream = message.stream;
    const fileName = message.name;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const fileUploader = new FileUploader(room, fileName, type);
    uploadSessionsTable.put(requestId, fileUploader);

    fileUploader.upload(fileStream)
        .once('finish', fileURL => {
            const isImage = type === fileTypes.IMAGE;
            const response = isImage ? {imageURL: fileURL} : {fileURL};
            responseChannel.sendAnswer(response);
        })
        .once('cancel', error => responseChannel.sendAnswer({cancelled: true}))
        .once('error', error => responseChannel.sendError(501, error.message))
        .once('end', () => {
            fileUploader.removeAllListeners();
            uploadSessionsTable.remove(requestId);
        });
}

function* getDocumentsList(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const documentsList = room.getDocumentsList();

    responseChannel.sendAnswer(documentsList);
}

function* getStorageList(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const folderId = message.folderId;

    const list = yield StorageGateway.getList(userHelper.getUser(), folderId);
    responseChannel.sendAnswer(list);
}

function* uploadImageFromStorage(client, message, responseChannel) {
    const requestId = message.requestId;
    const imageLink = message.link;
    const imageName = message.name;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const imageUploader = new FileUploader(room, imageName, fileTypes.IMAGE);
    uploadSessionsTable.put(requestId, imageUploader);

    imageUploader.upload(imageLink, true)
        .once('finish', imageURL => {
            responseChannel.sendAnswer({imageURL});
        })
        .once('cancel', error => responseChannel.sendAnswer({cancelled: true}))
        .once('error', error => responseChannel.sendError(501, error.message))
        .once('end', () => {
            imageUploader.removeAllListeners();
            uploadSessionsTable.remove(requestId);
        });
}


function* uploadDocumentFromStorage(client, message, responseChannel) {
    const requestId = message.requestId;
    const documentLink = message.link;
    const documentName = message.name;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const documentUploader = new DocumentUploader(room, documentName);
    uploadSessionsTable.put(requestId, documentUploader);

    documentUploader.upload(documentLink, true)
        .once('finish', documentURL => {
            room.getWhiteboardHistory()
                .addDocument(documentURL, user);
            room.addDocumentUrlAndName(documentURL, documentName);
            responseChannel.sendAnswer({documentURL});
        })
        .once('cancel', error => responseChannel.sendAnswer({cancelled: true}))
        .once('error', error => responseChannel.sendError(501, error.message))
        .once('end', () => {
            documentUploader.removeAllListeners();
            uploadSessionsTable.remove(requestId);
        });
}

function* isStorageItemAvailable(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const itemId = message.itemId;

    const isAvailable = yield StorageGateway.isAvailable(userHelper.getUser(), itemId);
    if (isAvailable.status === 'error')
        return responseChannel.sendError(501, {message: isAvailable.error});
    responseChannel.sendAnswer(isAvailable);
}

function* uploadFileFromStorage(client, message, responseChannel) {
    const requestId = message.requestId;
    const fileLink = message.link;
    const fileName = message.name;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const fileUploader = new FileUploader(room, fileName);
    uploadSessionsTable.put(requestId, fileUploader);

    fileUploader.upload(fileLink, true)
        .once('finish', fileURL => {
            responseChannel.sendAnswer({fileURL});
        })
        .once('cancel', error => responseChannel.sendAnswer({cancelled: true}))
        .once('error', error => responseChannel.sendError(501, error.message))
        .once('end', () => {
            fileUploader.removeAllListeners();
            uploadSessionsTable.remove(requestId);
        });
}
