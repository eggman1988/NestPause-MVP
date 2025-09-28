// Design System Types for NestPause
import { colors, typography, spacing, borderRadius, shadows, animation, sizes, zIndex, themes } from '../constants/tokens';

// Theme Types
export type ThemeMode = 'light' | 'dark';
export type Theme = typeof themes.light | typeof themes.dark;

// Color Types
export type ColorScale = typeof colors.primary;
export type ColorKey = keyof typeof colors;
export type ColorShade = keyof ColorScale;

// Typography Types
export type FontFamily = keyof typeof typography.fontFamily;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;

// Spacing Types
export type SpacingKey = keyof typeof spacing;

// Border Radius Types
export type BorderRadiusKey = keyof typeof borderRadius;

// Shadow Types
export type ShadowKey = keyof typeof shadows;

// Animation Types
export type AnimationDuration = keyof typeof animation.duration;
export type AnimationEasing = keyof typeof animation.easing;

// Size Types
export type ButtonSize = keyof typeof sizes.button;
export type InputSize = keyof typeof sizes.input;
export type IconSize = keyof typeof sizes.icon;

// Z-Index Types
export type ZIndexKey = keyof typeof zIndex;

// Component Variant Types
export type ComponentVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
export type ComponentSize = 'sm' | 'md' | 'lg';

// Base Component Props
export interface BaseComponentProps {
  testID?: string;
  style?: any;
  children?: React.ReactNode;
}

// Theme Context Types
export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

// Button Types
export interface ButtonProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// Input Types
export interface InputProps extends BaseComponentProps {
  value?: string;
  placeholder?: string;
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
}

// Card Types
export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: SpacingKey;
  shadow?: ShadowKey;
  onPress?: () => void;
}

// Typography Types
export interface TypographyProps extends BaseComponentProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'label' | 'button' | 'overline';
  size?: FontSize;
  weight?: FontWeight;
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  accessibilityRole?: 'header' | 'text' | 'button' | 'link' | 'image' | 'none';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Layout Types
export interface ContainerProps extends BaseComponentProps {
  padding?: SpacingKey | SpacingKey[];
  margin?: SpacingKey | SpacingKey[];
  backgroundColor?: string;
  flex?: number;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: SpacingKey;
}

// Icon Types
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: IconSize;
  color?: string;
  family?: 'MaterialIcons' | 'Ionicons' | 'Feather' | 'MaterialCommunityIcons';
}

// Badge Types
export interface BadgeProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  text: string;
}

// Avatar Types
export interface AvatarProps extends BaseComponentProps {
  size?: IconSize;
  source?: { uri: string } | number;
  name?: string;
  backgroundColor?: string;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  dismissible?: boolean;
}

// Toast Types
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
}

// Loading Types
export interface LoadingProps extends BaseComponentProps {
  size?: ComponentSize;
  color?: string;
  text?: string;
}

// Divider Types
export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: SpacingKey;
}

// Progress Types
export interface ProgressProps extends BaseComponentProps {
  value: number; // 0-100
  size?: ComponentSize;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

// Switch Types
export interface SwitchProps extends BaseComponentProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
}

// Checkbox Types
export interface CheckboxProps extends BaseComponentProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  color?: string;
}

// Radio Types
export interface RadioProps extends BaseComponentProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  color?: string;
}

// Slider Types
export interface SliderProps extends BaseComponentProps {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  onValueChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
  color?: string;
  trackColor?: string;
  thumbColor?: string;
}

// Tab Types
export interface TabItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps extends BaseComponentProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

// List Types
export interface ListItemProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface ListProps extends BaseComponentProps {
  items: ListItemProps[];
  variant?: 'default' | 'inset' | 'grouped';
}

// Form Types
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}

// Navigation Types
export interface TabBarProps extends BaseComponentProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export interface HeaderProps extends BaseComponentProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  variant?: 'default' | 'large' | 'minimal';
}

// Utility Types
export type SpacingValue = number | string;
export type ColorValue = string;
export type SizeValue = number | string;

// Responsive Types
export type BreakpointKey = keyof typeof import('../constants/tokens').breakpoints;
export type ResponsiveValue<T> = T | { [K in BreakpointKey]?: T };

// Animation Types
export interface AnimationConfig {
  duration: AnimationDuration;
  easing: AnimationEasing;
  delay?: number;
}

// Accessibility Types
export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
}

// Export all component props as a union for type checking
export type ComponentProps = 
  | ButtonProps
  | InputProps
  | CardProps
  | TypographyProps
  | ContainerProps
  | IconProps
  | BadgeProps
  | AvatarProps
  | ModalProps
  | LoadingProps
  | DividerProps
  | ProgressProps
  | SwitchProps
  | CheckboxProps
  | RadioProps
  | SliderProps
  | TabsProps
  | ListProps
  | FormFieldProps
  | FormProps
  | TabBarProps
  | HeaderProps;
