class NAryTree {
    #children = [];

    add(node, index = this.#children.length) {
        this.#children.splice(index, 0, node);

        return this;
    }

    remove(node) {
        const index = this.#children.indexOf(node);

        if (index > -1) {
            this.#children.splice(index, 1);
        }

        return this;
    }

    find(property, value) {
        let node = this.#children.find(child => child[property] === value);

        if (this.#children.length > 0) {
            for (let i = 0; !node; i++) {
                node = this.#children[i].find(property, value);
            }
        }

        return node;
    }
}

export default NAryTree;