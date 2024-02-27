import React from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text } from 'react-native';
import type { TabsState } from './TabsState';

const styles = StyleSheet.create({
  item: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 0,
    paddingHorizontal: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

interface TabItemProps {
  label: string;
  index: number;
  state: TabsState;
}

export function TabItem({ label, index, state }: TabItemProps) {
  const { setItemDimensions } = state;

  function handleLayout(event: LayoutChangeEvent) {
    setItemDimensions(index, event.nativeEvent.layout);
  }

  return (
    <Pressable
      style={styles.item}
      onLayout={handleLayout}
      accessibilityRole="tab">
      <Text numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}
