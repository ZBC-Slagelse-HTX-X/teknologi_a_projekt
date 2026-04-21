export type Subscription = {
  id: string;
  name: string;
  type: string;
  price: number;
  time_used: number;
  billing_cycle: "monthly" | "yearly";
  packageName?: string;
};

export const subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    type: "Streaming",
    price: 79,
    billing_cycle: "monthly",
    time_used: 0,
    packageName: 'com.netflix.mediaclient',
  },
  {
    id: "2",
    name: "Spotify",
    type: "Music",
    price: 99,
    billing_cycle: "monthly",
    time_used: 0,
    packageName: 'com.spotify.music',
  },
  {
    id: "3",
    name: "Tv2 Play",
    type: "Streaming",
    price: 129,
    billing_cycle: "monthly",
    time_used: 0,
    packageName: 'dk.tv2.tv2play',
  }
];


export function addSubscription(sub: Subscription) {
  subscriptions.push(sub);
  return sub;
}