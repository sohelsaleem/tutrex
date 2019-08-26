export const REQUEST_VERSION = 'version/REQUEST_VERSION';
export const REQUEST_VERSION_SUCCESS = 'room/REQUEST_VERSION_SUCCESS';
export const REQUEST_VERSION_FAIL = 'room/REQUEST_VERSION_FAIL';

export function requestVersion() {
    return {
        types: [REQUEST_VERSION, REQUEST_VERSION_SUCCESS, REQUEST_VERSION_FAIL],
        socketRequest: {
            event: 'version:request',
            body: {}
        }
    };
}
