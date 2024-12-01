
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as MarketActions from './market.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MarketService } from '../../services/market.service';

@Injectable()
export class MarketEffects {
  constructor(
    private actions$: Actions,
    private marketService: MarketService
  ) {}

  loadMarkets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.loadMarkets),
      mergeMap(() =>
        this.marketService.getMarkets().pipe(
          map((markets) => MarketActions.loadMarketsSuccess({ markets })),
          catchError((error) => of(MarketActions.loadMarketsFailure({ error })))
        )
      )
    )
  );

}