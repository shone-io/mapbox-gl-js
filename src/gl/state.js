// @flow

const {Value} = require('./value');


class State<V, U> {
    currentValue: V;
    dirty: boolean;

    constructor(value: V) {
        this.currentValue = value;
    }

    set(rawValue: U) {
        if (this.currentValue instanceof Value) {
          if (rawValue != this.currentValue.Current) {
              this.currentValue.set(rawValue);
          }
        }
    }

    setDirty() {
        this.dirty = true;
    }

    isDirty(): boolean {
        return this.dirty;
    }
}

module.exports = State;
