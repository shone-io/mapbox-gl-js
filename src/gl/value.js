// @flow

// const {enums} = require('./types');

import type Context from './context';
import type {
    BlendFuncType,
    ColorType,
    ColorMaskType,
    DepthRangeType,
    StencilFuncType,
    StencilOpType,
    DepthFuncType,
    BlendEquationType,
    TextureUnitType,
} from './types';

export interface Value<T> {
    context: Context;
    static default(context?: Context): T;
    set(value: T): void;
    get(): T;
}

class ContextValue {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }
}

class ClearColor extends ContextValue implements Value<ColorType> {
    static default() { return [0, 0, 0, 0]; }

    set(v: ColorType): void {
        this.context.gl.clearColor(v[0], v[1], v[2], v[3]);
    }

    get(): ColorType {
        const gl = this.context.gl;
        return gl.getParameter(gl.COLOR_CLEAR_VALUE);
    }
}

class ClearDepth extends ContextValue implements Value<number> {
    static default() { return 1; }

    set(v: number): void {
        this.context.gl.clearDepth(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_CLEAR_VALUE);
    }
}

class ClearStencil extends ContextValue implements Value<number> {
    static default() { return 0; }

    set(v: number): void {
        this.context.gl.clearStencil(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.STENCIL_CLEAR_VALUE);
    }
}

class ColorMask extends ContextValue implements Value<ColorMaskType> {
    static default() { return [true, true, true, true]; }

    set(v: ColorMaskType): void {
        this.context.gl.colorMask(v[0], v[1], v[2], v[3]);
    }

    get(): ColorMaskType {
        const gl = this.context.gl;
        return gl.getParameter(gl.COLOR_WRITEMASK);
    }
}

class DepthMask extends ContextValue implements Value<boolean> {
    static default() { return true; }

    set(v: boolean): void {
        this.context.gl.depthMask(v);
    }

    get(): boolean {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_WRITEMASK);
    }
}

class StencilMask extends ContextValue implements Value<number> {
    static default() { return 0xFF; }   // TODO in native this is ~0u

    set(v: number): void {
        this.context.gl.stencilMask(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.STENCIL_WRITEMASK);
    }
}

class StencilFunc extends ContextValue implements Value<StencilFuncType> {
    static default(context: Context) {
        return {
            func: context.gl.ALWAYS,
            ref: 0,
            mask: 0xFF
        };
    }

    set(v: StencilFuncType): void {
        this.context.gl.stencilFunc(v.func, v.ref, v.mask);
    }

    get(): StencilFuncType {
        const gl = this.context.gl;
        return {
            func: gl.getParameter(gl.STENCIL_FUNC),
            ref: gl.getParameter(gl.STENCIL_REF),
            mask: gl.getParameter(gl.STENCIL_VALUE_MASK)
        };
    }
}

class StencilOp extends ContextValue implements Value<StencilOpType> {
    static default(context: Context) {
        const gl = context.gl;
        return [gl.KEEP, gl.KEEP, gl.KEEP];
    }

    set(v: StencilOpType): void {
        this.context.gl.stencilOp(v[0], v[1], v[2]);
    }

    get(): StencilOpType {
        const gl = this.context.gl;
        return [gl.getParameter(gl.STENCIL_FAIL),
            gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL),
            gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS)
        ];
    }
}

class StencilTest extends ContextValue implements Value<boolean> {
    static default() { return false; }

    set(v: boolean): void {
        const gl = this.context.gl;
        if (v) {
            gl.enable(gl.STENCIL_TEST);
        } else {
            gl.disable(gl.STENCIL_TEST);
        }
    }

    get(): any {    // should be boolean; depends on https://github.com/facebook/flow/pull/5196
        const gl = this.context.gl;
        return gl.isEnabled(gl.STENCIL_TEST);
    }
}

class DepthRange extends ContextValue implements Value<DepthRangeType> {
    static default() { return [0, 1]; }

    set(v: DepthRangeType): void {
        this.context.gl.depthRange(v[0], v[1]);
    }

    get(): DepthRangeType {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_RANGE);
    }
}

class DepthTest extends ContextValue implements Value<boolean> {
    static default() { return false; }

    set(v: boolean): void {
        const gl = this.context.gl;
        if (v) {
            gl.enable(gl.DEPTH_TEST);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }
    }

    get(): any {    // should be boolean; depends on https://github.com/facebook/flow/pull/5196
        const gl = this.context.gl;
        return gl.isEnabled(gl.DEPTH_TEST);
    }
}

class DepthFunc extends ContextValue implements Value<DepthFuncType> {
    static default(context: Context) {
        return context.gl.LESS;
    }

    set(v: DepthFuncType): void {
        this.context.gl.depthFunc(v);
    }

    get(): DepthFuncType {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_FUNC);
    }
}

class Blend extends ContextValue implements Value<boolean> {
    static default() { return true; }

    set(v: boolean): void {
        const gl = this.context.gl;
        if (v) {
            gl.enable(gl.BLEND);
        } else {
            gl.disable(gl.BLEND);
        }
    }

    get(): any {    // should be boolean; depends on https://github.com/facebook/flow/pull/5196
        const gl = this.context.gl;
        return gl.isEnabled(gl.BLEND);
    }
}

class BlendEquation extends ContextValue implements Value<BlendEquationType> { // TODO we don't use this anywhere -- keep or no?
    static default(context: Context) {
        return context.gl.FUNC_ADD;
    }

    set(v: BlendEquationType): void {
        this.context.gl.blendEquation(v);
    }

    get(): BlendEquationType {
        // TODO for this and others, we pick RGB or alpha -- ??
        const gl = this.context.gl;
        return gl.getParameter(gl.BLEND_EQUATION_RGB);
    }
}

class BlendFunc extends ContextValue implements Value<BlendFuncType> {
    static default(context: Context) {
        const gl = context.gl;
        return [gl.ONE, gl.ZERO];
    }

    set(v: BlendFuncType): void {
        this.context.gl.blendFunc(v[0], v[1]);
    }

    get(): BlendFuncType {
        // note in native these are statically cast to ColorMode::BlendFactor -- for type cleanup
        const gl = this.context.gl;
        return [
            gl.getParameter(gl.BLEND_SRC_ALPHA),
            gl.getParameter(gl.BLEND_DST_ALPHA)
        ];
    }
}

class BlendColor extends ContextValue implements Value<ColorType> {
    static default() { return [0, 0, 0, 0]; }

    set(v: ColorType): void {
        this.context.gl.blendColor(v[0], v[1], v[2], v[3]);
    }

    get(): ColorType {
        const gl = this.context.gl;
        return gl.getParameter(gl.BLEND_COLOR);
    }
}

// class Program extends ContextValue implements Value<WebGLProgram> {
//     // TODO figure out program caching


//     // static default() { return 0; }

//     // set(v: WebGLProgram): void {
//     //     this.context.gl.useProgram(v);
//     // }

//     // get(): WebGLProgram {
//     //     const gl = this.context.gl;
//     //     return gl.getParameter(gl.CURRENT_PROGRAM);
//     // }
// }

class LineWidth extends ContextValue implements Value<number> {
    // TODO https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/lineWidth
    // says
    // gl.lineWidth() has no effect in common modern browsers.
    // The corresponding Chromium bug and Firefox bug are closed
    // as Won't Fix and the WebGL specification now defines that
    // gl.lineWidth() does not change the line width anymore
    // -- delete all references in gl-js?

    static default() { return 1; }

    set(v: number): void {
        this.context.gl.lineWidth(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.LINE_WIDTH)
    }
}

class ActiveTextureUnit extends ContextValue implements Value<TextureUnitType> {
    static default(context: Context) {
        return context.gl.TEXTURE0;
    }

    set(v: TextureUnitType): void {
        this.context.gl.activeTexture(v);
    }

    get(): TextureUnitType {
        const gl = this.context.gl;
        return gl.getParameter(gl.ACTIVE_TEXTURE);
    }
}

// class Viewport extends ContextValue implements Value<any> {}

// class ScissorTest extends ContextValue implements Value<any> {}
// we don't use ScissorTest anywhere in gl-js -- safe to not implement here?

class BindFramebuffer extends ContextValue implements Value<?WebGLFramebuffer> {
    static default() { return null; }

    set(v: ?WebGLFramebuffer): void {
        const gl = this.context.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, v);
    }

    get(): ?WebGLFramebuffer {
        const gl = this.context.gl;
        return gl.getParameter(gl.FRAMEBUFFER_BINDING);
    }
}

class BindRenderbuffer extends ContextValue implements Value<?WebGLRenderbuffer> {
    static default() { return null; }

    set(v: ?WebGLRenderbuffer): void {
        const gl = this.context.gl;
        gl.bindRenderbuffer(gl.RENDERBUFFER, v);
    }

    get(): ?WebGLRenderbuffer {
        const gl = this.context.gl;
        return gl.getParameter(gl.RENDERBUFFER_BINDING);
    }
}

class BindTexture extends ContextValue implements Value<?WebGLTexture> {
    static default() { return null; }

    set(v: ?WebGLTexture): void {
        const gl = this.context.gl;
        gl.bindTexture(gl.TEXTURE_2D, v);
    }

    get(): ?WebGLTexture {
        const gl = this.context.gl;
        return gl.getParameter(gl.TEXTURE_BINDING_2D);
    }
}

class BindVertexBuffer extends ContextValue implements Value<?WebGLBuffer> {
    static default() { return null; }

    set(v: ?WebGLBuffer): void {
        const gl = this.context.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, v);
    }

    get(): ?WebGLBuffer {
        const gl = this.context.gl;
        return gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    }
}

class BindElementBuffer extends ContextValue implements Value<?WebGLBuffer> {
    static default() { return null; }

    set(v: ?WebGLBuffer): void {
        const gl = this.context.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v);
    }

    get(): ?WebGLBuffer {
        const gl = this.context.gl;
        return gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    }
}

// class BindVertexArray extends ContextValue implements Value<any> {}

// class VertexAttribute extends ContextValue implements Value<any> {}

// class PixelStorePack extends ContextValue implements Value<any> {}
// we don't set this anywhere in gl-js -- delete?

class PixelStoreUnpack extends ContextValue implements Value<number> {
    static default() { return 4; }

    set(v: number): void {
        const gl = this.context.gl;
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.UNPACK_ALIGNMENT);
    }
}

class PixelStoreUnpackPremultiplyAlpha extends ContextValue implements Value<boolean> {
    static default() { return false; }

    set(v: boolean): void {
        const gl = this.context.gl;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, (v: any));
    }

    get(): boolean {
        const gl = this.context.gl;
        return gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    }
}

// class PointSize extends ContextValue implements Value<any> {}
// class PixelZoom extends ContextValue implements Value<any> {}
// class RasterPos extends ContextValue implements Value<any> {}
// class PixelTransferDepth extends ContextValue implements Value<any> {}
// class PixelTransferStencil extends ContextValue implements Value<any> {}
    // aota not in webgl?


module.exports = {
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

    // Program,
    LineWidth,
    ActiveTextureUnit,
    // Viewport,
    // ScissorTest,
    BindFramebuffer,
    BindRenderbuffer,
    BindTexture,
    BindVertexBuffer,
    BindElementBuffer,
    // BindVertexArray,
    // VertexAttribute,
    // PixelStorePack,
    PixelStoreUnpack,
    PixelStoreUnpackPremultiplyAlpha,
};
