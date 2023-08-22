# from modules.queue import Queue
from BstNode import BstNode

# A node can be a tree, we don't need the container Bst class for now
t = BstNode(0)

x = 0
while x < 100:
    x += 1
    t.insert(x)

print(t)
t.inorder()
print(t.find(10))
# print(t.right.right.right.right)
