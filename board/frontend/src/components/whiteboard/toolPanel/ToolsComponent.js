import React, {Component, PropTypes} from 'react';
import styles from './ToolsComponent.scss';

import ToolRegistry from './ToolRegistry';
import ToolButton from './ToolButton';
import MacroToolButton from './MacroToolButton';
import ControlToolsPanel from './ControlToolsPanel';

class ToolsComponent extends Component {
    static propTypes = {
        handleSelectTool: PropTypes.func.isRequired,
        canDraw: PropTypes.bool,
        activeTool: PropTypes.string,
        currentBoardId: PropTypes.number.isRequired,
        canUndo: PropTypes.bool.isRequired,
        canRedo: PropTypes.bool.isRequired,
        onUndo: PropTypes.func.isRequired,
        onRedo: PropTypes.func.isRequired,
        onClearBoard: PropTypes.func.isRequired
    };

    render() {
        const {activeTool, canDraw} = this.props;

        if (!canDraw)
            return null;

        return (
            <div className={styles.toolPanel}>
                <div className={styles.toolsContainer}>
                    {ToolRegistry.map(this.renderToolButton)}
                </div>

                <ControlToolsPanel {...this.props}/>
            </div>
        );
    }

    renderToolButton = (toolDescription, index) => {
        if (toolDescription.macro)
            return this.renderMacroToolButton(toolDescription, index);

        return this.renderSimpleToolButton(toolDescription, index);
    };

    renderSimpleToolButton(toolDescription, index) {
        const {name, title, icon} = toolDescription;
        const {activeTool, handleSelectTool} = this.props;

        const selected = name === activeTool;

        if (!title)
            return null;

        return (
            <ToolButton key={index}
                        title={title}
                        icon={icon}
                        selected={selected}
                        onSelect={() => handleSelectTool(name)}/>
        );
    }

    renderMacroToolButton({children}, index) {
        return (
            <MacroToolButton key={index}>
                {children.map(this.renderToolButton)}
            </MacroToolButton>
        );
    }
}

export default ToolsComponent

