import { HeatmapVWAPSettings } from './heatmap-vwap';
import { VWAPSettings } from './vwap';
import { SMASettings } from './sma';
import { WMASettings } from './wma';
import { VWMASettings } from './vwma';
import { SWMASettings } from './swma';
import { VolumeSessionSettings } from './volume-session';
import { BollingerSettings } from './bollinger';
import { RSISettings } from './rsi';
import { ATRSettings } from './atr';
import { DonchianSettings } from './donchian';
import { RVOLSettings } from './rvol';
import { ChandelierExitSettings } from './chandelier-exit';
import { DMISettings } from './dmi';
import { STDIndexSettings } from './std-index';
import { HPRSettings } from './hpr';

export const LAYER_SETTINGS = {
  vwap: VWAPSettings,
  heatmap_vwap: HeatmapVWAPSettings,
  sma: SMASettings,
  wma: WMASettings,
  vwma: VWMASettings,
  swma: SWMASettings,
  volumeSession: VolumeSessionSettings,
  bollinger: BollingerSettings,
  rsi: RSISettings,
  atr: ATRSettings,
  donchian: DonchianSettings,
  rvol: RVOLSettings,
  ce: ChandelierExitSettings,
  dmi: DMISettings,
  stdIndex: STDIndexSettings,
  hpr: HPRSettings,
};
