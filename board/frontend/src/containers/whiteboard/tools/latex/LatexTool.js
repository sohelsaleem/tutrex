import React from 'react';
import InteractiveTool from '../InteractiveTool';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';
import LatexEditorDialog from './latexEditor/LatexEditorDialog';

export default class LatexTool extends InteractiveTool {
    state = {
        editorDisplayed: false,
        point: null
    };

    getToolName() {
        return 'latex';
    }

    onMouseDown(event) {
        this.setState({
            editorDisplayed: true,
            point: event.point
        });
    }

    render() {
        if (!this.state.editorDisplayed)
            return null;

        return <LatexEditorDialog onCancel={this.handleCloseEditor}
                                  onCommit={this.handleAddLatex}/>;
    }

    handleCloseEditor = () => {
        this.setState({
            editorDisplayed: false
        });
    };

    handleAddLatex = formula => {
        this.sendCommitCommand(formula);

        this.setState({
            editorDisplayed: false,
            point: null
        });
    };

    sendCommitCommand(formula) {
        this.commandBuilder = new DrawCommandBuilder({
            tool: this.getToolName(),
            kind: 'create'
        });

        const command = this.commandBuilder.body(this.formCommandBody(formula))
            .build();

        this.commandCallback(command);
    }

    formCommandBody(formula) {
        return {
            formula,
            point: this.serializePoint(this.state.point)
        };
    }

    getDrawContext(item) {
        return {
            stroke: null,
            fill: null
        };
    }

    setDrawContext(item, {stroke, fill}) {
    }
}
