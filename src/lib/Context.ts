class Context {

    private cache = new Map();

    public register(name: string, object: object): void {
        this.cache.set(name, object);
    }

    public lookup(name: string): any {
        return this.cache.get(name);
    }
}

export default new Context();