import React from 'react';
import { TabsState } from './TabsState';
import { TabItem } from './TabItem';
import { useMemo } from 'react';

interface TabsProps {
  state: TabsState;
}

export function Tabs({ state }: TabsProps) {
  const { items } = state;

  const controls = useMemo(() => {
    return items.map(({ label }, index) => {
      return <TabItem key={label} label={label} index={index} state={state} />;
    });
  }, [items, state]);

  return <>{controls}</>;
}
