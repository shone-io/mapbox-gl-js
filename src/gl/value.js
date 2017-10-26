// @flow

import type Context from './context';

export interface Value<T> {
    context: Context;
    static default(): T;
    set(value: T): void;
    get(): T;
};

class ContextValue {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }
}

class ClearColor extends ContextValue implements Value<Array<number>> {
    static default() { return [0, 0, 0, 0] };

    set(v: Array<number>): void {
        this.context.gl.clearColor(v[0], v[1], v[2], v[3]);
    }

    get(): Array<number> {
        const gl = this.context.gl;
        return gl.getParameter(gl.COLOR_CLEAR_VALUE);
    }
}

class ClearDepth extends ContextValue implements Value<number> {
    static default() { return 1 };

    set(v: number): void {
        this.context.gl.clearDepth(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_CLEAR_VALUE);
    }
}

class ClearStencil extends ContextValue implements Value<number> {
    static default() { return 0 };

    set(v: number): void {
        this.context.gl.clearStencil(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.STENCIL_CLEAR_VALUE);
    }
}

class ColorMask extends ContextValue implements Value<Array<boolean>> {
    static default() { return [true, true, true, true] };

    set(v: Array<boolean>): void {
        this.context.gl.colorMask(v[0], v[1], v[2], v[3]);
    }

    get(): Array<boolean> {
        const gl = this.context.gl;
        return gl.getParameter(gl.COLOR_WRITEMASK);
    }
}

class DepthMask extends ContextValue implements Value<boolean> {
    static default() { return true };

    set(v: boolean): void {
        this.context.gl.depthMask(v);
    }

    get(): boolean {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_WRITEMASK);
    }
}

class StencilMask extends ContextValue implements Value<number> {
    static default() { return 0xFF };   // TODO in native this is ~0u

    set(v: number): void {
        this.context.gl.stencilMask(v);
    }

    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.STENCIL_WRITEMASK);
    }
}



module.exports = {
    ClearColor,
    ClearDepth,
    ClearStencil,
    ColorMask,
    DepthMask,
    StencilMask,
};
