import {connect} from 'react-redux';

import {changeStrokeFill} from 'actions/whiteboard';

import StrokeFillPanel from 'components/whiteboard/StrokeFillPanel';

const mapStateToProps = state => {
    return {
        strokeColor: state.whiteboard.stroke.color,
        strokeWidth: state.whiteboard.stroke.width,
        fillColor: state.whiteboard.fill.color
    };
};

const mapDispatchToProps = {
    onChange: handleChangeStrokeFill
};

function handleChangeStrokeFill(strokeColor, strokeWidth, fillColor) {
    const stroke = {
        color: strokeColor,
        width: strokeWidth
    };
    const fill = {
        color: fillColor
    };

    return changeStrokeFill(stroke, fill);
}

export default connect(mapStateToProps, mapDispatchToProps)(StrokeFillPanel);
