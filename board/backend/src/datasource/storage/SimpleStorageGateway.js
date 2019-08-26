module.exports = {
    getList,
    isAvailable
};


function* getList(user, folderId) {
    return {
        status: 'success',
        content: [
            {
                download_url: "https://tutrex.s3.amazonaws.com/dev/316/b17f33c2a7b1baefc3da96c3a73a8a61.pdf",
                file_path: "316/b17f33c2a7b1baefc3da96c3a73a8a61.pdf",
                id: 4,
                name: "EDUTraining Information.pdf",
                parent_id: null,
                type: 2
            },
            {
                download_url: "https://tutrex.s3.amazonaws.com/dev/316/01c134c619c13d4209d4aa1fcaa79452.gif",
                file_path: "316/01c134c619c13d4209d4aa1fcaa79452.gif",
                id: 2,
                name: "29f1b0baf8949790efdf1cdefaa8dde8.gif",
                parent_id: null,
                type: 2
            }
        ]
    };
}

function* isAvailable(user, itemId) {
    return true;
}
