// @flow
const assert = require('assert');
const IndexBuffer = require('./index_buffer');
const VertexBuffer = require('./vertex_buffer');
const State = require('./state');
const {
    ClearColor,
    ClearDepth,
    ClearStencil,
    ColorMask,
    DepthMask,
    StencilMask,
    StencilFunc,
    StencilOp,
    StencilTest,
    DepthRange,
    DepthTest,
    DepthFunc,
} = require('./value');


import type {TriangleIndexArray, LineIndexArray} from '../data/index_array_type';
import type {StructArray} from '../util/struct_array';
import type {StencilFuncType, StencilOpType} from './value';

type ClearArgs = {
    color?: Array<number>,
    depth?: number,
    stencil?: number            // TODO somehow we need to figure out how to use defaults :thinking:
};

class Context {
    gl: WebGLRenderingContext;
    clearColor: State<Array<number>>;
    clearDepth: State<number>;
    clearStencil: State<number>;
    colorMask: State<Array<boolean>>;
    depthMask: State<boolean>;
    stencilMask: State<number>;
    stencilFunc: State<StencilFuncType>;
    stencilOp: State<StencilOpType>;
    stencilTest: State<boolean>;
    depthRange: State<Array<number>>;
    depthTest: State<boolean>;
    depthFunc: State<number>;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.clearColor = new State(new ClearColor(this));
        this.clearDepth = new State(new ClearDepth(this));
        this.clearStencil = new State(new ClearStencil(this));
        this.colorMask = new State(new ColorMask(this));
        this.depthMask = new State(new DepthMask(this));
        this.stencilMask = new State(new StencilMask(this));
        this.stencilFunc = new State(new StencilFunc(this));
        this.stencilOp = new State(new StencilOp(this));
        this.stencilTest = new State(new StencilTest(this));
        this.depthRange = new State(new DepthRange(this));
        this.depthTest = new State(new DepthTest(this));
        this.depthFunc = new State(new DepthFunc(this));
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
            this.clearColor.set(color);
            this.colorMask.set([true, true, true, true]);
        }

        if (typeof depth !== 'undefined') {
            mask |= gl.DEPTH_BUFFER_BIT;
            this.clearDepth.set(depth);
            this.depthMask.set(true);
        }

        if (typeof stencil !== 'undefined') {
            mask |= gl.STENCIL_BUFFER_BIT;
            this.clearStencil.set(stencil);
            this.stencilMask.set(0xFF);
        }

        // TODO
        gl.clear(mask);
    }

    setDepthMode(depth: any /* TODO DepthMode */) {}

    setStencilMode(stencil: any /* TODO StencilMode */) {}

    setColorMode(color: any /* TODO ColorMode */) {}

}

module.exports = Context;
