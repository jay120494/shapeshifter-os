import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from './prefsStore';

export type WidgetId =
  | 'hero'
  | 'digest'
  | 'patterns'
  | 'actions'
  | 'snippets'
  | 'weather'
  | 'persona'
  | 'extra'
  | 'delay'
  | 'ai'
  | 'pomodoro'
  | 'wellness'
  | 'tea-break'
  | 'recipes';

export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  'hero',
  'digest',
  'patterns',
  'actions',
  'snippets',
  'weather',
  'persona',
  'extra',
  'delay',
  'ai',
  'pomodoro',
  'wellness',
  'tea-break',
  'recipes'
];

interface LayoutState {
  layouts: Partial<Record<Profile, WidgetId[]>>;
  setLayout: (profile: Profile, order: WidgetId[]) => void;
  resetLayout: (profile?: Profile) => void;
}

const VALID_WIDGETS = new Set(DEFAULT_WIDGET_ORDER);

const ensureCompleteOrder = (order: WidgetId[]): WidgetId[] => {
  const seen = new Set<WidgetId>();
  const result: WidgetId[] = [];

  order.forEach(id => {
    if (VALID_WIDGETS.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  });

  DEFAULT_WIDGET_ORDER.forEach(id => {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  });

  return result;
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layouts: {},
      setLayout: (profile, order) => {
        const complete = ensureCompleteOrder(order);
        set(state => ({
          layouts: {
            ...state.layouts,
            [profile]: complete
          }
        }));
      },
      resetLayout: (profile) => {
        set(state => {
          if (!profile) {
            return { layouts: {} };
          }

          const { [profile]: _removed, ...rest } = state.layouts;
          return { layouts: rest };
        });
      }
    }),
    {
      name: 'layout-storage',
      version: 1
    }
  )
);

export const getLayoutForProfile = (profile: Profile, layouts: Partial<Record<Profile, WidgetId[]>>): WidgetId[] => {
  const stored = layouts[profile];
  if (!stored) {
    return [...DEFAULT_WIDGET_ORDER];
  }
  return ensureCompleteOrder(stored);
};
