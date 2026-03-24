export type Subscription = {
  id: string;
  name: string;
  type: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
};

export const subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    type: "Streaming",
    price: 79,
    billing_cycle: "monthly"
  },
  {
    id: "2",
    name: "Spotify",
    type: "Music",
    price: 99,
    billing_cycle: "monthly"
  },
  {
    id: "3",
    name: "Viaplay",
    type: "Streaming",
    price: 129,
    billing_cycle: "monthly"
  }
];

// Helper to add subscriptions at runtime so other modules can import and
// read the same array reference. Keep this simple: push into the exported
// array and return the new item. Consumers that keep local React state should
// also update their state as needed (Edit.tsx does this).
export function addSubscription(sub: Subscription) {
  subscriptions.push(sub);
  return sub;
}