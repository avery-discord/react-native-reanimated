import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTabsState } from './TabsState';
import { Tabs } from './Tabs';

export default function TabsExample() {
  const state = useTabsState({
    items: [
      { label: 'one' },
      { label: 'two' },
      { label: 'three' },
      { label: 'four' },
      { label: 'five' },
    ],
  });
  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
      <Tabs state={state} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
