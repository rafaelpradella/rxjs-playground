import type { PartialChartConfig } from "@devexperts/dxcharts-lite/dist/chart/chart.config"

export const DEFAULT_CHART_CONFIG: PartialChartConfig = {
  devexpertsPromoLink: true,
  colors: {
    candleTheme: { 
      downColor: '#f4511e',
      downWickColor: '#d70101'
    },
    chartAreaTheme: { backgroundColor: '#000' }
  }
}