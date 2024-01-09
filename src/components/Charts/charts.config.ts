import type { Chart } from "@devexperts/dxcharts-lite";
import type { PartialChartConfig } from "@devexperts/dxcharts-lite/dist/chart/chart.config";
import type { Candle } from "@devexperts/dxcharts-lite/dist/chart/model/candle.model";

import { addYAxisValue, createMockCandles } from './utils';

export type TChartsData = {
  title: string;
  dataSize?: number;
  init?: (api: Chart, data: Candle[]) => void;
};

export const DEFAULT_CHART_CONFIG: PartialChartConfig = {
  devexpertsPromoLink: true,
  components: {
    chart: { type: "candle" },
  },
  colors: {
    areaTheme: {
      lineColor: "#d70101",
      startColor: "#f4511e",
      stopColor: "#FF950A",
    },
    candleTheme: {
      downColor: "#f4511e",
      downWickColor: "#d70101",
    },
    chartAreaTheme: { backgroundColor: "#000" },
  },
};

export const CHARTS_LIST_INIT: TChartsData[] = [
  { title: "Default" },
  {
    title: "View-only",
    dataSize: 1800,
    init: (api, data) => {
      api.disableUserControls();
      setTimeout(() => api.data.setXScale(0, data.length, false), 1000);
    },
  },
  {
    title: "Baseline",
    dataSize: 2200,
    init: (api) => {
      api.setChartType("baseline");
    },
  },
  {
    title: "Area",
    dataSize: 800,
    init: (api) => {
      api.setChartType("area");
    },
  },
  {
    title: "Multiple Values",
    dataSize: 1000,
    init: (api, data) => {
      api.setChartType("line");
      
      const pane = api.paneManager.panes.CHART;
      addYAxisValue(pane, data.length);
    },
  },
  {
    title: "Updated by second",
    dataSize: 50,
    init: (api) => {
      api.setChartType('histogram');

      setInterval(() => {
        const newCandle = createMockCandles(1)[0];
        newCandle.timestamp = (+ new Date());
        api.data.addLastCandle(newCandle);
      }, 1000);
    },
  },
];
