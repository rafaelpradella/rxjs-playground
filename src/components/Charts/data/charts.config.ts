import { generateCandlesData, type Chart } from "@devexperts/dxcharts-lite";
import type { PartialChartConfig } from "@devexperts/dxcharts-lite/dist/chart/chart.config";
import type { Candle } from "@devexperts/dxcharts-lite/dist/chart/model/candle.model";

export type TChartsData = {
  title: string;
  dataSize?: number;
  init?: ((api: Chart, data: Candle[]) => void);
};

const MAX_SCALE_LIMIT = 1200;

export const DEFAULT_CHART_CONFIG: PartialChartConfig = {
  devexpertsPromoLink: true,
  components: {
    chart: { type: 'candle' },
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
    title: "View-only (Paginated)",
    dataSize: 9000,
    init: (api) => {
      api.disableUserControls();
      api.data.setXScale((api.scale.xEnd - MAX_SCALE_LIMIT), api.scale.xEnd);
    }
  },
  {
    title: "Bar",
    dataSize: 2200,
    init: (api) => {
      api.setChartType("bar");
    },
  },
  {
    title: "Area",
    dataSize: 800,
    init: (api) => {
      api.setChartType("area");
    },
  },
  /* {
    title: "Updated (by 1s)",
    dataSize: 5000,
    init: (api) => {
      setTimeout(() => {
        api.data.addLastCandle({ hi: 122, lo: 100, timestamp: (+ new Date()), open: 1, close: 20, volume: 100 });
      }, 1000);
    }
  }, */
];
