import java.util.*;

public class scheduling{
    public static void sort(int[][] arr, int i, int s, int e, boolean reverse) {
        if (reverse) {
            Arrays.sort(arr, s, e, (a, b) -> Integer.compare(b[i], a[i]));
        } else {

            Arrays.sort(arr, s, e,(a,b)->Integer.compare(a[i],b[i]));
        }
    }
    public static Object[] schedule(int[][] arr) {
        Queue<int[]> queue = new LinkedList<>();
        List<Integer> result = new ArrayList<>();
        int time = arr[0][1], j = 1;

        sort(arr, 1, 0, arr.length, false); // sorting based on arrival time in ascending order
        queue.offer(arr[0]); // add the first patient

        while (!queue.isEmpty()) {
            int[] top = queue.poll();
            time += top[3];
            result.add(top[0]);

            int start = j, end = j;
            while (j < arr.length && arr[j][1] <= time) {
                end++;
                j++;
            }

            if (start != end) {
                sort(arr, 2, start, end, true); // sort based on priority in descending order
                for (int k = start; k < end; k++) {
                    queue.offer(arr[k]);
                }
            }
        }

        return result.toArray();
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] arr = new int[n][4];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 4; j++) {
                arr[i][j] = sc.nextInt();
            }
        }


        Object[] ans = schedule(arr);
        for (Object i : ans) {
            System.out.print(i + " ");
        }
        sc.close();
    }
}
