class BstNodeMeta(type):
    def __new__(cls, name, bases, body):
        print('BaseMeta.__new__', cls, name, bases)
        return super().__new__(cls, name, bases, body)


class BstNode(metaclass=BstNodeMeta):
    def __init__(self, val, left=None, right=None):
        self.val = val

    @property
    def height(self):
        return 0

    @property
    def balance_factor(self):
        return self.left.height - self.right.height

    def insert(self, val):
        found = self.find(val)
        if found:
            print('Value exists not adding to tree {}'.format(found))
            return found
        print('insert - {}'.format(val))
        node = BstNode(val)
        # TODO: still need to handle edge case when tree is
        # empty and when val being added is already present
        return self.insert_r(self, node)

    def insert_r(self, c_node, new_node):
        if (new_node.val < c_node.val):
            if c_node.left:
                print('dsc left')
                return self.insert_r(c_node.left, new_node)
            else:
                print('setting left')
                c_node.left = new_node
                return c_node
        if (new_node.val > c_node.val):
            if c_node.right:
                print('dsc right')
                return self.insert_r(c_node.right, new_node)
            else:
                print('setting right')
                c_node.right = new_node
                return c_node

    def inorder(self, c_node=None):
        if not c_node:
            c_node = self
        if (c_node.left):
            return self.inorder(c_node.left)
        print(c_node)
        if (c_node.right):
            return self.inorder(c_node.left)

    def find(self, val):
        return self.__find_r(val, c_node=self)

    def __find_r(self, val, c_node=None):
        if c_node.val == val:
            print('found it {}'.format(c_node))
            return c_node
        elif (val < c_node.val and c_node.left):
            return self.__find_r(val, c_node=c_node.left)
        elif (val > c_node.val and c_node.right):
            return self.__find_r(val, c_node=c_node.right)
        else:
            return None

    def __repr__(self):
        return str(self.val)

    def __len__(self):
        return self.height

    def bfs_traversal(self, process):
        return 'todo'
