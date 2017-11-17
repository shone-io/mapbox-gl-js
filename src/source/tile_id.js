// @flow

const WhooTS = require('@mapbox/whoots-js');
const assert = require('assert');

class CanonicalTileID {
    z: number;
    x: number;
    y: number;
	id: number; // TODO

    constructor(z: number, x: number, y: number) {
        assert(0 <= z && z <= 25);
        assert(0 <= x && x < Math.pow(2, z));
        assert(0 <= y && y < Math.pow(2, z));
        this.z = z;
        this.x = x;
        this.y = y;

		// TODO remove?
		// calculate id
        const dim = 1 << this.z;
        this.id = (dim * this.y + this.x) * 32 + this.z;
    }

    equals(id: CanonicalTileID) {
        return this.z === id.z && this.x === id.x && this.y === id.y;
    }

	// given a list of urls, choose a url template and return a tile URL
    url(urls: Array<string>, scheme: ?string) {
        const bbox = WhooTS.getTileBBox(this.x, this.y, this.z);
        const quadkey = getQuadkey(this.z, this.x, this.y);

        return urls[(this.x + this.y) % urls.length]
            .replace('{prefix}', (this.x % 16).toString(16) + (this.y % 16).toString(16))
            .replace('{z}', String(this.z))
            .replace('{x}', String(this.x))
            .replace('{y}', String(scheme === 'tms' ? (Math.pow(2, this.z) - this.y - 1) : this.y))
            .replace('{quadkey}', quadkey)
            .replace('{bbox-epsg-3857}', bbox);
    }
}

class OverscaledTileID {
    overscaledZ: number;
    wrap: number;
    canonical: CanonicalTileID;
	id: number; // TODO
    posMatrix: Float32Array;

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

	isChildOf(parent: OverscaledTileID) {
        const zDifference = this.canonical.z - parent.canonical.z;
		// We're first testing for z == 0, to avoid a 32 bit shift, which is undefined.
		return parent.overscaledZ === 0 || (
                parent.overscaledZ < this.overscaledZ &&
                parent.canonical.x === (this.canonical.x >> zDifference) &&
                parent.canonical.y === (this.canonical.y >> zDifference));
	}

    children(sourceMaxZoom: number) {
		if (this.overscaledZ >= sourceMaxZoom) {
			// return a single tile coord representing a an overscaled tile
			return [new OverscaledTileID(this.overscaledZ + 1, this.wrap, this.canonical)];
		}

		const z = this.canonical.z + 1;
		const x = this.canonical.x * 2;
		const y = this.canonical.y * 2;
		return [
			new OverscaledTileID(z, this.wrap, new CanonicalTileID(z, x, y)),
			new OverscaledTileID(z, this.wrap, new CanonicalTileID(z, x + 1, y)),
			new OverscaledTileID(z, this.wrap, new CanonicalTileID(z, x, y + 1)),
			new OverscaledTileID(z, this.wrap, new CanonicalTileID(z, x + 1, y + 1))
		];
    }

    isLessThan(rhs: OverscaledTileID) {
        if (this.wrap < rhs.wrap) return true;
        if (this.wrap > rhs.wrap) return false;

        if (this.overscaledZ < rhs.overscaledZ) return true;
        if (this.overscaledZ > rhs.overscaledZ) return false;

        if (this.canonical.x < rhs.canonical.x) return true;
        if (this.canonical.x > rhs.canonical.x) return false;

        if (this.canonical.y < rhs.canonical.y) return true;
        return false;
    }

    wrapped() {
        return new OverscaledTileID(this.overscaledZ, 0, this.canonical);
    }

    overscaleFactor() {
        return Math.pow(2, this.overscaledZ - this.canonical.z);
    }

    toUnwrapped() {
        // TODO remove?
        return new UnwrappedTileID(this.wrap, this.canonical);
    }

    toString() {
        return `${this.overscaledZ}/${this.canonical.x}/${this.canonical.y}`;
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

function getQuadkey(z, x, y) {
    let quadkey = '', mask;
    for (let i = z; i > 0; i--) {
        mask = 1 << (i - 1);
        quadkey += ((x & mask ? 1 : 0) + (y & mask ? 2 : 0));
    }
    return quadkey;
}

module.exports = {
	CanonicalTileID: CanonicalTileID,
	OverscaledTileID: OverscaledTileID,
	UnwrappedTileID: UnwrappedTileID
};
