import {connect} from 'react-redux';
import {requestVersion} from 'actions/version';

import Version from '../../components/common/Version';

import _ from 'lodash';

const mapStateToProps = (state) => ({
    serverVersion: _.get(state.version.serverVersion, 'version', '')
});

const mapDispatchToProps = {
    onAppear: requestVersion
};

export default connect(mapStateToProps, mapDispatchToProps)(Version);
