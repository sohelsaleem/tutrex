import React, {Component, PropTypes} from 'react';
import RcDialog from 'rc-dialog';
import './index.css';

export default class Dialog extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        closable: PropTypes.bool,
        title: PropTypes.any,
        containerClassName: PropTypes.any,
        dialogClassName: PropTypes.any,
        children: PropTypes.any,
        onClose: PropTypes.func
    };

    static defaultProps = {
        visible: true,
        closable: true
    };

    render() {
        const {
            visible,
            closable,
            title,
            containerClassName,
            dialogClassName,
            children,
            onClose
        } = this.props;

        return (
            <RcDialog visible={visible}
                      title={title}
                      className={dialogClassName}
                      closable={closable}
                      animation='zoom'
                      onClose={onClose}>
                <div className={containerClassName}>
                    {children}
                </div>
            </RcDialog>
        );
    }
}
