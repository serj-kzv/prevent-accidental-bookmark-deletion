export interface Handler {
    init(): Promise<void>;
    start(): void;
    stop(): void;
}