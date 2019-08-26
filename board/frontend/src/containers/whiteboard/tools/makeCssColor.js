export default function (paperColor) {
    if (!paperColor)
        return 'transparent';

    return paperColor.toCSS();
}
