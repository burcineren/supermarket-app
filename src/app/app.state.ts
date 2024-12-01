import { Action, ActionReducer } from "@ngrx/store";
import { MarketEffects } from "./core/stores/markets/market.effects";
import { MarketState, marketReducer } from "./core/stores/markets/market.reducer";

export interface AppState {
  reservation: MarketState;
}
export interface AppStore {
    market: ActionReducer<MarketState, Action>;
}
export const appStore: AppStore = {
  market: marketReducer
}
export const appEffects = [MarketEffects];