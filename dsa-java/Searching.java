import java.util.Arrays;

public class Searching {

    // Linear Search
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    // Binary Search (array must be sorted)
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;

        while (low <= high) {
            int mid = (low + high) / 2;

            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    // Main method (testing)
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 4};
        int target = 8;

        // Linear Search
        int linearResult = linearSearch(arr, target);
        System.out.println("Linear Search index: " + linearResult);

        // Binary Search
        Arrays.sort(arr);
        int binaryResult = binarySearch(arr, target);
        System.out.println("Binary Search index (sorted): " + binaryResult);
    }
}
