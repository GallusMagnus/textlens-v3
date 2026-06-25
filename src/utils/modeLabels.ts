export function getAnalysisModeLabel(mode?: string) {
  switch (mode) {
    case 'consumer':
      return 'Community / General Review Mode';
    case 'general':
      return 'Consensus Standards Mode';
    case 'healthcare':
      return 'Healthcare Publishing Mode';
    case 'academic':
      return 'Academic/University Mode';
    case 'bccsa':
      return 'BCCSA Mode';
    case 'press_code':
      return 'Press Code Mode';
    case 'accountability':
      return 'Accountability Mode';
    default:
      return mode || 'Unspecified Mode';
  }
}
