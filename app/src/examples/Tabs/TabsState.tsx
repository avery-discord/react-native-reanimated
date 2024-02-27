import { useCallback, useMemo } from 'react';
import { LayoutRectangle } from 'react-native';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

export interface TabItemType {
  label: string;
}

export interface TabsState {
  items: TabItemType[];
  itemDimensions: SharedValue<LayoutRectangle[]>;
  setItemDimensions: (index: number, dimensions: LayoutRectangle) => void;
}

interface UseTabsStateOptions {
  items: TabItemType[];
}

export function useTabsState({ items }: UseTabsStateOptions) {
  const itemDimensions = useSharedValue<LayoutRectangle[]>([]);
  const setItemDimensions = useCallback(
    (index: number, dimensions: LayoutRectangle) => {
      // Assign first, then copy the array to a new object to tell reanimated that it has changed.
      itemDimensions.value[index] = dimensions;
      // If the number of items shrinks, can prune off invalid index item dimensions.
      itemDimensions.value = [...itemDimensions.value].slice(0, items.length);
      console.log(`--${index}--`);
      console.log('dimensions:', dimensions);
      console.log('itemDimensions:', itemDimensions.value);
    },
    [itemDimensions, items.length]
  );

  return useMemo(
    () => ({
      items,
      itemDimensions,
      setItemDimensions,
    }),
    [items, itemDimensions, setItemDimensions]
  );
}
