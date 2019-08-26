export function getMatrixWithoutScaling(matrix) {
    const result = matrix.clone();
    const decomposeObject = result.decompose();

    const {x, y} = decomposeObject.scaling;
    result.scale([1 / x, 1 / y]);

    return result;
}

export function getMatrixWithoutTranslation(matrix) {
    const result = matrix.clone();

    result.tx = 0;
    result.ty = 0;

    return result;
}
