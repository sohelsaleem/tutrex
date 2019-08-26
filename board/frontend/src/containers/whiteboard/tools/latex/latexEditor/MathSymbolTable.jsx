import React, {PureComponent, PropTypes} from 'react';
import style from './MathSymbolTable.scss';

export default class MathSymbolTable extends PureComponent {
    static propTypes = {
        symbols: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    render() {
        const {symbols} = this.props;

        return (
            <div className={style.mathSymbolTable}>
                {symbols.map(this.renderSymbolButton)}
            </div>
        );
    }

    renderSymbolButton = (symbolDescription, index) => {
        const {onSelect} = this.props;
        const {name, value, icon} = symbolDescription;

        return (
            <div key={index}
                 className={style.symbolButton}
                 onClick={onSelect.bind(null, value)}>
                <img src={icon}
                     alt={name}/>
            </div>
        );
    };
}
