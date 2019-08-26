export function pushDrawContext(state, action) {
    const {stroke, fill} = action;

    return {
        ...state,
        stroke: stroke || state.stroke,
        fill: fill || state.fill,
        selectToolDrawContext: {
            stroke: state.stroke,
            fill: state.fill
        }
    };
}

export function popDrawContext(state) {
    const {stroke, fill} = state.selectToolDrawContext;

    return {
        ...state,
        stroke,
        fill,
        selectToolDrawContext: {
            stroke: null,
            fill: null
        }
    };
}
