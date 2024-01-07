import {
  Chart,
  createChart,
  generateCandlesData,
} from "@devexperts/dxcharts-lite";
import { For, Show, createEffect, createSignal } from "solid-js";

import { DEFAULT_CHART_CONFIG } from "./style/charts.config";
import css from "./style/charts.module.css";

export const ChartsBody = () => {
  return (
    <section>
      <For each={Array(5)}>
        {(_, i) => {
          const candlesDataMock = generateCandlesData({ quantity: 1000 });
          return (<SimpleChart data={candlesDataMock} onCreated={() => alert(`Created ${i()}`)} />)
        }}
      </For>
    </section>
  )
  
}

export const SimpleChart = (props: { data: ReturnType<typeof generateCandlesData>, onCreated?: Function }) => {
  const [dxChart, setDxChart] = createSignal<Chart>();

  let chartEl!: HTMLDivElement;
  const hasData = !!props.data && props.data.length > 0 ;

  createEffect(() => {
    if (!hasData || !chartEl) return;

    setDxChart(createChart(chartEl, DEFAULT_CHART_CONFIG));
    dxChart()?.setData({ candles: props.data });
    props?.onCreated?.();
  });

  const ChartsInfo = () => (
    <Show
      when={hasData}
      fallback={<code>w/o candles</code>}
    >
      <div>
        <code>🕯️ {props.data.length} candles: </code>
        <button
          onClick={() =>
            dxChart()?.updateData({
              candles: generateCandlesData({ quantity: 1000 }),
            })
          }
        >
          Repopulate Chart
        </button>
      </div>
    </Show>
  );

  return (
    <div>
      <div class={css.wrapper} ref={chartEl}>
        {!hasData && <code>LOADING...</code>}
      </div>
      <ChartsInfo />
    </div>
  );
};
