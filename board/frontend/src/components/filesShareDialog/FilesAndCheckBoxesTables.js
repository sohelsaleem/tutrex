import React, {Component, PropTypes} from 'react';

import styles from './FilesShareDialog.scss';

import CheckBox from 'components/common/CheckBox';

export default class FilesAndCheckBoxesTables extends Component {
    static propTypes = {
        documentsList: PropTypes.array.isRequired,
        onChangeDocumentsList: PropTypes.func.isRequired,
        onSearchUpdate: PropTypes.func.isRequired,
        onToggleSortByName: PropTypes.func.isRequired,
        onToggleSortByFormat: PropTypes.func.isRequired,
        onGetDocNameWithoutExtension: PropTypes.func.isRequired,
        onGetExtension: PropTypes.func.isRequired
    };

    state = {
        selectedAll: false
    };

    toggleSelectAll(event) {
        const {
            documentsList,
            onChangeDocumentsList
        } = this.props;

        const currentDocumentsList = [...documentsList];
        const newDocumentsList = currentDocumentsList.map(document => {
            if (document.isViewed) {
                document.checked = event.target.checked;
            }
            return document;
        });

        onChangeDocumentsList(newDocumentsList);
        this.updateSelectAllCheckBox();
    }

    isSelectedAll(documentsList) {
        const displayedDocuments = documentsList.filter(d => d.isViewed);
        const checkedDisplayedDocuments = displayedDocuments.filter(d => d.checked);

        return {
            checked: checkedDisplayedDocuments.length > 0,
            partialChecked: checkedDisplayedDocuments.length < displayedDocuments.length
        };
    }

    updateSelectAllCheckBox() {
        const {
            documentsList
        } = this.props;

        const {checked, partialChecked} = this.isSelectedAll(documentsList);

        this.setState({
            selectedAll: checked,
            selectedNotAll: partialChecked
        });
    }

    updateSelected = index => event => {
        const {
            documentsList,
            onChangeDocumentsList
        } = this.props;
        const newDocumentsList = [...documentsList];

        newDocumentsList.filter((document) => {
            return document.isViewed;
        })[index].checked = event.target.checked;

        onChangeDocumentsList(newDocumentsList);
        this.updateSelectAllCheckBox();
    };

    searchUpdate(event) {
        const {
            onSearchUpdate
        } = this.props;

        onSearchUpdate(event);
        this.updateSelectAllCheckBox();
    }

    renderFiles(item, index) {
        const {
            onGetDocNameWithoutExtension,
            onGetExtension
        } = this.props;

        return (
            <tr key={index}>
                <td>{onGetDocNameWithoutExtension(item.documentName)}</td>
                <td>{onGetExtension(item.documentName)}</td>
            </tr>
        );
    }

    renderCheckBoxes(item, index) {
        return (
            <tr key={index}>
                <td>
                    <CheckBox checked={item.checked}
                              onChange={this.updateSelected(index)}/>
                </td>
            </tr>
        );
    }

    render() {
        const {
            documentsList,
            onToggleSortByName,
            onToggleSortByFormat
        } = this.props;

        const {selectedAll, selectedNotAll} = this.state;

        return (
            <div className={styles.allContainer}>
                <div>Would you like to share any files with all invited users?</div>
                <input className={styles.inputLine} type="text" name="search" placeholder="Search documents"
                       onInput={::this.searchUpdate}/>
                <div className={styles.tableAndSelectContainer}>
                    <div className={styles.filesTableContainer}>
                        <table className={styles.filesTable}>
                            <thead>
                            <tr>
                                <th>
                                    <div className={styles.flexHeader} onClick={onToggleSortByName}>
                                        <div className={styles.columnCaption}>File name</div>
                                        <div className={styles.sortButton}></div>
                                    </div>
                                </th>
                                <th>
                                    <div className={styles.flexHeader} onClick={onToggleSortByFormat}>
                                        <div className={styles.columnCaption}>Format</div>
                                        <div className={styles.sortButton}></div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {documentsList.filter((document) => {
                                return document.isViewed
                            }).map(::this.renderFiles)}
                            </tbody>
                        </table>
                    </div>
                    <table className={styles.selectTable}>
                        <thead>
                        <tr>
                            <th>
                                <label className={styles.selectAllCheckBox}>Select All
                                    <CheckBox checked={selectedAll}
                                              partialChecked={selectedNotAll}
                                              onChange={::this.toggleSelectAll}/>
                                </label>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {documentsList.filter(document => {
                            return document.isViewed
                        }).map(::this.renderCheckBoxes)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
