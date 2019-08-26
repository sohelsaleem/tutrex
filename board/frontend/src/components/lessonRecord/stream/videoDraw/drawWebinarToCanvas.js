import {boardBounds, videosBounds, textChatBounds, windowBounds} from './Geometry';

export default function (canvas, webinarMode, elementMap) {
    new WebinarDrawer(canvas, webinarMode, elementMap).draw();
}

class WebinarDrawer {

    constructor(canvas, webinarMode, {board, videos, screenVideo, textChat}) {
        this.canvas = canvas;
        this.webinarMode = webinarMode;

        this.board = board;
        this.videos = videos;
        this.screenVideo = screenVideo;
        this.textChat = textChat;

        this.context = canvas.getContext('2d');
    }

    draw() {
        this.drawMainArea();
        this.drawRightPanel();
    }

    drawMainArea() {
        const bounds = boardBounds();

        if (this.isBoardMode())
            this.drawBoard(bounds);
        if (this.isScreenShareMode())
            this.drawScreenSharing(bounds);
        else if (this.isConferenceMode())
            this.drawVideos(windowBounds());
    }

    isBoardMode() {
        return this.webinarMode === 'board';
    }

    drawBoard(bounds) {
        const ratio = this.board.width / this.board.height;
        const {x, y, width, height} = bounds;

        const boardWidth = Math.min(width, height * ratio);
        const boardHeight = Math.min(height, width / ratio);

        const boardLeft = x + (width - boardWidth) / 2;
        const boardTop = y + (height - boardHeight) / 2;

        this.context.fillStyle = 'gray';
        this.context.fillRect(x, y, width, height);

        this.context.fillStyle = 'white';
        this.context.fillRect(boardLeft, boardTop, boardWidth, boardHeight);

        this.context.drawImage(this.board, boardLeft, boardTop, boardWidth, boardHeight);
    }

    isScreenShareMode() {
        return this.webinarMode === 'screensharing';
    }

    drawScreenSharing(bounds) {
        const {x, y, width, height} = bounds;

        this.context.fillStyle = 'gray';
        this.context.fillRect(x, y, width, height);

        if (this.screenVideo)
            this.drawVideoInside(this.screenVideo, x, y, width, height);
    }

    drawRightPanel() {
        if (this.isConferenceMode())
            return;

        this.drawVideos(videosBounds());
        this.drawTextChat(textChatBounds());
    }

    isConferenceMode() {
        return this.webinarMode === 'conference';
    }

    drawVideos(bounds) {
        this.drawRightPanelBlockBackground(bounds);

        if (this.videos.length === 0)
            return;

        const {x: x0, y: y0, width, height} = bounds;

        const cellCount = this.videos.length;
        const colCount = Math.ceil(Math.sqrt(cellCount));
        const rowCount = Math.ceil(cellCount / colCount);

        this.videos.forEach((video, index) => {
            const i = Math.floor(index / colCount);
            const j = index % colCount;

            const w = width / colCount;
            const h = height / rowCount;

            const x = x0 + j * w;
            const y = y0 + i * h;

            this.drawVideoInside(video, x, y, w, h);
        });
    }

    drawRightPanelBlockBackground({x, y, width, height}) {
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#CCC';
        this.context.strokeRect(x, y, width, height);

        this.context.fillStyle = '#f2f2f2';
        this.context.fillRect(x, y, width, height);
    }

    drawVideoInside(video, cellX, cellY, cellWidth, cellHeight) {
        const ratio = video.videoWidth / video.videoHeight;

        const width = Math.min(cellWidth, cellHeight * ratio);
        const height = Math.min(cellHeight, cellWidth / ratio);

        const left = cellX + (cellWidth - width) / 2;
        const top = cellY + (cellHeight - height) / 2;

        this.context.drawImage(video, left, top, width, height);
    }

    drawTextChat(bounds) {
        this.drawRightPanelBlockBackground(bounds);

        const {x, y, width, height} = bounds;
        this.context.drawImage(this.textChat, x, y, width, height);
    }
}
