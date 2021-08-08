import NArrayTree from "./NArrayTree.js";

class NArrayTreeNode {
    #key;
    #value;
    #children = new NArrayTree();

    constructor(key, value) {
        this.#key = key;
        this.#value = value;
    }

    addChild(node) {
        this.#children.add(node);
    }

    findChildById(id) {
        return this.#children.findChildById(id);
    }

}

export default NArrayTreeNode;