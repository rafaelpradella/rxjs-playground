import type { Chart } from "@devexperts/dxcharts-lite";
import type { PartialChartConfig } from "@devexperts/dxcharts-lite/dist/chart/chart.config";
import type { Candle } from "@devexperts/dxcharts-lite/dist/chart/model/candle.model";

import { addYAxisValue, createMockCandles } from "./utils";

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

const requestIdleWithFallback = (cb: IdleRequestCallback, time = 1000) => {
  "requestIdleCallback" in window
    ? requestIdleCallback(cb, { timeout: time })
    : setTimeout(cb, time);
};

export const CHARTS_LIST_INIT: TChartsData[] = [
  {
    title: "View-only",
    dataSize: 5000,
    init: (api, data) => {
      api.disableUserControls();
      //Attempts to get setXScale to work on onInit:
      //api.data.setXScale(0, data.length - 1);
      //❌ api.chartModel.scale.setXScale(0, data.length);
      //❌ api.scale.setXScale(0, data.length);
      //❌ api.scaleModel.xStart = 0;
      //❌api.scaleModel.xEnd = data.length;
      //✅ setTimeout(() => api.data.setXScale(0, data.length), 1000);
      requestIdleWithFallback(() => api.data.setXScale(0, data.length));
    },
  },
  { title: "Default" },
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
    dataSize: 0,
    init: (api) => {
      const MAX_VIEW_SIZE = 100;
      let length = 0;

      api.disableUserControls();
      api.setChartType("histogram");
      setInterval(() => {
        length++;
        const newCandle = createMockCandles(1, false)[0];
        newCandle.timestamp = +new Date();
        api.data.addLastCandle(newCandle);
        requestIdleWithFallback(() => {
           api.data.setXScale(length > MAX_VIEW_SIZE ? (length - MAX_VIEW_SIZE) : 0, length);
        });
      }, 1000);
    },
  },
];
