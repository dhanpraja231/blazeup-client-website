// layouts.ts

export type LayoutId = 'none' | 'diagonal' | 'half-vertical' | 'half-horizontal' | 'arrow' | 'stripe';

export interface CardLayout {
  id: LayoutId;
  name: string;
  // The clip-path string cuts the OVERLAY layer into shape.
  // The BASE layer is always fully visible behind it.
  clipPath: {
    horizontal: string;
    vertical: string;
  };
}

export const CARD_LAYOUTS: CardLayout[] = [
  {
    id: 'none',
    name: 'Solid / None',
    clipPath: {
      horizontal: 'polygon(0 0, 0 0, 0 0, 0 0)', // Invisible overlay
      vertical: 'polygon(0 0, 0 0, 0 0, 0 0)',
    }
  },
  {
    id: 'diagonal',
    name: 'Diagonal Slash',
    clipPath: {
      horizontal: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)',
      vertical: 'polygon(0 60%, 100% 40%, 100% 100%, 0% 100%)',
    }
  },
  {
    id: 'half-vertical',
    name: 'Vertical Split',
    clipPath: {
      horizontal: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
      vertical: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)',
    }
  },
  {
    id: 'half-horizontal',
    name: 'Horizontal Split',
    clipPath: {
      horizontal: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)',
      vertical: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
    }
  },
  {
    id: 'arrow',
    name: 'Arrowhead',
    clipPath: {
      horizontal: 'polygon(0% 0%, 65% 0%, 100% 50%, 65% 100%, 0% 100%)',
      vertical: 'polygon(0% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%)',
    }
  },
  {
    id: 'stripe',
    name: 'Center Band',
    clipPath: {
      horizontal: 'polygon(25% 0, 55% 0, 75% 100%, 45% 100%)',
      vertical: 'polygon(0 35%, 100% 35%, 100% 65%, 0 65%)',
    }
  }
];
