def count_maze_paths(grid, K):
    """
    Count the number of distinct valid paths in a maze with alternating movement constraints.
    
    Args:
        grid: N x M grid where '.' is empty and '#' is wall
        K: Maximum number of days for the journey
    
    Returns:
        Number of distinct valid paths modulo 10^9+7
    """
    MOD = 10**9 + 7
    N, M = len(grid), len(grid[0])
    
    # Memoization cache: (row, col, day, last_direction)
    # last_direction: 0 = horizontal, 1 = vertical, -1 = no previous move
    memo = {}
    
    def is_valid(r, c):
        return 0 <= r < N and 0 <= c < M and grid[r][c] == '.'
    
    def dfs(row, col, day, last_direction):
        # Base case: reached K days
        if day == K:
            return 1 if (row == 0 and col == 0) else 0
        
        # Check memo
        state = (row, col, day, last_direction)
        if state in memo:
            return memo[state]
        
        result = 0
        
        # Determine valid directions based on last move
        if last_direction == -1:  # First move, can go any direction
            valid_directions = ['left', 'right', 'up', 'down']
        elif last_direction == 0:  # Last move was horizontal, must go vertical
            valid_directions = ['up', 'down']
        else:  # Last move was vertical, must go horizontal
            valid_directions = ['left', 'right']
        
        # Try each valid direction
        for direction in valid_directions:
            if direction == 'left':
                # Move left through at least one empty cell
                c = col - 1
                while c >= 0 and grid[row][c] == '.':
                    result = (result + dfs(row, c, day + 1, 0)) % MOD
                    c -= 1
            elif direction == 'right':
                # Move right through at least one empty cell
                c = col + 1
                while c < M and grid[row][c] == '.':
                    result = (result + dfs(row, c, day + 1, 0)) % MOD
                    c += 1
            elif direction == 'up':
                # Move up through at least one empty cell
                r = row - 1
                while r >= 0 and grid[r][col] == '.':
                    result = (result + dfs(r, col, day + 1, 1)) % MOD
                    r -= 1
            elif direction == 'down':
                # Move down through at least one empty cell
                r = row + 1
                while r < N and grid[r][col] == '.':
                    result = (result + dfs(r, col, day + 1, 1)) % MOD
                    r += 1
        
        memo[state] = result
        return result
    
    # Start DFS from position (0, 0) with no previous direction
    return dfs(0, 0, 0, -1)


def solve_maze_problem():
    """
    Main function to solve the maze path counting problem.
    Reads input and outputs the result.
    """
    # Read input
    N, M, K = map(int, input().split())
    grid = []
    for _ in range(N):
        grid.append(list(input().strip()))
    
    # Solve and print result
    result = count_maze_paths(grid, K)
    print(result)


# Example usage and test cases
if __name__ == "__main__":
    # Test case 1: Simple 2x2 grid
    test_grid_1 = [
        ['.', '.'],
        ['.', '.']
    ]
    K1 = 2
    print(f"Test 1 - Grid: {test_grid_1}, K: {K1}")
    print(f"Result: {count_maze_paths(test_grid_1, K1)}")
    print()
    
    # Test case 2: 3x3 grid with walls
    test_grid_2 = [
        ['.', '.', '.'],
        ['.', '#', '.'],
        ['.', '.', '.']
    ]
    K2 = 4
    print(f"Test 2 - Grid: {test_grid_2}, K: {K2}")
    print(f"Result: {count_maze_paths(test_grid_2, K2)}")
    print()
    
    # Uncomment the line below to run with actual input
    # solve_maze_problem()