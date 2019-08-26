import React, {Component, PropTypes} from 'react';

import InteractiveTool from '../InteractiveTool';
import ScalingUtils from 'domain/whiteboard/ScalingUtils';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';
import {findItem} from  'domain/whiteboard/paperChildrenSearch';
import {getMatrixWithoutTranslation} from  'domain/whiteboard/matrixDecomposition';

import TextEditor from './textEditor/TextEditor';
import makeCssColor from '../makeCssColor';
import makePaperColor from 'components/whiteboard/shapes/makePaperColor';
import {getFontHeightByStrokeWidth, getStrokeWidthByFontHeight} from './textHeight';

export default class TextTool extends InteractiveTool {

    state = {
        commandBuilder: null,
        startPoint: null,
        text: '',
        fontSize: 0,
        textItem: null,
        editorVisible: false,
        updating: false
    };

    onMouseDown(event) {
        if (this.isEditorMode())
            return;

        this.goToEditorMode(event.point);
    }

    isEditorMode() {
        return Boolean(this.state.startPoint);
    }

    goToEditorMode(point) {
        const textItem = this.findTextItemBelow(point);
        const nextState = this.formEditorModeState(textItem, point);
        this.setState(nextState, this.showTextEditor);
    }

    makeCommandBuilder(relatedCommandId) {
        const commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: relatedCommandId ? 'update' : 'create'
        });
        return commandBuilder.relatedCommandId(relatedCommandId);
    }

    findTextItemBelow(point) {
        const {paper} = this.props;

        return findItem(paper)
            .nearPoint(point)
            .filter(item => item.tool === this.getToolName())
            .getLast();
    }

    formEditorModeState(textItem, point) {
        if (!textItem)
            return this.formNewEditorModeState(point);

        return this.formExistEditorModeState(textItem);
    }

    formNewEditorModeState(point) {
        return {
            updating: false,
            startPoint: point,
            text: '',
            fontSize: this.getFontHeight(),
            commandBuilder: this.makeCommandBuilder()
        };
    }

    getFontHeight() {
        const {stroke} = this.props;
        return getFontHeightByStrokeWidth(stroke.width);
    }

    formExistEditorModeState(textItem) {
        const fontSize = parseFloat(textItem.fontSize);

        return {
            updating: true,
            startPoint: textItem.point,
            text: textItem.content,
            fontSize,
            textItem,
            commandBuilder: this.makeCommandBuilder(textItem.commandId)
        };
    }

    showTextEditor = () => {
        setTimeout(this._showTextEditor, 0);
    };

    _showTextEditor = () => {
        this.setState({
            editorVisible: true
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const {editorVisible} = this.state;

        const textItem = this.state.textItem || prevState.textItem;
        if (textItem)
            textItem.visible = !editorVisible;
    }

    render() {
        if (!this.state.editorVisible)
            return null;

        const {text, fontSize} = this.state;

        const {left, top} = this.getTextPosition();
        const color = this.getTextColor();
        const matrix = this.getEditorMatrix();

        return <TextEditor left={left}
                           top={top}
                           fontSize={fontSize}
                           color={color}
                           value={text}
                           matrix={matrix}
                           onChange={this.handleChangeText}
                           onCommit={this.handleFinishTextCreation}/>;
    }

    getTextPosition() {
        const {textItem} = this.state;
        const {paper} = this.props;

        const fakeText = textItem ? textItem.clone() : this.createFakeText();

        const angle = fakeText.matrix.rotation;
        fakeText.rotate(-angle, fakeText.bounds.center);

        const viewMatrixDeformation = getMatrixWithoutTranslation(paper.view.matrix);
        fakeText.matrix.prepend(viewMatrixDeformation);

        const {topLeft, center} = fakeText.bounds;
        const divPosition = topLeft.rotate(angle, center);

        fakeText.remove();

        return {
            left: divPosition.x,
            top: divPosition.y
        };
    }

    createFakeText() {
        const {startPoint, fontSize} = this.state;
        const {paper} = this.props;

        const fakeText = new paper.PointText(startPoint);
        fakeText.content = 'M';
        fakeText.strokeWidth = 0;
        fakeText.fontSize = fontSize;
        return fakeText;
    }

    getTextColor() {
        const {textItem} = this.state;

        if (textItem)
            return makeCssColor(textItem.strokeColor);

        return this.props.stroke.color;
    }

    getEditorMatrix() {
        const {paper} = this.props;

        const matrix = this.getEditorStandaloneMatrix();
        return matrix.prepended(paper.view.matrix.clone());
    }

    getEditorStandaloneMatrix() {
        const {textItem} = this.state;
        const {paper} = this.props;

        if (textItem)
            return getMatrixWithoutTranslation(textItem.matrix);

        return new paper.Matrix();
    }

    handleChangeText = text => {
        this.setState({text});
    };

    handleFinishTextCreation = () => {
        const {text} = this.state;

        if (text.trim().length > 0)
            this.sendCommitCommand();

        this.setState({
            commandId: null,
            startPoint: null,
            textItem: null,
            editorVisible: false
        });
    };

    sendCommitCommand () {
        const command = this.state.commandBuilder.body(this.formCommandBody())
            .commit()
            .build();

        this.commandCallback(command);
    }

    formCommandBody() {
        const {startPoint, text, fontSize} = this.state;
        const {stroke} = this.props;

        return {
            point: this.serializePoint(startPoint),
            text,
            fontSize: ScalingUtils.serializeCoordinateY(fontSize),
            color: stroke.color
        };
    }

    getDrawContext(item) {
        const fontSize = parseFloat(item.fontSize);
        const strokeWidth = getStrokeWidthByFontHeight(fontSize);

        const stroke = {
            color: makeCssColor(item.strokeColor),
            width: strokeWidth
        };
        const fill = null;

        return {stroke, fill};
    }

    setDrawContext(item, {stroke, fill}) {
        item.strokeColor = makePaperColor(stroke.color);
        item.fillColor = makePaperColor(stroke.color);
        item.fontSize = getFontHeightByStrokeWidth(stroke.width);
    }

    getToolName() {
        return 'text';
    }
}
