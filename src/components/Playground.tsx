import { createSignal, observable } from "solid-js";
import "solid-devtools/setup";

import { pipe } from "fp-ts/function";
import { fromNullable, map } from "fp-ts/Option";
import { from, scan, Subject, takeUntil } from "rxjs";
import type { Observable } from "rxjs";

import css from "./Playground.module.css";

type TCoordenates = [number, number];

const [coordenates, setCoordenates] = createSignal<TCoordenates>([0, 0]);

const coordenates$: Observable<TCoordenates> = from(observable(coordenates));
const killSwitch$ = new Subject<boolean>();

export const playgroundSubscriber$ = coordenates$
  .pipe(
    //@ts-ignore
    scan((a, c) => [...a, c], []),
    takeUntil(killSwitch$)
  )
  .subscribe((r) => console.log(r));

export const Playground = () => {
  const getBoardSize = (target?: HTMLDivElement) =>
    pipe(
      fromNullable(target?.getBoundingClientRect()),
      map(({ width, height }) => ({ width: Math.floor(width), height: Math.floor(height) }))
    );

  const handleMouseDown = (event: MouseEvent) => {
    const boardSizeOpt = getBoardSize(event?.currentTarget as HTMLDivElement);
    console.log('boardSizeOpt', boardSizeOpt);

    setCoordenates([event.offsetX, event.offsetY]);
  };

  return (
    <div class={css.main}>
      <button onClick={() => killSwitch$.next(true)}>
        ❌ End all the fun!
      </button>
      <div onMouseDown={handleMouseDown} class={css.board} />
      <div class={css.counter}>
        <span>X: {coordenates()[0]}</span>
        <span>Y: {coordenates()[1]}</span>
      </div>
      <section>
        <h2>Throttle</h2>
      </section>
      <section>
        <h2>Filter</h2>
      </section>
    </div>
  );
};
