import java.util.Arrays;

public class Sorting {

    // Bubble Sort
    public static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // Selection Sort
    public static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            int min = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[min]) {
                    min = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
        }
    }

    // Insertion Sort
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    // Main method (testing)
    public static void main(String[] args) {
        int[] arr1 = {5, 3, 8, 1, 4};
        int[] arr2 = arr1.clone();
        int[] arr3 = arr1.clone();

        bubbleSort(arr1);
        System.out.println("Bubble Sort: " + Arrays.toString(arr1));

        selectionSort(arr2);
        System.out.println("Selection Sort: " + Arrays.toString(arr2));

        insertionSort(arr3);
        System.out.println("Insertion Sort: " + Arrays.toString(arr3));
    }
}
