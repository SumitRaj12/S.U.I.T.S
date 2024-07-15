import java.util.Scanner;

public class tsp {

    // Function to calculate the minimum cost path
    private static int tsp(int[][] graph, boolean[] visited, int currPos, int n, int count, int cost, int ans) {
        if (count == n && graph[currPos][0] > 0) {
            return Math.min(ans, cost + graph[currPos][0]);
        }

        for (int i = 0; i < n; i++) {
            if (!visited[i] && graph[currPos][i] > 0) {
                visited[i] = true;
                ans = tsp(graph, visited, i, n, count + 1, cost + graph[currPos][i], ans);
                visited[i] = false;
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Taking input for the number of cities
//        System.out.print("Enter the number of cities: ");
        int n = sc.nextInt();

        // Taking input for the distance matrix
        int[][] graph = new int[n][n];
//        System.out.println("Enter the distance matrix:");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                graph[i][j] = sc.nextInt();
            }
        }

        // Initializing the visited array and the answer
        boolean[] visited = new boolean[n];
        visited[0] = true;
        int ans = Integer.MAX_VALUE;

        // Calling the tsp function
        ans = tsp(graph, visited, 0, n, 1, 0, ans);

        // Printing the result
        System.out.println(ans);
    }
}
