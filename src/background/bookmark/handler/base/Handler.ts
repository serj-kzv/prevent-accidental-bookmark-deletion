export interface Handler {
    init(): void;
    start(): void;
    stop(): void;
}