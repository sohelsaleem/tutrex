import {connect} from 'react-redux';

import ShareVideoDialog from 'components/dialogs/ShareVideoDialog';

import {shareVideo} from 'actions/videoFile';

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {
    shareVideo
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareVideoDialog);

