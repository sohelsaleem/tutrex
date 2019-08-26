import InteractiveTool from '../InteractiveTool';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';
import SelectionGroup from './SelectionGroup';
import makeAffineTransformation from './AffineTransformationFactory';
import EventListener from 'react-event-listener';
import React from 'react';
import {findItemByCommandId, findItem} from 'domain/whiteboard/paperChildrenSearch';
import {createToolByName} from 'components/whiteboard/toolPanel/ToolRegistry'

export default class SelectTool extends InteractiveTool {

    constructor() {
        super();
        this.selectionGroup = null;
        this.selectedItem = null;

        this.affineTransformation = null;
    }

    getToolName() {
        return 'select';
    }

    onMouseDown(event) {
        if (this.isTransformClick(event))
            return this.handleTransformClick(event);

        this.clearSelection();

        const itemUnderCursor = this.getItemUnderPoint(event.point);

        if (itemUnderCursor)
            this.handleMouseDownOnItem(event, itemUnderCursor);

        this.updateCursor(event);
    }

    isTransformClick(event) {
        if (this.hasNoSelection())
            return false;

        return this.selectionGroup.contains(event.point);
    }

    handleTransformClick(event) {
        this.startAffineTransformation(event.point);
    }

    startAffineTransformation(point) {
        this.affineTransformation = makeAffineTransformation(point, this.selectedItem, this.selectionGroup);
        const commandBuilder = this.affineTransformation.createCommandBuilder(this.getToolName(), this.getSelectedItemCommandId());
        this.produceAndSendCommand(commandBuilder);
    }

    produceAndSendCommand(commandBuilder) {
        const command = commandBuilder.build();
        this.commandCallback(command);
    }

    clearSelection() {
        if (this.selectedItem) {
            this.selectedItem.onChange = null;
            this.selectedItem = null;
        }

        if (this.selectionGroup) {
            this.selectionGroup.remove();
            this.selectionGroup = null;

            this.props.onPopDrawContext();
        }

        this.affineTransformation = null;
    }

    getItemUnderPoint(point) {
        return findItem(this.paper)
            .nearPoint(point)
            .getLast();
    }

    handleMouseDownOnItem(event, itemUnderCursor) {
        this.selectItem(itemUnderCursor);
        this.startAffineTransformation(event.point);
    }

    selectItem(selectedItem) {
        this.selectedItem = selectedItem;
        this.selectedItem.onChange = () => this.updateSelectionGroup();
        this.paper.view.onChange = () => this.updateSelectionGroup();

        this.selectionGroup = new SelectionGroup(this.paper, this.selectedItem);
        this.selectionGroup.draw();

        this.replaceDrawContextWithSelectedItem();
    }

    updateSelectionGroup() {
        if (this.selectionGroup)
            this.selectionGroup.update();
    }

    replaceDrawContextWithSelectedItem() {
        const tool = createToolByName(this.selectedItem.tool);
        const drawContext = tool.getDrawContext(this.selectedItem);

        this.props.onPushDrawContext(drawContext);
    }

    onMouseDrag(event) {
        this.doAffineTransformation(event.point, {isProgress: true});
    }

    doAffineTransformation(endPoint, options) {
        if (this.hasNoSelection())
            return;
        if (!this.affineTransformation)
            return;

        this.sendAffineTransformationCommand(endPoint, options);
    }

    sendAffineTransformationCommand(endPoint, options = {}) {
        const affineCommandBuilder = this.affineTransformation.updateCommandBuilder(endPoint, options);
        this.produceAndSendCommand(affineCommandBuilder);
    }

    onMouseUp(event) {
        this.doAffineTransformation(event.point);
        this.clearTransformationContext();
    }

    clearTransformationContext() {
        this.affineTransformation = null;
    }

    onKeyDown(event) {
        if (event.key === 'delete')
            return this.removeItem();
    }

    removeItem() {
        if (this.hasNoSelection())
            return;

        this.sendRemoveCommand();
        this.clearSelection();
    }

    hasNoSelection() {
        return !this.selectedItem;
    }

    sendRemoveCommand() {
        const commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: 'remove'
        });
        commandBuilder.relatedCommandId(this.getSelectedItemCommandId());

        this.produceAndSendCommand(commandBuilder);
    }

    onMouseMove(event) {
        this.updateCursor(event);
    }

    updateCursor(event) {
        const cursor = this.determineCursor(event.point);
        document.getElementById('canvas').style.cursor = cursor;
    }

    determineCursor(point) {
        const transformationCursor = this.getTransformationCursor(point);

        if (transformationCursor)
            return transformationCursor;

        const item = this.getItemUnderPoint(point);
        return Boolean(item) ? 'pointer' : 'inherit';
    }

    getTransformationCursor(point) {
        if (!this.selectionGroup)
            return null;

        return this.selectionGroup.getCursorKind(point);
    }

    componentDidUpdate(prevProps) {
        if (this.isDrawContextChanged(prevProps) && this.selectedItem) {
            this.sendChangeShapeColorCommand();
            this.updateSelectionGroup();
        }

        if (prevProps.activeToolVersion !== this.props.activeToolVersion)
            this.onDeactivate();
    }

    isDrawContextChanged(prevProps) {
        return this.areNotEqualPaperColors(prevProps.stroke.color, this.props.stroke.color) ||
            prevProps.stroke.width !== this.props.stroke.width ||
            this.areNotEqualPaperColors(prevProps.fill.color, this.props.fill.color);

    }

    areNotEqualPaperColors(value1, value2) {
        const color1 = new this.paper.Color(value1);
        const color2 = new this.paper.Color(value2);
        return !color1.equals(color2);
    }

    sendChangeShapeColorCommand() {
        const {stroke, fill} = this.props;

        const commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: 'drawContext'
        });
        commandBuilder.relatedCommandId(this.getSelectedItemCommandId())
            .body({stroke, fill});

        this.produceAndSendCommand(commandBuilder);
    }

    onDeactivate() {
        this.clearSelection();
    }

    render() {
        return <EventListener target='window'
                              onResize={this.handleWindowResize}/>
    }

    handleWindowResize = () => {
        const scaledSelectedItem = findItemByCommandId(this.paper, this.getSelectedItemCommandId());

        this.clearSelection();
        this.selectItem(scaledSelectedItem);
    };

    getSelectedItemCommandId() {
        return this.selectedItem.commandId;
    }
}
