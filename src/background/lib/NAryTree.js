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

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }
}

export default NAryTree;