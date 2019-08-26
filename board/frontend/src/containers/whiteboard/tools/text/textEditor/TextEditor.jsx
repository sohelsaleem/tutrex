import React, {Component, PropTypes} from 'react';
import ContentEditableEngine from './ContentEditableEngine';

import styles from './TextEditor.scss';

const onClickOutside = require('react-onclickoutside');

class TextEditor extends Component {
    static propTypes = {
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        fontSize: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        matrix: PropTypes.object.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onCommit: PropTypes.func.isRequired
    };

    state = {
        parentWidth: 0,
        parentHeight: 0
    };

    componentDidMount() {
        this.refs.editor.focus();

        const {parentElement} = this.refs.container;
        this.setState({
            parentWidth: parentElement.clientWidth,
            parentHeight: parentElement.clientHeight
        })
    }

    render() {
        const {left, top, fontSize, color, value, onCommit} = this.props;
        const maxWidth = this.getMaxWidth();

        const style = {
            left: `${left}px`,
            top: `${top}px`,
            maxWidth: `${maxWidth}px`,
            fontSize: `${fontSize}px`,
            minHeight: `${fontSize}px`,
            color,
            transform: this.getCssMatrix(),
            transformOrigin: 'left top'
        };

        return (
            <div ref='container'
                 className={styles.popup}
                 style={style}>
                <ContentEditableEngine ref='editor'
                                       value={value}
                                       onChange={this.handleChangeText}
                                       onEnter={onCommit}/>
            </div>
        );
    }

    getMaxWidth() {
        const {left, top, matrix} = this.props;
        const {parentWidth, parentHeight} = this.state;
        const angle = Math.PI / 180 * matrix.rotation;

        const availWidth1 = parentWidth - left;
        const availHeight1 = parentHeight - top;

        const availWidth2 = left;
        const availHeight2 = top;

        const availWidth = Math.cos(angle) >= 0 ? availWidth1 : availWidth2;
        const availHeight = Math.sin(angle) >= 0 ? availHeight1 : availHeight2;

        return Math.min(Math.abs(availWidth / Math.cos(angle)), Math.abs(availHeight / Math.sin(angle)));
    }

    getCssMatrix() {
        const {matrix} = this.props;
        const values = matrix.values;

        return `matrix(${values})`;
    }

    handleChangeText = value => {
        this.props.onChange(value);
    };

    handleClickOutside = event => {
        this.props.onCommit();
    };
}

export default onClickOutside(TextEditor);
