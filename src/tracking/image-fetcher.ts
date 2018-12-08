
export type ImageCallback = (image:Buffer) => void;

export interface ImageFetcher {
    imageCallback: ImageCallback;
    initialize(): void;
    shutdown(): void;
}