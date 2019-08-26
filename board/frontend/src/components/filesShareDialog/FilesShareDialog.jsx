import React, {Component, PropTypes} from 'react';

import Dialog from '../common/Dialog';
import FilesAndCheckBoxesTables from './FilesAndCheckBoxesTables';

import customStyle from 'components/ComponentsTheme.scss';
import stylesConfirmDialog from '../common/ConfirmDialog.scss';

export default class FilesShareDialog extends Component {
    static propTypes = {
        yesText: PropTypes.string,
        noText: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onGetDocumentsList: PropTypes.func.isRequired,
        onFinishLesson: PropTypes.func.isRequired,
        gettingDocumentsList: PropTypes.bool,
        documentsList: PropTypes.array
    };

    state = {
        documentsList: null
    };

    componentDidMount() {
        const newDocumentsList = this.getDocumentsListWithOnlyNeedfullProperties(this.props.documentsList);
        this.changeDocumentsList(newDocumentsList);
    }

    getDocumentsListWithOnlyNeedfullProperties(documentsList){
        if(!documentsList) return null;

        const newDocumentsList = documentsList.map( (document) => {
            const newDocument = Object.assign(
                document,
                {checked: false},
                {isViewed: true}
            );
            return newDocument;
        } );
        return newDocumentsList;
    }

    handleOnConfirm() {
        const documentsCheckedList = this.state.documentsList.filter((document) => {
            return document.checked
        });

        this.props.onFinishLesson(documentsCheckedList.map((document) => {
            const newDocument = {
                documentName: document.documentName,
                documentUrl: document.documentUrl
            };
            return newDocument;
        }));
        this.props.onConfirm();
    }

    changeDocumentsList(nextDocumentsList){
        this.setState({
            documentsList: [...nextDocumentsList]
        });
    }

    searchUpdate(event) {
        const searchStr = new RegExp(event.target.value.toLowerCase());
        const newDocumentsList = [...this.props.documentsList];
        for (var i = 0; i < newDocumentsList.length; i++) {
            const isViewed = searchStr.test(this.getDocNameWithoutExtension(newDocumentsList[i].documentName).toLowerCase());
            newDocumentsList[i].isViewed = isViewed;
        }
        this.changeDocumentsList(newDocumentsList);
    }

    getDocNameWithoutExtension(fileNameWithExtension) {
        return fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
    }

    getExtension(fileNameWithExtension) {
        return fileNameWithExtension.substring(fileNameWithExtension.lastIndexOf('.') + 1).toUpperCase();
    }

    toggleSort(sortList, funcGetNameOrExtension){
        if (!sortList) {
            return;
        }
        const firstName = funcGetNameOrExtension(sortList[0].documentName).toLowerCase();
        const lastName = funcGetNameOrExtension(sortList[sortList.length - 1].documentName).toLowerCase();
        const newDocumentsList = sortList.slice().sort((a, b)=> {
            const isFirstLessOrEqualThanLast = funcGetNameOrExtension(a.documentName).toLowerCase() <= funcGetNameOrExtension(b.documentName).toLowerCase();
            return (firstName <= lastName) ? isFirstLessOrEqualThanLast : !isFirstLessOrEqualThanLast;
        });
        this.changeDocumentsList(newDocumentsList);
    }

    toggleSortByName() {
        this.toggleSort(this.state.documentsList, this.getDocNameWithoutExtension);
    }

    toggleSortByFormat() {
        this.toggleSort(this.state.documentsList, this.getExtension);
    }

    render() {
        const {
            onClose
        } = this.props;

        return (
            <Dialog title='End meeting'
                    onClose={onClose}
                    closable={false}>
                {this.state.documentsList && this.state.documentsList.length > 0 &&
                <FilesAndCheckBoxesTables documentsList={this.state.documentsList}
                                          onChangeDocumentsList={::this.changeDocumentsList}
                                          onSearchUpdate={::this.searchUpdate}
                                          onToggleSortByName={::this.toggleSortByName}
                                          onToggleSortByFormat={::this.toggleSortByFormat}
                                          onGetDocNameWithoutExtension={::this.getDocNameWithoutExtension}
                                          onGetExtension={::this.getExtension} />
                }
                <div className={stylesConfirmDialog.buttons}>
                    <button onClick={onClose} className={customStyle.buttonGrey}>Skip</button>
                    {this.state.documentsList && this.state.documentsList.length > 0 &&
                        <button className={customStyle.buttonBlue} onClick={::this.handleOnConfirm}>Share</button>
                    }
                </div>
            </Dialog>
        );
    }
}
