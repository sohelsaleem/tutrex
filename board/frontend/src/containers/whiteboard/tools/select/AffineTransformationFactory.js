import TranslateTransformation from './TranslateTransformation';
import ScaleTransformation from './ScaleTransformation';
import RotateTransformation from './RotateTransformation';

const transformationClasses = {
    translate: TranslateTransformation,
    scale: ScaleTransformation,
    rotate: RotateTransformation
};

export default function (startPoint, selectedItem, selectionGroup) {
    const type = selectionGroup.getTransformationKind(startPoint);
    const ConcreteTransformation = transformationClasses[type];

    if (!ConcreteTransformation)
        throw new Error('Cannot create affine transformation of type', type);

    return new ConcreteTransformation(startPoint, selectedItem);
}
