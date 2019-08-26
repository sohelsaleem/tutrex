import React, {Component, PropTypes} from 'react';
import style from './MathSymbolPicker.scss';
import classNames from 'classnames';

import MathSymbolTable from './MathSymbolTable';

import mathSymbols from './mathSymbols';

export default class MathSymbolPicker extends Component {
    static propTypes = {
        onSelect: PropTypes.func.isRequired
    };

    state = {
        tabIndex: 0
    };

    render() {
        return (
            <div className={style.picker}>
                {this.renderTabList()}
                {this.renderCurrentTable()}
            </div>
        );
    }

    renderTabList() {
        const tabList = Object.keys(mathSymbols);

        return (
            <div className={style.tabContainer}>
                {tabList.map(this.renderTab)}
            </div>
        )
    }

    renderTab = (tab, index) => {
        const className = classNames(style.tab, {
            [style.activeTab]: index === this.state.tabIndex
        });

        return (
            <div key={index}
                 className={className}
                 onClick={this.handleSelectTab(index)}>
                {tab}
            </div>
        );
    };

    handleSelectTab = tabIndex => () => {
        this.setState({
            tabIndex
        });
    };

    renderCurrentTable() {
        const {onSelect} = this.props;
        const {tabIndex} = this.state;

        const tabKey = Object.keys(mathSymbols)[tabIndex];
        const symbols = mathSymbols[tabKey];

        return <MathSymbolTable symbols={symbols}
                                onSelect={onSelect}/>;
    }
}
