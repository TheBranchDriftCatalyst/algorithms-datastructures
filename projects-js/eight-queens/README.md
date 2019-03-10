# `@babel-sandbox/eight-queens`

## Notes

We can utilize the slope of any given 2 points to determine if there will be a queen collision.
Proof is below. Further optimization would include reflections, and rotations of exisisting solutions however the
outstanding question here is how do we know we have gotten all the 'base/primary solutions' i.e., those
that are the transformation roots.  Another possible solution is itterative repair, e.g., we place all the queens
then we find the queen with the most collisions and move it to a square with the least colisions, and continue doing this.
However due to the nature of the greedy hueristic algorithms this could reach a local mininum- we can avoid this by
constraining the initial state to a 'optimal' initial state which would be like adding a queen to each row and column.  
The greedy algorithm can theoreticaly achieve better results at higher orders of magnitude (1,000,000 queens)

## Slope Proof

> This is less of a proof right now than scratch work.  Might try to apply proof by induction here at some point.

```
[
 [ (0, 0), (0, 1), (0, 2), (0, 3), (0, 4), ...]
 [ (1, 0), (1, 1), (1, 2), (1, 3), (1, 4), ...]
 [ (2, 0), (2, 1), (2, 2), (2, 3), (2, 4), ...]
 [ (3, 0), (3, 1), (3, 2), (3, 3), (3, 4), ...]
 [ (4, 0), (4, 1), (4, 2), (4, 3), (4, 4), ...]
 ...
]
```

**Diagonals**
```
(0,0), (3,3) = (3 - 0) / (3 - 0) = 1
(2,0), (1,1) = 1 - 0 / 1 - 2 = -1 = abs(-1) = 1
(7,1), (2,6) = 6 - 1 / 2 - 7 = -1 = abs(-1) = 1
```

**Horizontal**
```
(0,0), (0,4) =  4 - 0 / 0 - 0 = Infinity
```
**vertical**
```
(1,1), (6,1) = (1 - 1) / (6 - 1) = 0
```
**Point overlap**
```
1,1 1,1 = 1-1/1-1 = NaN
```
> the current implementation avoids this (point overlap) case entirely

## Results of Backtracking Strategy

```
solver4: 0.938ms queens=4 solutionCount=2
solver5: 0.342ms queens=5 solutionCount=10
solver6: 1.275ms queens=6 solutionCount=4
solver7: 3.067ms queens=7 solutionCount=40
solver8: 9.361ms queens=8 solutionCount=92
solver9: 11.924ms queens=9 solutionCount=352
solver10: 37.845ms queens=10 solutionCount=724
solver11: 163.533ms queens=11 solutionCount=2680
solver12: 943.647ms queens=12 solutionCount=14200
solver13: 5631.659ms queens=13 solutionCount=73712
solver14: 38734.364ms queens=14 solutionCount=365596
We blow out the stack at n > 15
```
