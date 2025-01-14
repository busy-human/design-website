// eslint-disable-next-line import/no-cycle
import getColors from './colors.js';
import { $element, getMetadata } from './helpers.js';

const RE_RGB = /rgb\((\s?[0-9]{1,3},?){3}\)/i;
const RE_HEX = /#[0-9a-f]{6}/i;
const TRANS_TIME = 500;

const CONSOLE = console;

export const Background = {
  topColor: 'red',
  $container: null,
  $fade1: null,
  $fade2: null,
  $activeFade: null,
  $inactiveFade: null,
  transitionTimeout: null,
  backgroundType: 'light',
  generateTransparentColor(baseColor, format) {
    switch (format) {
      case 'hex':
        return `${baseColor}00`;
      case 'rgb':
        return baseColor.replace(')', ', 0)');
      default:
        throw new Error(`Unrecognized format: ${format}`);
    }
  },
  generateGradientFade(baseColor, format) {
    const startColor = baseColor;
    const endColor = Background.generateTransparentColor(baseColor, format);
    return `linear-gradient(180deg, ${startColor} 0%, ${startColor} 50%, ${endColor} 100%)`;
  },
  setGradientColors(color) {
    if (RE_RGB.test(color)) {
      Background.$activeFade.style.background = Background.generateGradientFade(color, 'rgb');
    } else if (RE_HEX.test(color)) {
      Background.$activeFade.style.background = Background.generateGradientFade(color, 'hex');
    } else {
      CONSOLE.warn(`Background.setColor must be provided a CSS rgb() value or a 6 digit hex value #123456. Received: ${color}`);
    }
  },
  setBackgroundType(_type) {
    this.backgroundType = _type;
    if (_type.toLowerCase() === 'dark') {
      document.body.classList.add('dark-header');
    }
  },
  setColor(color) {
    this.topColor = color;
    Background.transitionColor(color);
  },
  transitionColor(color) {
    Background.$inactiveFade.style.opacity = 1;
    Background.$activeFade.style.opacity = 0;
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.transitionTimeout = setTimeout(() => {
      this.setGradientColors(color);
      Background.$activeFade.style.opacity = 1;
      this.swapActive();
    }, (TRANS_TIME - 3000));
  },
  swapActive() {
    Background.$inactiveFade.style['z-index'] = 1;
    Background.$activeFade.style['z-index'] = 2;
    Background.$inactiveFade.style.opacity = 0;
    Background.$activeFade.style.opacity = 1;
    const newActive = Background.$inactiveFade;
    Background.$inactiveFade = Background.$activeFade;
    Background.$activeFade = newActive;
  },
};

export async function resolvePageBackgroundColor() {
  const colors = await getColors();
  const resolvedColor = getMetadata('color');
  try {
    return colors.byName(resolvedColor);
  } catch (err) {
    return { Value: '#EB211F', BackgroundType: 'light' };
  }
}

async function applyPageBackground() {
  const color = await resolvePageBackgroundColor();
  if (color) {
    Background.setColor(color.Value);
    Background.setBackgroundType(color.BackgroundType);
  }
}

export function decorateBackground() {
  const jobsBack = window.location.pathname.includes('jobs/');
  const toolsBack = window.location.pathname.includes('toolkit/');
  if (jobsBack || toolsBack) {
    if (!Background.$container) {
      Background.$fade1 = $element('.background-fade.fade1');
      Background.$fade2 = $element('.background-fade.fade2');
      Background.$container = $element('#global-background-alt', [
        Background.$fade1,
        Background.$fade2,
      ]);
      Background.$activeFade = Background.$fade1;
      Background.$inactiveFade = Background.$fade2;
      document.body.prepend(Background.$container);
      applyPageBackground();
    }
  } else if (!Background.$container) {
    Background.$fade1 = $element('.background-fade.fade1');
    Background.$fade2 = $element('.background-fade.fade2');
    Background.$container = $element('#global-background', [
      Background.$fade1,
      Background.$fade2,
    ]);
    Background.$activeFade = Background.$fade1;
    Background.$inactiveFade = Background.$fade2;
    document.body.prepend(Background.$container);
    applyPageBackground();
  }
}
