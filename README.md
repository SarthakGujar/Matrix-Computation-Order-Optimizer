# Matrix Computation Order Optimizer

## Problem Statement

Matrix Chain Multiplication is an optimization problem that determines the most efficient order for multiplying a sequence of matrices. Although the matrices must remain in their original order, different ways of placing parentheses can result in significantly different numbers of scalar multiplications.

The objective of this project is to develop a Dynamic Programming-based Matrix Computation Order Optimizer that finds the parenthesization requiring the minimum number of scalar multiplications.

The program accepts the number of matrices and their compatible dimension sequence `p0, p1, ..., pn`, validates the input dimensions, and uses a bottom-up Dynamic Programming approach to calculate the optimal multiplication cost.

## Key Features

* Accepts and validates matrix dimension sequences.
* Calculates the minimum scalar multiplication cost.
* Builds a cost table and split table.
* Uses bottom-up Dynamic Programming.
* Reconstructs and displays the optimal parenthesization.
* Handles invalid or non-positive dimensions.
* Demonstrates different multiplication groupings and their corresponding costs.
* Shows the computational saving achieved by choosing the optimal order.

## Core Concept

For matrices:

`A1 = p0 × p1, A2 = p1 × p2, ..., An = p(n-1) × pn`

The program evaluates every possible split and selects the one with the minimum cost:

`m[i][j] = min(m[i][k] + m[k+1][j] + p[i-1] × p[k] × p[j])`

## Complexity

* Time Complexity: O(n³)
* Space Complexity: O(n²)

This project demonstrates how Dynamic Programming can optimize matrix multiplication by avoiding unnecessary computations and reusing previously calculated subproblems.

