// @flow

import type Context from './context';

interface ValueInterface<T> {
    current: T,
    +default: T,
    set(value: T): void,
    get(): T
}

// Abstract class for the sake of interface member access:
class Value<T> implements ValueInterface<T> {
    current: T;
    default: T;
    context: Context;
    constructor(context: Context) { this.context = context; }
    set(value: T) {}
    get(): T { return this.default; }
}

class ClearDepth extends Value<number> {
    constructor(context: Context) {
        super(context);
        this.current = 1;
        this.default = 1;
    }
    set(value: number) {
        this.context.gl.clearDepth(value);
    }
    get(): number {
        const gl = this.context.gl;
        return gl.getParameter(gl.DEPTH_CLEAR_VALUE);
    }
}

module.exports = {
    Value,
    ClearDepth
};
