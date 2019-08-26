import React, {Component, PropTypes} from 'react';

import Dialog from 'components/common/Dialog';
import StorageListIcon from './StorageListIcon';
import Back from 'assets/storage/back.svg';
import File from 'assets/storage/file.svg';
import Folder from 'assets/storage/folder.svg';

import styles from './StorageListDialog.scss';

const STORAGE_ITEM_TYPES = {
    FOLDER: 1,
    FILE: 2
};

export default class StorageListDialog extends Component {
    static propTypes = {
        onGetStorageList: PropTypes.func.isRequired,
        onCheckItem: PropTypes.func.isRequired,
        storageList: PropTypes.object,
        onChoose: PropTypes.func,
        onClose: PropTypes.func,
        isDisplayed: PropTypes.bool,
        formats: PropTypes.string,
        isItemAvailable: PropTypes.bool,
        itemAvailabilityError: PropTypes.object,
        isItemAvailableProcessing: PropTypes.bool
    };

    state = {
        chosen: null
    };

    componentDidMount() {
        const {onGetStorageList} = this.props;
        onGetStorageList();
    }

    componentWillReceiveProps(next) {
        if (!this.isChecked(next))
            return;

        let error = null;

        if (next.itemAvailabilityError && !this.props.itemAvailabilityError)
            error = next.itemAvailabilityError.message;

        const {chosen} = this.state;

        this.props.onChoose(error, chosen);
    }

    isChecked(next) {
        return !next.isItemAvailableProcessing && this.props.isItemAvailableProcessing;
    }

    render() {
        const {storageList = {}, isDisplayed, onClose, formats} = this.props;
        const {content = [], folder = null} = storageList;
        return (
            <Dialog visible={isDisplayed} title={this.renderHeader(folder)} onClose={onClose}>
                <div className={styles.info}>{formats}</div>
                <div className={styles.contentContainer}>
                    {content.map(this.renderStorageItem.bind(this))}
                </div>
            </Dialog>
        );
    }

    renderHeader(folder) {
        if (!folder)
            return (<div className={styles.header}>Cloud Storage</div>);
        return (
            <div className={styles.header}>
                <StorageListIcon className={styles.icon} asset={Back}
                                 width={'1rem'}
                                 height={'1rem'}
                                 onClick={this.navigateTo.bind(this, folder.parentId)}/> {folder.name}
            </div>
        );
    }

    navigateTo(parentId) {
        const {onGetStorageList} = this.props;
        onGetStorageList(parentId);
    }

    renderStorageItem(storageItem, index) {
        return (
            <div key={index} className={styles.item} onClick={this.onItemClick.bind(this, storageItem)}>
                <StorageListIcon asset={storageItem.type === STORAGE_ITEM_TYPES.FOLDER ? Folder : File}
                                 className={styles.icon}/>
                {storageItem.name}
            </div>);
    }

    onItemClick(storageItem) {
        if (storageItem.type === STORAGE_ITEM_TYPES.FOLDER)
            return this.navigateTo(storageItem.id);
        else
            return this.setState({
                chosen: storageItem
            }, this.props.onCheckItem.bind(this, storageItem.id));
    }
}
