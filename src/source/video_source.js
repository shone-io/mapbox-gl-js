// @flow

const ajax = require('../util/ajax');
const ImageSource = require('./image_source');

import type Map from '../ui/map';
import type Dispatcher from '../util/dispatcher';
import type Evented from '../util/evented';

/**
 * A data source containing video.
 * (See the [Style Specification](https://www.mapbox.com/mapbox-gl-style-spec/#sources-video) for detailed documentation of options.)
 * @interface VideoSource
 * @example
 * // add to map
 * map.addSource('some id', {
 *    type: 'video',
 *    url: [
 *        'https://www.mapbox.com/blog/assets/baltimore-smoke.mp4',
 *        'https://www.mapbox.com/blog/assets/baltimore-smoke.webm'
 *    ],
 *    coordinates: [
 *        [-76.54, 39.18],
 *        [-76.52, 39.18],
 *        [-76.52, 39.17],
 *        [-76.54, 39.17]
 *    ]
 * });
 *
 * // update
 * var mySource = map.getSource('some id');
 * mySource.setCoordinates([
 *     [-76.54335737228394, 39.18579907229748],
 *     [-76.52803659439087, 39.1838364847587],
 *     [-76.5295386314392, 39.17683392507606],
 *     [-76.54520273208618, 39.17876344106642]
 * ]);
 *
 * map.removeSource('some id');  // remove
 * @see [Add a video](https://www.mapbox.com/mapbox-gl-js/example/video-on-a-map/)
 */
class VideoSource extends ImageSource {
    options: VideoSourceSpecification;
    urls: Array<string>;
    video: HTMLVideoElement;
    roundZoom: boolean;

    constructor(id: string, options: VideoSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented) {
        super(id, options, dispatcher, eventedParent);
        this.roundZoom = true;
        this.type = 'video';
        this.options = options;
    }

    load() {
        const options = this.options;
        this.urls = options.urls;

        ajax.getVideo(options.urls, (err, video) => {
            if (err) {
                this.fire('error', {error: err});
            } else if (video) {
                this.video = video;
                this.video.loop = true;

                // Start repainting when video starts playing. hasTransition() will then return
                // true to trigger additional frames as long as the videos continues playing.
                this.video.addEventListener('playing', () => {
                    this.map._rerender();
                });

                if (this.map) {
                    this.video.play();
                }

                this._finishLoading();
            }
        });
    }

    /**
     * Returns the HTML `video` element.
     *
     * @returns {HTMLVideoElement} The HTML `video` element.
     */
    getVideo() {
        return this.video;
    }

    onAdd(map: Map) {
        if (this.map) return;
        this.map = map;
        this.load();
        if (this.video) {
            this.video.play();
            this.setCoordinates(this.coordinates);
        }
    }

    /**
     * Sets the video's coordinates and re-renders the map.
     *
     * @method setCoordinates
     * @instance
     * @memberof VideoSource
     * @param {Array<Array<number>>} coordinates Four geographical coordinates,
     *   represented as arrays of longitude and latitude numbers, which define the corners of the video.
     *   The coordinates start at the top left corner of the video and proceed in clockwise order.
     *   They do not have to represent a rectangle.
     * @returns {VideoSource} this
     */
    // setCoordinates inherited from ImageSource

    prepare() {
        if (Object.keys(this.tiles).length === 0 || this.video.readyState < 2) return; // not enough data for current position
        this._prepareImage(this.map.painter.context.gl, this.video);
    }

    serialize() {
        return {
            type: 'video',
            urls: this.urls,
            coordinates: this.coordinates
        };
    }

    hasTransition() {
        return this.video && !this.video.paused;
    }
}

module.exports = VideoSource;
