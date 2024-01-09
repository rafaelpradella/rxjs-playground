import { type Chart, generateCandlesData } from "@devexperts/dxcharts-lite";
import { pipe } from "fp-ts/function";
import type { Candle } from "@devexperts/dxcharts-lite/dist/chart/model/candle.model";
import type { PaneComponent } from "@devexperts/dxcharts-lite/dist/chart/components/pane/pane.component";

export const createMockCandles = (size?: number, withVolume = true) => {
  return generateCandlesData({ quantity: size ?? 1000, withVolume });
};

export const addYAxisValue = (pane: PaneComponent, length?: number) =>
  pipe(
    pane,
    (p) => p.createExtentComponent(),
    (xt) => xt.createDataSeries(),
    (d) => (d.dataPoints = createMockCandles(length ?? 1000, false)),
    () => pane.updateView(),
    () => pane.mergeYExtents()
  );

export const initChart =
  (data: Candle[], onInit?: Function) => (api: Chart) => {
    api.setData({ candles: data });
    onInit?.(api, data);
  };
