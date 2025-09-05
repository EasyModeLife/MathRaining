// =========================
// 📱 RESPONSIVE TYPES
// =========================

// Breakpoint definitions
export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  xlarge?: number;
}

// Screen size utilities
export type Orientation = 'portrait' | 'landscape';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Window dimensions
export interface WindowSize {
  width: number;
  height: number;
  orientation: Orientation;
  aspectRatio: number;
}

// Container query sizes
export interface ContainerSize {
  width: number;
  height: number;
}

// Responsive config for different components
export interface ResponsiveConfig {
  breakpoints: Breakpoints;
  grid: {
    columns: Record<DeviceType, number>;
    gap: Record<DeviceType, string>;
  };
  spacing: {
    padding: Record<DeviceType, string>;
    margin: Record<DeviceType, string>;
  };
  typography: {
    scale: Record<DeviceType, number>;
    lineHeight: Record<DeviceType, number>;
  };
}

// Media query helpers
export type MediaQueryType = 'min-width' | 'max-width' | 'orientation';

// Provide context functions
export interface ResponsiveContext {
  screenSize: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Configuration for responsive text sizing
export interface ResponsiveSizingConfig {
  breakpoints: Breakpoints;
  fontScaling: Record<DeviceType, {
    baseSize: number;
    minSize: number;
    maxSize: number;
    scalingFactor: number;
  }>;
  containerQueries: {
    enabled: boolean;
    baseSize: number;
    maxWidth: number;
  };
}
