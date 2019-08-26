import React, {Component, PropTypes} from 'react';
import DocumentLayer from './DocumentLayer';
import SimpleGroundLayer from './SimpleGroundLayer';

export default class GroundLayer extends Component {
    render() {
        if (this.props.type === 'document')
            return this.renderDocumentLayer();

        return this.renderSimpleGroundLayer();
    }

    renderDocumentLayer() {
        return <DocumentLayer {...this.props}/>;
    }

    renderSimpleGroundLayer() {
        return <SimpleGroundLayer {...this.props}/>;
    }
}
