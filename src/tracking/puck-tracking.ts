import { ImageFetcher } from "./image-fetcher";
import { FileImageFetcher } from "./file-image-fetcher";
import Jimp = require('jimp');
import {utc} from 'moment';
import { Coordinate } from "./coordinate";

export type CoordinateCallback = (loc: Coordinate) => void;

export class PuckTracking {
    public imageFetcher: ImageFetcher;

    constructor() {
        this.imageFetcher = new FileImageFetcher("testimages");
        this.imageFetcher.imageCallback = (image: Buffer) => this.processImage(image);
    }

    private i: number = 0;
    private location: Coordinate | null = null;

    public processImage(image: Buffer): void {
        Jimp.read(image).then((image) => {
            let found = false;
            let min_x: number = image.bitmap.width;
            let min_y: number = image.bitmap.height;
            let max_x: number = -1; 
            let max_y: number = -1;
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                let r = image.bitmap.data[idx];
                let g = image.bitmap.data[idx+1];
                let b = image.bitmap.data[idx+2];

                if (g > 200 && r < 100 && b < 100) {
                    found = true;
                    max_x = Math.max(x, max_x);
                    max_y = Math.max(y, max_y);
                    min_x = Math.min(x, min_x);
                    min_y = Math.min(y, min_y);
                }
            });

            let locx = (min_x + max_x) / 2;
            let locy = (min_y + max_y) / 2;
            let coord: Coordinate = {x: locx, y: locy};

            for(let i=min_x; i<max_x; i++){
                image.setPixelColor(16711680, i, locy);
                image.setPixelColor(16711680, i, locy-1);
                image.setPixelColor(16711680, i, locy+1);
            }

            for(let i=min_y; i<max_y; i++){
                image.setPixelColor(16711680, locx, i);
                image.setPixelColor(16711680, locx+1, i);
                image.setPixelColor(16711680, locx-1, i);
                
            }

            if (found && !this.location) {
                let foundEvents: CoordinateCallback[] | undefined = this.eventCallbacks.get('found');
                if (foundEvents) {
                    foundEvents.forEach((cb: CoordinateCallback) => cb(coord));
                }

                this.location = coord;
            } else if (!found && this.location) {
                let lostEvents: CoordinateCallback[] | undefined = this.eventCallbacks.get('lost');
                if (lostEvents) {
                    lostEvents.forEach((cb: CoordinateCallback) => cb(this.location as Coordinate));
                }

                this.location = null;
            }
            
            if (this.location && found && (this.location.x !== coord.x || this.location.y !== coord.y)) {
                let movedEvents: CoordinateCallback[] | undefined = this.eventCallbacks.get('moved');
                if (movedEvents) {
                    movedEvents.forEach((cb: CoordinateCallback) => cb(coord));
                }

                this.location = coord;
            }
        });
    }

    private eventCallbacks: Map<string, CoordinateCallback[]> = new Map<string, CoordinateCallback[]>();
    public on(event: 'found'|'lost'|'moved', callback: CoordinateCallback) {
        let events = this.eventCallbacks.get(event);
        if (!events) {
            events = [];
            this.eventCallbacks.set(event, events);
        }

        events.push(callback);
    }

    public off(callback: CoordinateCallback) {
        this.eventCallbacks.forEach((v: CoordinateCallback[], k: string, m) => { 
            
        });
    }

    public initialize(){
        this.imageFetcher.initialize();
    }

    public shutdown() {
        this.imageFetcher.shutdown();
    }
}