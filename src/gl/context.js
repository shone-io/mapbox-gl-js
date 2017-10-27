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
    Blend,
    BlendEquation,
    BlendFunc,
    BlendColor,
    ActiveTextureUnit,
    LineWidth,
    BindFramebuffer,
    BindRenderbuffer,
    BindTexture,
    BindVertexBuffer,
    BindElementBuffer,
    PixelStoreUnpack,
    PixelStoreUnpackPremultiplyAlpha,
} = require('./value');


import type {TriangleIndexArray, LineIndexArray} from '../data/index_array_type';
import type {StructArray} from '../util/struct_array';
import type {
    BlendFuncType,
    ColorType,
    ColorMaskType,
    DepthRangeType,
    StencilFuncType,
    DepthFuncType,
    StencilOpType,
    BlendEquationType,
    TextureUnitType,
} from './types';

type ClearArgs = {
    color?: ColorType,
    depth?: number,
    stencil?: number            // TODO somehow we need to figure out how to use defaults :thinking:
};

class Context {
    gl: WebGLRenderingContext;
    clearColor: State<ColorType>;
    clearDepth: State<number>;
    clearStencil: State<number>;
    colorMask: State<ColorMaskType>;
    depthMask: State<boolean>;
    stencilMask: State<number>;
    stencilFunc: State<StencilFuncType>;
    stencilOp: State<StencilOpType>;
    stencilTest: State<boolean>;
    depthRange: State<DepthRangeType>;
    depthTest: State<boolean>;
    depthFunc: State<DepthFuncType>;
    blend: State<boolean>;
    blendEquation: State<BlendEquationType>;
    blendFunc: State<BlendFuncType>;
    blendColor: State<ColorType>;
    lineWidth: State<number>
    activeTexture: State<TextureUnitType>;
    bindFramebuffer: State<?WebGLFramebuffer>;
    bindRenderbuffer: State<?WebGLRenderbuffer>
    bindTexture: State<?WebGLTexture>;
    bindVertexBuffer: State<?WebGLBuffer>;
    bindElementBuffer: State<?WebGLBuffer>;
    pixelStoreUnpack: State<number>;
    pixelStoreUnpackPremultiplyAlpha: State<boolean>;

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
        this.blend = new State(new Blend(this));
        this.blendEquation = new State(new BlendEquation(this));
        this.blendFunc = new State(new BlendFunc(this));
        this.blendColor = new State(new BlendColor(this));
        this.lineWidth = new State(new LineWidth(this));
        this.activeTexture = new State(new ActiveTextureUnit(this));
        this.bindFramebuffer = new State(new BindFramebuffer(this));
        this.bindRenderbuffer = new State(new BindRenderbuffer(this));
        this.bindTexture = new State(new BindTexture(this));
        this.bindVertexBuffer = new State(new BindVertexBuffer(this));
        this.bindElementBuffer = new State(new BindElementBuffer(this));
        // TODO extensions -- OES_vertex_array_object, etc
        this.pixelStoreUnpack = new State(new PixelStoreUnpack(this));
        this.pixelStoreUnpackPremultiplyAlpha = new State(new PixelStoreUnpackPremultiplyAlpha(this));


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

    deleteTexture(/* TODO */) {}
    // TODO in native, all deleting is done in Context::performCleanup
    // (are not separate methods) -- ??

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
