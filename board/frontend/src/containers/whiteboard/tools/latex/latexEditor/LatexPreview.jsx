import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import katex from 'katex';

import style from './LatexPreview.scss';
import 'katex/dist/katex.css';

export default class LatexPreview extends Component {
    static propTypes = {
        formula: PropTypes.string.isRequired,
        className: PropTypes.any,
        onChangeErrorPresence: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            lastRightFormula: ''
        };
    }

    componentDidMount() {
        this.saveNewFormulaOrDispatchError(this.props.formula);
    }

    saveNewFormulaOrDispatchError(formula) {
        const syntaxError = this.getFormulaSyntaxError(formula);

        if (!syntaxError) {
            this.setState({
                lastRightFormula: formula
            });
        }

        this.props.onChangeErrorPresence(syntaxError);
    }

    getFormulaSyntaxError(formula) {
        try {
            this.transformLatexToHtmlMarkup(formula);
            return null;
        }
        catch (syntaxError) {
            return syntaxError;
        }
    }

    transformLatexToHtmlMarkup(formula) {
        return katex.renderToString(formula);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.formula !== this.props.formula)
            this.saveNewFormulaOrDispatchError(nextProps.formula);
    }

    render() {
        const {formula, className} = this.props;
        const {lastRightFormula} = this.state;

        const isSyntaxError = lastRightFormula !== formula;

        const containerClass = classNames(className, {
            [style.syntaxError]: isSyntaxError
        });

        const texHtml = this.transformLatexToHtmlMarkup(lastRightFormula);

        return (
            <div className={containerClass}
                 dangerouslySetInnerHTML={{__html: texHtml}}>
            </div>
        );
    }
}
