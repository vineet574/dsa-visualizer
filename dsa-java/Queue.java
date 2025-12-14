public class Queue {

    private int[] queue;
    private int front;
    private int rear;
    private int capacity;

    // Constructor
    public Queue(int capacity) {
        this.capacity = capacity;
        queue = new int[capacity];
        front = 0;
        rear = -1;
    }

    // Enqueue operation
    public void enqueue(int value) {
        if (rear == capacity - 1) {
            System.out.println("Queue Overflow");
            return;
        }
        queue[++rear] = value;
        System.out.println("Enqueued: " + value);
    }

    // Dequeue operation
    public int dequeue() {
        if (front > rear) {
            System.out.println("Queue Underflow");
            return -1;
        }
        int removed = queue[front++];
        System.out.println("Dequeued: " + removed);
        return removed;
    }

    // Display queue
    public void display() {
        System.out.print("Queue: ");
        for (int i = front; i <= rear; i++) {
            System.out.print(queue[i] + " ");
        }
        System.out.println();
    }

    // Main method (for testing)
    public static void main(String[] args) {
        Queue q = new Queue(5);

        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.display();

        q.dequeue();
        q.display();
    }
}
