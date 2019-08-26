class CommonUtils {

    range(start, stop, step) {
        if (typeof stop == 'undefined') {
            // one param defined
            stop = start;
            start = 0;
        }

        if (typeof step == 'undefined') {
            step = 1;
        }

        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }

        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }

        return result;
    }

    getYoutubeIdFromLink(youtubeURL) {
        if (!youtubeURL) return null;

        const YOUTUBE_REGEX = /(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
        const matchURLs = youtubeURL.match(YOUTUBE_REGEX);

        return matchURLs && matchURLs.length >= 5 ? matchURLs[4] : null;
    }

}

export default new CommonUtils();
