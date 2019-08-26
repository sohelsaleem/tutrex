import React from 'react';
import AbstractShape from './AbstractShape';
import katex from 'katex';
import getHtmlMarkupBounds from 'helpers/getHtmlMarkupBounds';

import ScalingUtils from 'domain/whiteboard/ScalingUtils';

const katexStyle = require('katex/dist/katex.min.css').toString();

export default class Latex extends AbstractShape {
    state = {};

    draw() {
        const {paper, command} = this.props;
        const content = command.body;

        const point = ScalingUtils.deserializePoint(new paper.Point(content.point.x, content.point.y));
        const fontSize = ScalingUtils.deserializeCoordinateY(0.05);
        const {formula} = content;

        this.createLatexItem({
            point,
            fontSize,
            formula
        });
    }

    createLatexItem(content) {
        const {paper} = this.props;
        const {point} = content;

        const {svgURL, width, height} = this.makeSvg(content);

        const position = new paper.Point(point.x + width / 2, point.y + height / 2);

        const latexItem = new paper.Raster(svgURL, position);
        this.saveMainItem(latexItem);
    }

    makeSvg({formula, fontSize}) {
        const tex = katex.renderToString(formula);
        const wrappedTex = [
            `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize}px; display: inline-block;">` +
            tex,
            '</div>'
        ].join('');

        const {width, height} = getHtmlMarkupBounds(wrappedTex);

        const svgMarkup = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
            '<foreignObject width="100%" height="100%">',
            `<style>${katexStyle}</style>`,
            wrappedTex,
            '</foreignObject>',
            '</svg>'
        ].join('');

        const codedSvg = encodeURI(svgMarkup);
        const svgURL = 'data:image/svg+xml;charset=utf-8,' + codedSvg;

        return {svgURL, width, height};
    }
}
