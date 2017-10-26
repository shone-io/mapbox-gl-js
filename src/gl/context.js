// @flow
const assert = require('assert');
const IndexBuffer = require('./index_buffer');
const VertexBuffer = require('./vertex_buffer');
const State = require('./state');
const Values = require('./value');


import type {TriangleIndexArray, LineIndexArray} from '../data/index_array_type';
import type {StructArray} from '../util/struct_array';

type ClearArgs = {
    color?: Array<number>,
    depth?: number,
    stencil?: number            // TODO somehow we need to figure out how to use defaults :thinking:
};

class Context {
    gl: WebGLRenderingContext;
    clearDepth: State<Values.ClearDepth, number>;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.clearDepth = new State(new Values.ClearDepth(this));
    }

    createIndexBuffer(array: TriangleIndexArray | LineIndexArray, dynamicDraw?: boolean) {
        return new IndexBuffer(this, array, dynamicDraw);
    }

    createVertexBuffer(array: StructArray, dynamicDraw?: boolean) {
        return new VertexBuffer(this, array, dynamicDraw);
    }
    // TODO in native, Context also has an updateVertexBuffer method. the VertexBuffer class has that method; is there any reason to thread through Context or no?

    createRenderbuffer(/* TODO */) {}

    createFramebuffer(/* TODO */) {}

    createTexture(/* TODO */) {}

    updateTexture(/* TODO */) {}

    bindTexture(/* TODO */) {}

    clear({color, depth, stencil}: ClearArgs) {
        const gl = this.gl;
        let mask = 0;

        if (color) {
            mask |= gl.COLOR_BUFFER_BIT;
            gl.clearColor(color[0], color[1], color[2], color[3]);
            gl.colorMask(true, true, true, true);
        }

        if (typeof depth !== 'undefined') {
            mask |= gl.DEPTH_BUFFER_BIT;
            this.clearDepth.set(depth);
            // gl.clearDepth(depth);
            gl.depthMask(true);
        }

        if (typeof stencil !== 'undefined') {
            mask |= gl.STENCIL_BUFFER_BIT;
            gl.clearStencil(stencil);
            gl.stencilMask(0xFF);
        }

        gl.clear(mask);
    }

    setDepthMode(depth: any /* TODO DepthMode */) {}

    setStencilMode(stencil: any /* TODO StencilMode */) {}

    setColorMode(color: any /* TODO ColorMode */) {}

}

module.exports = Context;
