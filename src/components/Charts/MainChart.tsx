import {
  Chart,
  createChart,
  generateCandlesData,
} from "@devexperts/dxcharts-lite";
import { Show, createEffect, createSignal, onMount } from "solid-js";

import { DEFAULT_CHART_CONFIG } from "./style/charts.config";
import css from "./style/charts.module.css";

const candlesDataMock = generateCandlesData({ quantity: 1000 });

export const MainChart = () => {
  let chartEl!: HTMLDivElement;
  const [dxChart, setDxChart] = createSignal<Chart>();
  const [candles, setCandles] = createSignal<typeof candlesDataMock>([]);

  createEffect(() => {
    if (!candles().length || !chartEl) return;

    setDxChart(createChart(chartEl, DEFAULT_CHART_CONFIG));
    dxChart()?.setData({ candles: candles() });
  });

  onMount(() => {
    setTimeout(() => setCandles(candlesDataMock), 5000);
  });

  const ChartsInfo = () => (
    <Show
      when={candles().length > 0}
      fallback={<code>w/o candles</code>}
    >
      <div>
        <code>🕯️ {candles().length} candles: </code>
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
        {!candles().length && <code>LOADING...</code>}
      </div>
      <ChartsInfo />
    </div>
  );
};
