class NArrayTree {
    #nArrayTreeNodes = [];

    add(node) {
        this.#nArrayTreeNodes.push(node);
    }

    findChildById(id) {
        const node = this.#nArrayTreeNodes.find(node => node.key === id);

        if (node) {
            return node;
        }

        return this.#nArrayTreeNodes.findChildById(id);
    }

}

export default NArrayTree;