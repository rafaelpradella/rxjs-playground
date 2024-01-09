import { Chart, createChart } from "@devexperts/dxcharts-lite";
import { For, Show, createEffect, createSignal } from "solid-js";
import { pipe } from "fp-ts/function";
import { none, fromNullable, fold, type Option, flatMap } from "fp-ts/Option";

import {
  DEFAULT_CHART_CONFIG,
  CHARTS_LIST_INIT,
  type TChartsData,
} from "./charts.config";
import css from "./style/charts.module.css";
import { createMockCandles, initChart, addYAxisValue } from "./utils";

export const ChartItem = ({ title, init, dataSize }: TChartsData) => {
  let chartEl!: HTMLDivElement;
  const chartData = createMockCandles(dataSize);
  const hasData = !!chartData && chartData?.length > 0;

  const [chartInstance, setChartInstance] = createSignal<Option<Chart>>(none);

  createEffect(() => {
    if (!chartData || !chartEl) return;
    const api = createChart(chartEl, DEFAULT_CHART_CONFIG);

    setChartInstance(fromNullable(api));
    pipe(
      chartInstance(),
      fold(
        () => console.error("Couldn´t init Chart"),
        initChart(chartData, init)
      )
    );
  });

  const repopulateChart = () =>
    pipe(
      chartInstance(),
      fold(
        () => console.warn("REPOPULATE_ERROR: Couldn´t update the chart"),
        (c) => c.updateData({ candles: createMockCandles(dataSize) })
      )
    );

  const addNewAxis = () =>
    pipe(
      chartInstance(),
      flatMap((a) => fromNullable(a?.paneManager?.panes?.CHART)),
      fold(
        () => console.warn("NEW_AXIS_ERROR: Couldn´t create a new axis"),
        (p) => addYAxisValue(p, dataSize)
      )
    );

  const CandlesInfoNav = () => (
    <Show when={hasData} fallback={<code>w/o candles</code>}>
      <div>
        <code>🕯️ {chartData.length} candles: </code>
        <button class={css.infoButton} onClick={repopulateChart}>
          🔀 Repopulate Chart
        </button>
        <button class={css.infoButton} onClick={addNewAxis}>
          🔛 Add Y Axis
        </button>
      </div>
    </Show>
  );

  return (
    <section>
      <h2>{title}</h2>
      <div class={css.wrapper} ref={chartEl}>
        {!hasData && <code>LOADING...</code>}
      </div>
      <div class={css.infoBlock}>
        <CandlesInfoNav />
      </div>
    </section>
  );
};

export const ChartsBody = () => {
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
      <For each={CHARTS_LIST_INIT}>
        {({ title, init, dataSize }) => (
          <ChartItem title={title} init={init} dataSize={dataSize} />
        )}
      </For>
    </div>
  );
};
