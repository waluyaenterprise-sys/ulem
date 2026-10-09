type AdaptiveNameOptions = {
  maxRem?: number;
  minRem?: number;
  startAt?: number;
  endAt?: number;
  lineHeight?: number;
  letterSpacingEm?: number;
};

function normalizedLength(name: string) {
  return name.replace(/\s+/g, ' ').trim().length;
}

export function getAdaptiveNameStyle(name: string, options: AdaptiveNameOptions = {}) {
  const {
    maxRem = 2.25,
    minRem = 1.35,
    startAt = 12,
    endAt = 26,
    lineHeight = 1.05,
    letterSpacingEm = -0.02
  } = options;

  const length = normalizedLength(name);
  const ratio = Math.min(1, Math.max(0, (length - startAt) / Math.max(1, endAt - startAt)));
  const size = maxRem - (maxRem - minRem) * ratio;

  return [
    `font-size:${size.toFixed(3)}rem`,
    `line-height:${lineHeight}`,
    `letter-spacing:${letterSpacingEm}em`,
    'overflow-wrap:anywhere',
    'text-wrap:balance'
  ].join(';');
}
