import { fork } from 'redux-saga/effects';
import { cartSaga } from '@/features/cart/model/cart.saga';

// Composition root only: this saga tree just forks each feature's saga.
// Cart persistence/hydration logic itself lives in features/cart/model/cart.saga.ts.
export function* rootSaga() {
  yield fork(cartSaga);
}
