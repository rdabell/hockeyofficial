import { ImageFetcher, ImageCallback } from "./image-fetcher";
import { readFile, readdir } from 'fs';

export class FileImageFetcher implements ImageFetcher {
    public imageCallback: ImageCallback = ()=>{};
    private dir: string;

    constructor(dirpath: string) {
        this.dir = dirpath;
    }

    public initialize() {
        let i: number = 0;
        readdir(this.dir, (err, files: string[]) => {
            
            if (files && files.length > 0) {
                this.sendAndWait(files);
            }
        });
    }

    private sendAndWait(files: string[]) {
        while(files.length>0) {
            let first = files.shift();
            setTimeout(() => {
                this.sendAndWait(files);
            }, 16);
            this.readAndSendImage(first as string);         
        }
    }

    private readAndSendImage(path: string) : void {

        readFile(`${this.dir}/${path}`, (err, data: Buffer) => {
            if (err) {
                console.log(err.message);
            } else if ( this.imageCallback) {
                this.imageCallback(data);
            }
        });
    }

    public shutdown() {

    }
}