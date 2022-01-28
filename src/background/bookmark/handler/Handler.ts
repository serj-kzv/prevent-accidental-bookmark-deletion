export interface Handler {
    start(): void;
    stop(): void;
    handle(): void;
}