import _ from 'lodash';

const registry = [
    {
        shape: require('../shapes/virtual/TransformShape'),
        tool: require('containers/whiteboard/tools/select/SelectTool'),
        icon: require('./svgTools/SelectTool'),
        cursor: require('assets/tools/cursor_select.png'),
        title: 'Select tool'
    },
    {
        shape: require('../shapes/Pencil'),
        tool: require('containers/whiteboard/tools/PencilTool'),
        icon: require('./svgTools/PencilTool'),
        cursor: require('assets/tools/cursor_pencil.png'),
        title: 'Pencil tool'
    },
    {
        macro: true,
        children: [
            {
                shape: require('./../shapes/Line'),
                tool: require('containers/whiteboard/tools/LineTool'),
                icon: require('./svgTools/LineTool'),
                cursor: require('assets/tools/cursor_geometric.png'),
                title: 'Line tool'
            },
            {
                shape: require('./../shapes/Arrow'),
                tool: require('containers/whiteboard/tools/ArrowTool'),
                icon: require('./svgTools/ArrowTool'),
                cursor: require('assets/tools/cursor_geometric.png'),
                title: 'Arrow tool'
            }
        ]
    },
    {
        macro: true,
        children: [
            {
                shape: require('./../shapes/Rectangle'),
                tool: require('containers/whiteboard/tools/RectangleTool'),
                icon: require('./svgTools/RectangleTool'),
                cursor: require('assets/tools/cursor_geometric.png'),
                title: 'Rectangle tool'
            },
            {
                shape: require('./../shapes/Circle'),
                tool: require('containers/whiteboard/tools/CircleTool'),
                icon: require('./svgTools/CircleTool'),
                cursor: require('assets/tools/cursor_geometric.png'),
                title: 'Circle tool'
            },
            {
                shape: require('./../shapes/Triangle'),
                tool: require('containers/whiteboard/tools/TriangleTool'),
                icon: require('./svgTools/TriangleTool'),
                cursor: require('assets/tools/cursor_geometric.png'),
                title: 'Triangle tool'
            }
        ]
    },
    {
        shape: require('./../shapes/Text'),
        updateShape: require('./../shapes/virtual/EditedText'),
        tool: require('containers/whiteboard/tools/text/TextTool'),
        icon: require('./svgTools/TextTool'),
        cursor: require('assets/tools/cursor_text.png'),
        title: 'Text tool'
    },
    {
        shape: require('./../shapes/Latex'),
        tool: require('containers/whiteboard/tools/latex/LatexTool'),
        icon: require('./svgTools/LatexTool'),
        cursor: require('assets/tools/cursor_latex.png'),
        title: 'Latex tool'
    },
    {
        shape: require('../shapes/virtual/DeletedShape'),
        tool: require('containers/whiteboard/tools/EraserTool'),
        icon: require('./svgTools/EraserTool'),
        cursor: require('assets/tools/cursor_eraser.png'),
        title: 'Eraser tool'
    },
    {
        shape: require('../shapes/Image'),
        tool: require('containers/whiteboard/tools/ImageTool')
    }

];

const namedTools = {};

expandEs6Modules(registry);
addNames(registry);

function expandEs6Modules(list) {
    list.forEach(description => {
        if (description.macro)
            return expandEs6Modules(description.children);

        if(description.icon){
            description.icon = expandEs6DefaultClass(description.icon);
        }

        description.tool = expandEs6DefaultClass(description.tool);
        description.shape = expandEs6DefaultClass(description.shape);
        if (description.updateShape)
            description.updateShape = expandEs6DefaultClass(description.updateShape);
    })
}

function expandEs6DefaultClass(module) {
    if (!module.__esModule)
        return module;

    return module.default;
}

function addNames(list) {
    list.forEach(description => {
        if (description.macro)
            return addNames(description.children);

        const Tool = description.tool;
        description.name = new Tool({}).getToolName();

        namedTools[description.name] = Tool;
    });
}

export default registry;

export function createToolByName(name) {
    const Tool = namedTools[name];
    return new Tool({});
}

export function getFullToolList() {
    return getToolList(registry);
}

function getToolList(descriptionList) {
    return _.chain(descriptionList)
        .map(description => {
            if (description.macro)
                return getToolList(description.children);

            return description;
        })
        .flatten()
        .value();
}
