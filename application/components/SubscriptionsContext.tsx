import React, { createContext, ReactNode, useContext, useState } from 'react';
import { getUsageForPackage } from './getUsage';
import { Subscription as BaseSubscription, subscriptions as initialSubs } from './subscriptions';

type SubWithUsage = BaseSubscription & { minutes_used?: number; minutes_used_month?: number };

type SubscriptionsContextType = {
  subscriptions: SubWithUsage[];
  addSubscription: (s: BaseSubscription) => void;
  removeSubscription: (id: string) => void;
  runAnalysis: () => Promise<void>;
};

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  // Initialize local state from the exported initialSubs to avoid mutating the
  // module-level array directly and to provide reactive updates.
  const [subs, setSubs] = useState<SubWithUsage[]>(
    initialSubs.map(s => ({ ...s, minutes_used: 0 }))
  );

  function addSubscription(s: BaseSubscription) {
    setSubs(prev => [...prev, { ...s, minutes_used: 0, minutes_used_month: 0 }]);
  }

  function removeSubscription(id: string) {
    setSubs(prev => prev.filter(s => s.id !== id));
  }

  // Run analysis that fills the `minutes_used` for each subscription.
  // This queries usage stats for subscriptions that have a `packageName`.
  async function runAnalysis() {
    // Map over current subscriptions and fetch usage when possible.
    const updated = await Promise.all(
      subs.map(async (sub) => {
        if (sub.packageName) {
          try {
            const [uDay, uMonth] = await Promise.all([
              getUsageForPackage(sub.packageName, 1),
              getUsageForPackage(sub.packageName, 30),
            ]);
            return { ...sub, minutes_used: uDay ? uDay.minutes : 0, minutes_used_month: uMonth ? uMonth.minutes : 0 };
          } catch (err) {
            console.warn('Error fetching usage for', sub.name, err);
            return { ...sub, minutes_used: 0, minutes_used_month: 0 };
          }
        }
        return { ...sub, minutes_used: 0, minutes_used_month: 0 };
      })
    );

    setSubs(updated);
  }

  return (
    <SubscriptionsContext.Provider value={{ subscriptions: subs, addSubscription, removeSubscription, runAnalysis }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
  return ctx;
}
