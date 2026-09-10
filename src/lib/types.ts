/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

export interface TebexCategoryParent {
  id: number;
  name: string;
  slug: string;
}

export interface TebexCategory {
  id: number;
  name: string;
  slug: string;
  /** Empty object `{}` for root categories, populated for subcategories */
  parent: TebexCategoryParent | Record<string, never> | null;
  description: string;
  packages: TebexPackage[];
  order: number;
  display_type: string;
}

export interface TebexPackage {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: string;
  category: {
    id: number;
    name: string;
  };
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  /**
   * Discount AMOUNT in the package currency — not a percentage.
   * Prefer the helpers in `@/lib/pricing`, which derive everything from
   * `base_price` and `total_price` and so cannot be misread.
   */
  discount: number;
  disable_quantity: boolean;
  disable_gifting: boolean;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TebexBasket {
  id: number;
  ident: string;
  complete: boolean;
  email: string | null;
  username: string | null;
  coupons: Array<{ coupon_code: string }>;
  giftcards: Array<{ card_number: string }>;
  creator_code: string;
  cancel_url: string;
  complete_url: string | null;
  complete_auto_redirect: boolean;
  country: string;
  ip: string;
  username_id: number | null;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  packages: TebexBasketPackage[];
  custom: Record<string, unknown> | null;
  links: {
    payment: string;
    checkout: string;
  };
}

export interface TebexBasketPackage {
  id: number;
  name: string;
  quantity: number;
  image: string | null;
  base_price: number;
  total_price: number;
  currency: string;
  qty: number;
  type: string;
}

export interface TebexAuthLink {
  name: string;
  url: string;
}

export interface CartItem {
  packageId: number;
  name: string;
  image: string | null;
  price: number;
  currency: string;
  quantity: number;
}
