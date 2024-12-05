import { createAction, props } from '@ngrx/store';
import { Market, Section, Product } from './market.model';

// Existing Actions
export const loadMarkets = createAction('[Market API] Load Markets');
export const loadMarketsSuccess = createAction(
  '[Market API] Load Markets Success',
  props<{ markets: Market[] }>()
);
export const loadMarketsFailure = createAction(
  '[Market API] Load Markets Failure',
  props<{ error: any }>()
);

export const addSection = createAction(
  '[Market] Add Section',
  props<{ marketId: number; section: Section }>()
);

export const addProduct = createAction(
  '[Market] Add Product',
  props<{ marketId: number; sectionId: string; product: Product }>()
);

export const moveProduct = createAction(
  '[Market] Move Product',
  props<{
    sourceMarketId: number;
    sourceSectionId: string;
    productId: string;
    targetMarketId: number;
    targetSectionId: string;
  }>()
);

export const deleteProduct = createAction(
  '[Market] Delete Product',
  props<{ marketId: number; sectionId: string; productId: string }>()
);

// New Action: Delete Section
export const deleteSection = createAction(
  '[Market] Delete Section',
  props<{ marketId: number; sectionId: string }>()
);