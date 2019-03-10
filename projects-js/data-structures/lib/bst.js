/* @flow */
import Debug from 'debug';
import { flow, last, times } from 'lodash';

// Watch CLI function for this section
// https://www.geeksforgeeks.org/avl-tree-set-1-insertion/
// https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
// chokidar './packages/data-structures/lib' -c "if [ '{event}' = 'change' ]; then babel-node ./packages/data-structures/lib/bst.js; fi;"

// const debug = Debug('bst:main');

const createTraversalAction = (name: string) => flow([({ val }) => val, BST.debug.extend(name)]);

export class BstNode {
  static debug = Debug('bst:node');

  constructor(val, { height = 0, depth = 0, parent = null, children = { left: null, right: null } } = {}) {
    BstNode.debug('Creating node - val=%o', val);
    this.height = height;
    this.depth = depth;
    this.val = val || null;
    this.count = 1;
    // We are removing the parent for now because it creates a circular json
    // structure which can't be dumped via JSON.stringify, will add it back
    // when needed
    this.parent = parent;
    this.children = children;
  }

  get balanceFactor() {
    return this.left?.height || 0 - this.right?.height || 0;
  }

  get isLeaf() {
    return !(this.children.left || this.children.right);
  }

  get isRootNode() {
    return this.parent === null;
  }

  set left(v) {
    return (this.children.left = v);
  }
  get left() {
    return this.children.left;
  }

  set right(v) {
    return (this.children.right = v);
  }
  get right() {
    return this.children.right;
  }

  get isEmpty() {
    return this.val === null;
  }
}

export class BST {
  static debug = Debug('bst:tree');

  constructor(rootNode) {
    BST.debug('Creating tree');
    this.root = rootNode || null;
  }

  insert(val) {
    if (!this.root) {
      this.root = new BstNode(val);
      return this.root;
    }
    // Handle the case in which we are inserting a value that already exists
    const foundNode = this.find(val);
    if (foundNode) {
      BST.debug('insertion value [%s] already exists, will not insert but will increment node count', val);
      foundNode.count += 1;
      return foundNode;
    }
    return this._insert(val, this.root, [this.root]);
  }

  /**
   * Recursive portion of the insert method.
   * Each time we descend into the tree to make an addition we update the height of the tree.
   * There was an edge case that occured if the val being inserts was already in the array but
   * the edge case is handled in the public insert via looking to see if it exists
   * @private
   * @type {[type]}
   */
  _insert = (val, curNode, nodePath) => {
    nodePath.push(curNode);
    if (val < curNode.val) {
      if (!curNode.left) {
        BST.debug('Insert as LEFT subtree');
        curNode.left = new BstNode(val, { parent: last(nodePath), depth: nodePath.length - 1 });
      } else {
        BST.debug('Descend into LEFT subtree');
        curNode.height += 1;
        return this._insert(val, curNode.left, nodePath);
      }
    } else if (val > curNode.val) {
      if (!curNode.right) {
        BST.debug('Insert as RIGHT subtree');
        curNode.right = new BstNode(val, { parent: last(nodePath), depth: nodePath.length - 1 });
      } else {
        BST.debug('Descend into RIGHT subtree');
        curNode.height += 1;
        return this._insert(val, curNode.right, nodePath);
      }
    }
    return curNode;
  };

  traversals = {
    inOrder: this.inOrder,
    preOrder: this.preOrder,
    postOrder: this.postOrder,
    levelOrder: this.levelOrder
  };

  inOrder = (action = createTraversalAction('inorderTraversal')) => {
    const _traverse = node => {
      if (node.left) _traverse(node.left);
      action(node);
      if (node.right) _traverse(node.right);
    };
    return _traverse(this.root);
  };

  postOrder = (action = createTraversalAction('postOrderTraverse')) => {
    const _traverse = node => {
      if (node.left) _traverse(node.left);
      if (node.right) _traverse(node.right);
      action(node, depth);
    };
    return _traverse(this.root);
  };

  preOrder = (action = createTraversalAction('preOrderTraverse')) => {
    const _traverse = node => {
      action(node);
      if (node.left) _traverse(node.left);
      if (node.right) _traverse(node.right);
    };
    return _traverse(this.root);
  };

  levelOrder = (action = createTraversalAction('levelOrderTraverse')) => {
    const q = [this.root];
    let d = 0;
    while (q.length > 0) {
      const v = q.shift();
      d = v?.depth || d;
      action(v?.val, d);

      v && [v.left, v.right].forEach(node => q.push(node));
    }
  };

  has = (v, node = this.root) => {
    const found = this.find(v, node);
    return !!found;
  };

  find = (v, node = this.root) => {
    if (node && node.val === v) return node;
    if (node && v > node.val) return this.find(v, node.right);
    if (node && v < node.val) return this.find(v, node.left);
    return null;
  };
}

// console.info('---------------------------------------------------');
// const t = new BST();
// t.insert(6);
// t.insert(1);
// t.insert(7);
// t.insert(2);
// t.insert(3);
// t.insert(8);
// t.prettyPrint();
// console.log(t.root.right.right.right.val);
// console.info('find 4', t.find(4));
// debug('Tree Output - %j', t);
// console.info('---------------------------------------------------');
