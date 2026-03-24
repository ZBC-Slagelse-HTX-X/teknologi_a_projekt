import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Subscription as BaseSubscription, subscriptions as initialSubs } from './subscriptions';

type SubWithUsage = BaseSubscription & { minutes_used?: number };

type SubscriptionsContextType = {
  subscriptions: SubWithUsage[];
  addSubscription: (s: BaseSubscription) => void;
  runAnalysis: () => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  // Initialize local state from the exported initialSubs to avoid mutating the
  // module-level array directly and to provide reactive updates.
  const [subs, setSubs] = useState<SubWithUsage[]>(
    initialSubs.map(s => ({ ...s, minutes_used: 0 }))
  );

  function addSubscription(s: BaseSubscription) {
    setSubs(prev => [...prev, { ...s, minutes_used: 0 }]);
  }

  // Simulate an analysis that fills the `minutes_used` for each subscription.
  // For now this assigns random usage values; you can replace this with a
  // real analysis function later.
  function runAnalysis() {
    setSubs(prev => prev.map(sub => ({ ...sub, minutes_used: Math.floor(Math.random() * 300) })));
  }

  return (
    <SubscriptionsContext.Provider value={{ subscriptions: subs, addSubscription, runAnalysis }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
  return ctx;
}
