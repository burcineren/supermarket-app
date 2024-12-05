import { createSelector } from '@ngrx/store';
import { MarketState } from './market.reducer';
import { Market } from './market.model';

export const selectMarketState = (state: { market: MarketState }) => state.market;

export const selectMarkets = createSelector(
  selectMarketState,
  (state: MarketState) => state.markets || []
);

export const selectMarketById = (marketId: number) =>
  createSelector(selectMarkets, (markets: Market[]) =>
    markets.find((market) => market.id === marketId) || null
  );

export const selectSectionsByMarketId = (marketId: number) =>
  createSelector(selectMarketById(marketId), (market) => market?.sections || []);

export const selectProductsBySectionId = (marketId: number, sectionId: string) =>
  createSelector(selectSectionsByMarketId(marketId), (sections) =>
    sections.find((section) => section.id === sectionId)?.products || []
  );
  