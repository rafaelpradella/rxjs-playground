import { Chart, createChart } from "@devexperts/dxcharts-lite";
import { useState, useCallback } from "react";
import { pipe } from "fp-ts/function";
import { none, fromNullable, fold, type Option, flatMap } from "fp-ts/Option";

import {
  DEFAULT_CHART_CONFIG,
  CHARTS_LIST_INIT,
  type TChartsData,
} from "./charts.config";
import css from "./charts.module.css";
import { createMockCandles, initChart, addYAxisValue } from "./utils";

export const ChartItem = ({ title, init, dataSize }: TChartsData) => {
  const chartData = createMockCandles(dataSize);
  const hasData = !!chartData && chartData?.length > 0;

  const [chartInstance, setChartInstance] = useState<Option<Chart>>(none);

  const chartInitRef = useCallback((node: HTMLElement) => {
    if (!node) return;
    const api = createChart(node, DEFAULT_CHART_CONFIG);

    setChartInstance(fromNullable(api));
    pipe(
      fromNullable(api),
      fold(
        () => console.error("Couldn´t init Chart"),
        initChart(chartData, init)
      )
    );
  }, []);

  const repopulateChart = () =>
    pipe(
      chartInstance,
      fold(
        () => console.warn("REPOPULATE_ERROR: Couldn´t update the chart"),
        (c) => c.updateData({ candles: createMockCandles(dataSize) })
      )
    );

  const addNewAxis = () =>
    pipe(
      chartInstance,
      flatMap((a) => fromNullable(a?.paneManager?.panes?.CHART)),
      fold(
        () => console.warn("NEW_AXIS_ERROR: Couldn´t create a new axis"),
        (p) => addYAxisValue(p, dataSize)
      )
    );

  const CandlesInfoNav = () => {
    if(!hasData) return <code>w/o candles</code>;

    return (
      <>
        <code>(🕯️ {chartData.length} candles)</code>
        <button className={css.infoButton} onClick={repopulateChart}>
          🔀 Repopulate Chart
        </button>
        <button className={css.infoButton} onClick={addNewAxis}>
          🔛 Add Y Axis
        </button>
      </>
    )
  };

  return (
    <section>
      <h2>{title}</h2>
      <div className={css.wrapper} ref={chartInitRef}>
        {!hasData && <code>LOADING...</code>}
      </div>
      <div className={css.infoBlock}>
        <CandlesInfoNav />
      </div>
    </section>
  );
};

export const ChartsBody = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {CHARTS_LIST_INIT.map(({ title, init, dataSize }, i) => (
        <ChartItem key={i} title={title} init={init} dataSize={dataSize} />
      ))}
    </div>
  );
};
