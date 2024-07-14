import java.util.Arrays;
import java.util.Scanner;

public class Bellman_ford {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Reading number of cities

        int n = scanner.nextInt();

        // Reading the adjacency matrix
        int[][] graph = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                graph[i][j] = scanner.nextInt();
                if (graph[i][j] == 0 && i != j) {
                    graph[i][j] = Integer.MAX_VALUE; // Use Integer.MAX_VALUE for no direct path
                }
            }
        }

        // Reading source and destination cities

        int source = scanner.nextInt();

        int destination = scanner.nextInt();

        // Calculating the minimum distance using Bellman-Ford algorithm
        int result = bellmanFord(graph, n, source, destination);
        if (result == Integer.MAX_VALUE) {
            return;
        } else {
            System.out.println(result);
        }

        scanner.close();
    }

    public static int bellmanFord(int[][] graph, int n, int src, int dest) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        // Relax edges |V| - 1 times
        for (int i = 1; i < n; i++) {
            for (int u = 0; u < n; u++) {
                for (int v = 0; v < n; v++) {
                    if (graph[u][v] != Integer.MAX_VALUE && dist[u] != Integer.MAX_VALUE && dist[u] + graph[u][v] < dist[v]) {
                        dist[v] = dist[u] + graph[u][v];
                    }
                }
            }
        }

        // Check for negative weight cycles
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                if (graph[u][v] != Integer.MAX_VALUE && dist[u] != Integer.MAX_VALUE && dist[u] + graph[u][v] < dist[v]) {
//                    System.out.println("Graph contains negative weight cycle");
                    return Integer.MAX_VALUE;
                }
            }
        }

        return dist[dest];
    }
}
