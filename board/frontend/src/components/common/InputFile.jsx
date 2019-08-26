import React, {Component, PropTypes} from 'react';

export default class InputFile extends Component {
    static propTypes = {
        selected: PropTypes.bool,
        accept: PropTypes.string,
        multiple: PropTypes.bool,
        disabled: PropTypes.bool,
        onCancelSelection: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        accept: '*/*'
    };

    componentDidMount() {
        if (this.props.selected)
            this.select();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.selected && this.props.selected)
            this.select();
    }

    select() {
        this.refs.inputFile.click();
        this.props.onCancelSelection();
    }

    render() {
        const {accept, multiple, disabled} = this.props;

        return (
            <input ref='inputFile'
                   type='file'
                   accept={accept}
                   multiple={multiple}
                   disabled={disabled}
                   hidden='hidden'
                   onChange={this.handleChange}/>
        );
    }

    handleChange = ({target: {files}}) => {
        const {multiple, onSelect} = this.props;

        const result = multiple ? files : files[0];
        onSelect(result);

        this.clearFileInputField();
    };

    clearFileInputField() {
        const input = this.refs.inputFile;
        try {
            input.value = '';
            input.value = 'x';
            input.value = null;
        } catch (e) {
        }
    }
}
