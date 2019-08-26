import React, {Component, PropTypes} from 'react';
import Dialog from 'components/common/Dialog';
import LatexPreview from './LatexPreview';
import MathSymbolPicker from './MathSymbolPicker';
import TextInput from 'components/common/textInput/TextInput';

import classNames from 'classnames';
import style from './LatexEditorDialog.scss';
import customStyle from 'components/ComponentsTheme.scss';

import * as TextInputHelper from 'helpers/TextInputHelper';

export default class LatexEditorDialog extends Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onCommit: PropTypes.func.isRequired
    };

    state = {
        formula: '',
        selectionStart: 0,
        selectionEnd: 0,
        hasError: false
    };

    componentDidMount() {
        this.refs.textInput.focus();
    }

    render() {
        const {onCancel} = this.props;
        const {
            formula,
            selectionStart,
            selectionEnd,
            hasError
        } = this.state;

        const inputClassName = classNames(style.formulaEditor, {
            [style.syntaxError]: hasError
        });

        return (
            <Dialog title='Equation editor'
                    containerClassName={style.latexEditor}
                    onClose={onCancel}>

                <MathSymbolPicker onSelect={this.handleInsertMathSymbol}/>

                <div className={style.previewPanel}>
                    <div>Preview:</div>
                    <LatexPreview className={style.preview}
                                  formula={formula}
                                  onChangeErrorPresence={this.handleLatexError}/>
                </div>

                <div className={style.inputPanel}>
                    <div>Enter TeX expression:</div>

                    <div className={style.inputLine}>
                        <TextInput ref='textInput'
                                   value={formula}
                                   selectionStart={selectionStart}
                                   selectionEnd={selectionEnd}
                                   className={inputClassName}
                                   onChange={this.handleChangeFormula}
                                   onEnter={this.handleCommitFormula}/>
                        <button disabled={hasError || !Boolean(formula)}
                                className={customStyle.buttonBlue}
                                onClick={this.handleCommitFormula}>Add
                        </button>
                    </div>
                </div>
            </Dialog>
        );
    }

    handleInsertMathSymbol = symbolFormula => {
        const {formula, selectionStart: prevSelectionStart, selectionEnd: prevSelectionEnd} = this.state;
        const insertingFormula = ' ' + symbolFormula + ' ';

        const {value, selectionStart, selectionEnd} = TextInputHelper.insertText(insertingFormula, formula, prevSelectionStart, prevSelectionEnd);

        this.setState({
            formula: value,
            selectionStart,
            selectionEnd
        });

        this.refs.textInput.focus();
    };

    handleLatexError = syntaxError => {
        const hasError = Boolean(syntaxError);
        this.setState({
            hasError
        });
    };

    handleChangeFormula = (value, selectionStart, selectionEnd) => {
        this.setState({
            formula: value,
            selectionStart,
            selectionEnd
        });
    };

    handleCommitFormula = () => {
        if (this.state.hasError)
            return;

        this.props.onCommit(this.state.formula);
    };
}
