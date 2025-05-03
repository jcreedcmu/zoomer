import { Dispatch } from "./action";
import { AppState } from "./state";

export type Effect =
  | { t: 'alert' }
  ;

export function doEffect(state: AppState, dispatch: Dispatch, effect: Effect): void {
  switch (effect.t) {
    case 'alert': {
      (async () => {
        alert('example side effect. writing to file on server side.');
        const json: any = ["some", { "json": "text", "counter": state.counter }];
        const req = new Request('/export', {
          method: 'POST',
          body: JSON.stringify(json),
          headers: {
            'Content-type': 'text/json',
          },
        });
        const res = await fetch(req);
        console.log(await res.text());
      })();
    } break;
  }
}
