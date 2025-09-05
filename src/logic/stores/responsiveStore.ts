import { writable, derived } from 'svelte/store';
import type { ScreenSize } from '../../types/game';

export interface ResponsiveState {
  screenSize: ScreenSize;
  isLandscape: boolean;
  windowWidth: number;
  windowHeight: number;
  devicePixelRatio: number;
}

export const responsiveStore = writable<ResponsiveState>({
  screenSize: 'desktop',
  isLandscape: false,
  windowWidth: 1024,
  windowHeight: 768,
  devicePixelRatio: 1
});

// Derived stores
export const screenSize = derived(responsiveStore, ($responsive) => $responsive.screenSize);
export const isMobile = derived(responsiveStore, ($responsive) => $responsive.screenSize === 'mobile');
export const isTablet = derived(responsiveStore, ($responsive) => $responsive.screenSize === 'tablet');
export const isDesktop = derived(responsiveStore, ($responsive) => $responsive.screenSize === 'desktop');
export const isLandscape = derived(responsiveStore, ($responsive) => $responsive.isLandscape);

// Actions for responsive store
export const responsiveActions = {
  updateScreenSize: (width: number) => {
    let size: ScreenSize = 'mobile';
    if (width >= 1024) size = 'desktop';
    else if (width >= 768) size = 'tablet';

    responsiveStore.update(state => ({
      ...state,
      screenSize: size,
      windowWidth: width
    }));
  },

  updateDimensions: (width: number, height: number) => {
    const isLandscape = width > height;

    responsiveStore.update(state => ({
      ...state,
      windowWidth: width,
      windowHeight: height,
      isLandscape
    }));
  },

  updateDevicePixelRatio: (ratio: number) => {
    responsiveStore.update(state => ({
      ...state,
      devicePixelRatio: ratio
    }));
  },

  initResponsive: () => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      responsiveActions.updateDimensions(window.innerWidth, window.innerHeight);
      responsiveActions.updateScreenSize(window.innerWidth);
    };

    // Initial update
    updateDimensions();

    // Listen for resize
    window.addEventListener('resize', updateDimensions);

    // Listen for orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDimensions, 100);
    });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }
};
