// @flow

const TileCoord = require('./tile_coord');
const assert = require('assert');

class CanonicalTileID {
    z: number;
    x: number;
    y: number;

    constructor(z: number, x: number, y: number) {
        assert(0 <= z && z <= 25);
        assert(0 <= x && x < Math.pow(2, z));
        assert(0 <= y && y < Math.pow(2, z));
        this.z = z;
        this.x = x;
        this.y = y;
    }
}

class OverscaledTileID {
    overscaledZ: number;
    wrap: number;
    canonical: CanonicalTileID;
	id: number; // TODO

    constructor(overscaledZ: number, wrap: number, canonical: CanonicalTileID) {
        assert(overscaledZ >= canonical.z);
        this.overscaledZ = overscaledZ;
        this.wrap = wrap;
        this.canonical = canonical;
		
		// TODO remove?
		// calculate id
        wrap *= 2;
        if (wrap < 0) wrap = wrap * -1 - 1;
        const dim = 1 << overscaledZ;
        this.id = ((dim * dim * wrap + dim * canonical.y + canonical.x) * 32) + overscaledZ;
    }
}

class UnwrappedTileID {
    wrap: number;
    canonical: CanonicalTileID;
	id: number; // TODO

    constructor(wrap: number, canonical: CanonicalTileID) {
        this.wrap = wrap;
        this.canonical = canonical;

		// TODO remove?
		// calculate id
        wrap *= 2;
        if (wrap < 0) wrap = wrap * -1 - 1;
        const dim = 1 << canonical.z;
        this.id = ((dim * dim * wrap + dim * canonical.y + canonical.x) * 32) + canonical.z;
    }
}

module.exports = {
	CanonicalTileID: CanonicalTileID,
	OverscaledTileID: OverscaledTileID,
	UnwrappedTileID: UnwrappedTileID
};
