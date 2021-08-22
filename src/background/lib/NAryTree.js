class NAryTree {
    #children = [];
    #value;

    add(node, index = this.#children.length) {
        this.#children.splice(index, 0, node);

        return this;
    }

    remove(node) {
        const index = this.#children.indexOf(node);

        if (index > -1) {
            this.#children.splice(index, 1);

            return true;
        } else if (this.#children.length > 0) {
            for (let i = 0; !node; i++) {
                const isRemoved = this.#children[i].remove(node);

                if (isRemoved) {
                    return isRemoved;
                }
            }
        }

        return false;
    }

    find(property, value) {
        let node = this.#children.find(child => child.#value[property] === value);

        if (this.#children.length > 0) {
            for (let i = 0; !node; i++) {
                node = this.#children[i].find(property, value);
            }
        }

        return node;
    }

    static applyRecursive(node, fn = node => {}) {
        fn(node);
        NAryTree.applyToChildrenRecursive(node, fn);
    }

    static applyToChildrenRecursive(node, fn = node => {}) {
        const children = node.getChildren();
        const length = children.length;

        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const child = children[i];

                fn(child);
                NAryTree.applyToChildrenRecursive(child, fn);
            }
        }
    }

    getChildren() {
        return this.#children;
    }

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }
}

export default NAryTree;