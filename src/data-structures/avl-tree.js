/* @flow */
import Debug from 'debug';
import { BST, BstNode } from './bst';
import { flow, last, padStart, times, reverse } from 'lodash';

// Watch CLI function for this section
// https://www.geeksforgeeks.org/avl-tree-set-1-insertion/
// https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
// https://www.tutorialspoint.com/data_structures_algorithms/avl_tree_algorithm.htm
// chokidar './packages/data-structures/lib' -c "if [ '{event}' = 'change' ]; then babel-node {path}; fi;"

export class AvlTree extends BST {
  insert(value) {
    // Do the normal BST insert.
    const added = super.insert(value);
    // Let's move up to the root and check balance factors along the way.
    let currentNode = added;
    while (currentNode) {
      this.balance(currentNode);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  // remove(value) {
  //   // Do standard BST removal.
  //   super.remove(value);
  //
  //   // Balance the tree starting from the root node.
  //   this.balance(this.root);
  // }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node) {
    // If balance factor is not OK then try to balance the node.
    console.log(node.balanceFactor);
    if (node.balanceFactor > 1) {
      // Left rotation.
      if (node.left.balanceFactor > 0) {
        // Left-Left rotation
        console.log('rotate left left');
        this.rotateLeftLeft(node);
      } else if (node.left.balanceFactor < 0) {
        // Left-Right rotation.
        console.log('rotate left right');
        this.rotateLeftRight(node);
      }
    } else if (node.balanceFactor < -1) {
      // Right rotation.
      if (node.right.balanceFactor < 0) {
        // Right-Right rotation
        console.log('rotate right right');
        this.rotateRightRight(node);
      } else if (node.right.balanceFactor > 0) {
        // Right-Left rotation.
        console.log('rotate right left');
        this.rotateRightLeft(node);
      }
    }
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftLeft(rootNode) {
    // Detach left node from root node.
    const leftNode = rootNode.left;
    rootNode.children.left = null;

    // Make left node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.children.left = leftNode;
    } else if (rootNode === this.root) {
      // If root node is root then make left node to be a new root.
      this.root = leftNode;
    }

    // If left node has a right child then detach it and
    // attach it as a left child for rootNode.
    if (leftNode.right) {
      rootNode.children.left = leftNode.right;
    }

    // Attach rootNode to the right of leftNode.
    leftNode.children.right = rootNode;
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftRight(rootNode) {
    // Detach left node from rootNode since it is going to be replaced.
    const leftNode = rootNode.left;
    rootNode.children.left = null;

    // Detach right node from leftNode.
    const leftRightNode = leftNode.right;
    leftNode.children.right = null;

    // Preserve leftRightNode's left subtree.
    if (leftRightNode.left) {
      leftNode.children.right = leftRightNode.left;
      leftRightNode.children.left = null;
    }

    // Attach leftRightNode to the rootNode.
    rootNode.children.left = leftRightNode;

    // Attach leftNode as left node for leftRight node.
    leftRightNode.children.left = leftNode;

    // Do left-left rotation.
    this.rotateLeftLeft(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightLeft(rootNode) {
    // Detach right node from rootNode since it is going to be replaced.
    const rightNode = rootNode.right;
    rootNode.children.right = null;

    // Detach left node from rightNode.
    const rightLeftNode = rightNode.left;
    rightNode.children.right = null;

    if (rightLeftNode.right) {
      rightNode.children.right = rightLeftNode.right;
      rightLeftNode.children.right = null;
    }

    // Attach rightLeftNode to the rootNode.
    rootNode.children.right = rightLeftNode;

    // Attach rightNode as right node for rightLeft node.
    rightLeftNode.children.right = rightNode;

    // Do right-right rotation.
    this.rotateRightRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightRight(rootNode) {
    // Detach right node from root node.
    const rightNode = rootNode.right;
    rootNode.children.right = null;

    // Make right node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.children.right = rightNode;
    } else if (rootNode === this.root) {
      // If root node is root then make right node to be a new root.
      this.root = rightNode;
    }

    // If right node has a left child then detach it and
    // attach it as a right child for rootNode.
    if (rightNode.left) {
      rootNode.children.right = rightNode.left;
    }

    // Attach rootNode to the left of rightNode.
    rightNode.children.left = rootNode;
  }
}

console.info('---------------------------------------------------');
const t = new AvlTree();
t.insert(5);
t.insert(6);
t.insert(7);
t.insert(8);
// t.levelTraverse();
// t.insert(9);
// t.insert(10);
// t.printTree();
// console.info('find 4', t.find(4));
// debug('Tree Output - %j', t);
console.info('---------------------------------------------------');
