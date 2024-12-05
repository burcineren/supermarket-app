import { createReducer, on } from '@ngrx/store';
import * as MarketActions from './market.actions';
import { Market } from './market.model';


export interface MarketState {
  markets: Market[];
  error: any;
}

export const initialState: MarketState = {
  markets: [],
  error: null,
};

export const marketReducer = createReducer(
  initialState,
  on(MarketActions.loadMarketsSuccess, (state, { markets }) => ({
    ...state,
    markets,
    error: null,
  })),
  on(MarketActions.loadMarketsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(MarketActions.addSection, (state, { marketId, section }) => {
    const updatedMarkets = state.markets.map((market) =>
      market.id === marketId
        ? { ...market, sections: [...market.sections, section] }
        : market
    );
    return { ...state, markets: updatedMarkets };
  }),
  on(MarketActions.addProduct, (state, { marketId, sectionId, product }) => {
    const updatedMarkets = state.markets.map((market) => {
      if (market.id === marketId) {
        const updatedSections = market.sections.map((section) =>
          section.id === sectionId
            ? { ...section, products: [...section.products, product] }
            : section
        );
        return { ...market, sections: updatedSections };
      }
      return market;
    });
    return { ...state, markets: updatedMarkets };
  })
);