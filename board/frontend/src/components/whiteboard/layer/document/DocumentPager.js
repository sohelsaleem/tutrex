import React, {Component, PropTypes} from 'react';
import EventListener from 'react-event-listener';

import styles from './DocumentPager.scss';
import _ from 'lodash';

import DocumentControlButton from './DocumentControlButton';
import BufferedTextInput from 'components/common/textInput/BufferedTextInput';

export default class DocumentPager extends Component {
    static propTypes = {
        canUseWhiteboard: PropTypes.bool.isRequired,
        pageNumber: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        onSelectPage: PropTypes.func.isRequired
    };

    isTargetNotEqualBody(target) {
        return target !== document.body;
    }

    handleKeyUp = (event) => {
        if (this.isTargetNotEqualBody(event.target)) return;
        switch (event.key) {
            case 'ArrowLeft':
                this.handleBackPage();
                break;
            case 'ArrowRight':
                this.handleNextPage();
                break;
        }
    };

    render() {
        const {canUseWhiteboard, pageNumber, pageCount} = this.props;

        return (
            <div className={styles.documentPager}>
                {canUseWhiteboard && <DocumentControlButton className={styles.backButton}
                                                            onClick={this.handleBackPage}/>}

                <div className={styles.pages}>
                    {canUseWhiteboard ?
                        this.renderPageInput() :
                        <span>{pageNumber}</span>
                    }

                    <span className={styles.delimiter}>/</span>
                    <span>{pageCount || '?'}</span>
                </div>

                {canUseWhiteboard && <DocumentControlButton className={styles.nextButton}
                                                            onClick={this.handleNextPage}/>}

                <EventListener target='document'
                               onKeyUp={this.handleKeyUp}/>
            </div>
        );
    }

    handleBackPage = () => {
        this.setPage(this.props.pageNumber - 1);
    };

    setPage(pageNumber) {
        const {id: boardId, pageCount, canUseWhiteboard} = this.props;

        if(!canUseWhiteboard) return;

        const nextPageNumber = _.clamp(pageNumber, 1, pageCount);

        this.props.onSelectPage(boardId, nextPageNumber);
    }

    renderPageInput() {
        const {pageNumber, pageCount} = this.props;

        const definitePageCount = pageCount || 1;
        const definitePageNumber = pageCount || 1;
        const maxPageNumber = Math.max(definitePageCount, definitePageNumber);

        const pageCountDecimalCount = Math.floor(Math.log10(maxPageNumber)) + 1.3;

        const inputStyle = {
            width: `${pageCountDecimalCount}em`,
            outlineWidth: 0
        };

        return (
            <BufferedTextInput style={inputStyle}
                               value={pageNumber}
                               onCommit={this.handleSetPage}/>
        );
    }

    handleSetPage = ({value, rollback}) => {
        const {pageCount} = this.props;
        const nextPageNumber = parseInt(value);

        const pageInRange = nextPageNumber >= 1 && nextPageNumber <= pageCount;
        if (!pageInRange)
            return rollback();

        this.setPage(nextPageNumber);
    };

    handleNextPage = () => {
        this.setPage(this.props.pageNumber + 1);
    };
}
