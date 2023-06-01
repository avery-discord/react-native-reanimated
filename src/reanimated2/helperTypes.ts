import {
  ColorValue,
  MatrixTransform,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  StyleProp,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native';
import {
  AnimatableValue,
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  ILayoutAnimationBuilder,
  LayoutAnimationFunction,
  SharedValue,
} from '.';

type Adaptable<T> = T | ReadonlyArray<T | ReadonlyArray<T>> | SharedValue<T>;

type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P]>;
};

interface TransformsStyle {
  transform?:
    | (
        | PerpectiveTransform
        | RotateTransform
        | RotateXTransform
        | RotateYTransform
        | RotateZTransform
        | ScaleTransform
        | ScaleXTransform
        | ScaleYTransform
        | TranslateXTransform
        | TranslateYTransform
        | SkewXTransform
        | SkewYTransform
        | MatrixTransform
      )[]
    | undefined;
}

type TransformStyleTypes = TransformsStyle['transform'] extends
  | readonly (infer T)[]
  | undefined
  ? T
  : never;
type AnimatedTransform = AdaptTransforms<TransformStyleTypes>[];

export type AnimateStyle<S> = {
  [K in keyof S]: K extends 'transform'
    ? AnimatedTransform
    : S[K] extends ReadonlyArray<any>
    ? ReadonlyArray<AnimateStyle<S[K][0]>>
    : S[K] extends object
    ? AnimateStyle<S[K]>
    : S[K] extends ColorValue | undefined
    ? S[K] | number
    : S[K] | SharedValue<AnimatableValue>;
};

type StylesOrDefault<T> = 'style' extends keyof T
  ? T['style']
  : Record<string, unknown>;

export type AnimateProps<P extends object> = {
  [K in keyof Omit<P, 'style'>]: P[K] | SharedValue<P[K]>;
} & {
  style?: StyleProp<AnimateStyle<StylesOrDefault<P>>>;
} & {
  animatedProps?: Partial<AnimateProps<P>>;
  layout?:
    | BaseAnimationBuilder
    | LayoutAnimationFunction
    | typeof BaseAnimationBuilder;
  entering?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe;
  exiting?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe;
  sharedTransitionTag?: string;
  sharedTransitionStyle?: ILayoutAnimationBuilder;
};
