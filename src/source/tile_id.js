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

    scaledTo(targetZ: number) {
        assert(targetZ <= this.overscaledZ);
        const zDifference = this.canonical.z - targetZ;
        return new OverscaledTileID(targetZ, this.wrap,
                targetZ >= this.canonical.z ?
                    new CanonicalTileID(this.canonical.z, this.canonical.x, this.canonical.y) :
                    new CanonicalTileID(targetZ, this.canonical.x >> zDifference, this.canonical.y >> zDifference));
    }

	/**
	 * @param {OverscaledTileID} parent id that is potentially a parent of this id
	 * @returns {boolean} result boolean describing whether or not `child` is a child tile of the root
	 * @private
	 */
	isChildOf(parent: OverscaledTileID) {
        const zDifference = this.canonical.z - parent.canonical.z;
		// We're first testing for z == 0, to avoid a 32 bit shift, which is undefined.
		return parent.overscaledZ === 0 || (
                parent.overscaledZ < this.overscaledZ &&
                parent.canonical.x === (this.canonical.x >> zDifference) &&
                parent.canonical.y === (this.canonical.y >> zDifference));
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
