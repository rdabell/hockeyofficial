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
            if (files) {
                let i: number = 0;
                files.forEach((file: string) => {
                    i++;
                    setTimeout(()=>{
                            console.log(`Sending Image ${file}`);
                            this.readAndSendImage(`${this.dir}/${file}`);
                        }, i*1000);
                });
            }
        });
    }

    private readAndSendImage(path: string) : void {

        readFile(path, (err, data: Buffer) => {
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