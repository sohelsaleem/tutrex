import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export function getFontHeightByStrokeWidth(strokeWidth) {
    return ScalingUtils.deserializeCoordinateY(getUnitFontHeight(strokeWidth));
}

function getUnitFontHeight(strokeWidth) {
    return strokeWidth * 0.025;
}

export function getStrokeWidthByFontHeight(fontHeight) {
    const strokeWidth = getUnitStrokeWidth(ScalingUtils.serializeCoordinateY(fontHeight))
    return Math.round(strokeWidth);
}

function getUnitStrokeWidth(fontHeight) {
    return fontHeight / 0.025;
}
