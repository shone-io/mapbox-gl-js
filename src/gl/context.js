// @flow
const assert = require('assert');

// import type {TriangleIndexArray, LineIndexArray} from '../data/index_array_type';
// import type {SerializedStructArray} from '../util/struct_array';


class Context {
    gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }
}

module.exports = Context;
