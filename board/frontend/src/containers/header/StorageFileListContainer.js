import {connect} from 'react-redux';

import {getStorageList, isStorageItemAvailable} from 'actions/room';

import StorageListDialog from 'components/header/upload/StorageListDialog';

const mapStateToProps = (state) => ({
    isItemAvailable: state.room.isItemAvailable,
    itemAvailabilityError: state.room.itemAvailabilityError,
    storageList: state.room.storageList,
    isItemAvailableProcessing: state.room.isItemAvailableProcessing
});


const mapDispatchToProps = {
    onGetStorageList: getStorageList,
    onCheckItem: isStorageItemAvailable
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageListDialog);
