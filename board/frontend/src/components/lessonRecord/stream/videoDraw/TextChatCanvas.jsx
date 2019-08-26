import React, {Component, PropTypes} from 'react';
import {textChatBounds} from './Geometry';
import TextMessagesList from '../../../textChat/TextMessagesList';

const textChatListStyle = require('!!to-string!css?modules&localIdentName=[local]___[hash:base64:5]!postcss!sass!components/textChat/TextMessagesList.scss').toString();
const textChatListItemStyle = require('!!to-string!css?modules&localIdentName=[local]___[hash:base64:5]!postcss!sass!components/textChat/MessageItem.scss').toString();

const textChatStyle = textChatListStyle + textChatListItemStyle;

export default class TextChatCanvas extends Component {
    static propTypes = {
        chatItemList: PropTypes.array,
        user: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const svgURL = this.formSvgURL();

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = svgURL;

        image.onload = this.handleImageLoad(image, svgURL);
    }

    formSvgURL() {
        const {width, height} = textChatBounds();
        const textChatMarkup = this.refs.textChat.innerHTML;

        const svgMarkup = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
            '<foreignObject width="100%" height="100%">',
            '<style>',
            'foreignObject > div { height: 100%; background: #f2f2f2; display: flex; flex-flow: column nowrap; justify-content: flex-end }',
            textChatStyle,
            '</style>',
            '<div xmlns="http://www.w3.org/1999/xhtml">',
            textChatMarkup,
            '</div>',
            '</foreignObject>',
            '</svg>'
        ].join('');

        const codedSvg = encodeURI(svgMarkup);
        return 'data:image/svg+xml;charset=utf-8,' + codedSvg;
    }

    handleImageLoad = (image, svgURL) => () => {
        image.onload = null;

        const canvas = this.refs.canvas;

        if (!canvas)
            return;

        const context = canvas.getContext('2d');

        const {width, height} = textChatBounds();
        context.drawImage(image, 0, 0, width, height);
    };

    render() {
        const {chatItemList, user} = this.props;

        const {width, height} = textChatBounds();

        return (
            <div>
                <canvas ref='canvas'
                        width={width}
                        height={height}></canvas>

                <div ref='textChat'>
                    <TextMessagesList messages={chatItemList}
                                      useMessageFilter={false}
                                      myUserId={user.id}
                                      selectedChatId='all'
                                      style={{flex: '1 0 auto'}}/>
                </div>
            </div>
        );
    }
}
