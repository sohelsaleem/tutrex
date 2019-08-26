'use strict';

module.exports = {
    makeCallback() {
        let callback;

        const promise = new Promise((resolve, reject) => {
            callback = function (error, result) {
                if (error)
                    return reject(error);

                return resolve(result);
            };
        });

        callback.promise = promise;

        return callback;
    }
};
