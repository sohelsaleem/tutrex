import * as queryString from 'query-string';
import uuid from 'node-uuid';

const tabId = uuid.v4();

export default function () {
    const GETParams = queryString.parse(window.location.search);
    const token = GETParams['token'];

    return {token, tabId};
}
