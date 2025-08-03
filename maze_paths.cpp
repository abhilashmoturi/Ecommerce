#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <tuple>

using namespace std;

const int MOD = 1000000007;

class MazeSolver {
private:
    int N, M, K;
    vector<string> grid;
    map<tuple<int, int, int, int>, long long> memo;
    
public:
    MazeSolver(vector<string>& g, int k) : grid(g), K(k) {
        N = grid.size();
        M = grid[0].size();
    }
    
    bool isValid(int r, int c) {
        return r >= 0 && r < N && c >= 0 && c < M && grid[r][c] == '.';
    }
    
    long long dfs(int row, int col, int day, int lastDirection) {
        // Base case: reached K days
        if (day == K) {
            return (row == 0 && col == 0) ? 1 : 0;
        }
        
        // Check memoization
        auto state = make_tuple(row, col, day, lastDirection);
        if (memo.find(state) != memo.end()) {
            return memo[state];
        }
        
        long long result = 0;
        
        // Determine valid directions based on last move
        // lastDirection: -1 = no previous move, 0 = horizontal, 1 = vertical
        vector<int> validDirections;
        
        if (lastDirection == -1) {  // First move, can go any direction
            validDirections = {0, 1, 2, 3}; // left, right, up, down
        } else if (lastDirection == 0) {  // Last move was horizontal, must go vertical
            validDirections = {2, 3}; // up, down
        } else {  // Last move was vertical, must go horizontal
            validDirections = {0, 1}; // left, right
        }
        
        // Try each valid direction
        for (int direction : validDirections) {
            if (direction == 0) {  // Move left
                int c = col - 1;
                while (c >= 0 && grid[row][c] == '.') {
                    result = (result + dfs(row, c, day + 1, 0)) % MOD;
                    c--;
                }
            } else if (direction == 1) {  // Move right
                int c = col + 1;
                while (c < M && grid[row][c] == '.') {
                    result = (result + dfs(row, c, day + 1, 0)) % MOD;
                    c++;
                }
            } else if (direction == 2) {  // Move up
                int r = row - 1;
                while (r >= 0 && grid[r][col] == '.') {
                    result = (result + dfs(r, col, day + 1, 1)) % MOD;
                    r--;
                }
            } else if (direction == 3) {  // Move down
                int r = row + 1;
                while (r < N && grid[r][col] == '.') {
                    result = (result + dfs(r, col, day + 1, 1)) % MOD;
                    r++;
                }
            }
        }
        
        memo[state] = result;
        return result;
    }
    
    long long solve() {
        // Start DFS from position (0, 0) with no previous direction (-1)
        return dfs(0, 0, 0, -1);
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M, K;
    cin >> N >> M >> K;
    
    vector<string> grid(N);
    for (int i = 0; i < N; i++) {
        cin >> grid[i];
    }
    
    MazeSolver solver(grid, K);
    cout << solver.solve() << endl;
    
    return 0;
}

/*
Example Test Cases:

Test 1:
Input:
2 2 2
..
..

Expected: Should find paths that return to (1,1) in exactly 2 days with alternating movement

Test 2:
Input:
3 3 4
...
.#.
...

Expected: Should find paths around the wall that return to start in 4 days

The algorithm works as follows:
1. Use DFS with memoization to explore all possible paths
2. Track current position, day, and last movement direction
3. Enforce alternating movement constraint (horizontal -> vertical -> horizontal...)
4. Each move must go through at least one empty cell in the chosen direction
5. Count paths that return to starting position (1,1) within K days
6. Use modular arithmetic to handle large numbers
*/