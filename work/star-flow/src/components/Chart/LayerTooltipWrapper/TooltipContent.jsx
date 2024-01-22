import style from './TooltipContent.module.scss';
import { format } from 'd3-format';
import { getTickFormat } from '@/utils/format';
import { LAYERS_MAP } from '@/config/consts/layer';
import { GET_VWAP_BANDS_YACCESSORS } from '@/config/consts/settings/vwap';
import { GET_BOLLINGER_YACCESSORS } from '@/config/consts/settings/bollinger';
import { GET_RSI_YACCESSORS, RSI_MA_TYPES } from '@/config/consts/settings/rsi';
import { GET_ATR_YACCESSORS, ATR_MA_TYPES } from '@/config/consts/settings/atr';
import { GET_DONCHIAN_YACCESSORS } from '@/config/consts/settings/donchian';
import { GET_RVOL_YACCESSORS } from '@/config/consts/settings/rvol';
import { GET_CE_YACCESSORS } from '@/config/consts/settings/chandelierExit';
import { GET_DMI_YACCESSORS } from '@/config/consts/settings/dmi';
import { GET_STD_INDEX_YACCESSORS } from '@/config/consts/settings/stdIndex';
import { GET_HPR_YACCESSORS } from '@/config/consts/settings/hpr';

const formatString = (value) => value ?? 'n/a';

const formatNumber = (value, tickFormat) => (value ? tickFormat(value) : 'n/a');

const renderInputSettings = (settings, keys) =>
  keys.map((key) => <span key={key}>{formatString(settings?.[key])}</span>);

const SMATooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings?.input, ['length', 'source', 'offset'])}
      {show && !disabled && (
        <span style={{ color: settings?.style?.lineColor }}>
          {formatNumber(data?.[layerId]?.sma, tickFormat)}
        </span>
      )}
    </div>
  );
};

const WMATooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings?.input, ['length', 'source', 'offset'])}
      {show && !disabled && (
        <span style={{ color: settings?.style?.lineColor }}>
          {formatNumber(data?.[layerId]?.wma, tickFormat)}
        </span>
      )}
    </div>
  );
};

const VWMATooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings?.input, ['length', 'source', 'offset'])}
      {show && !disabled && (
        <span style={{ color: settings?.style?.lineColor }}>
          {formatNumber(data?.[layerId]?.vwma, tickFormat)}
        </span>
      )}
    </div>
  );
};

const SWMATooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings?.input, ['length', 'source', 'offset'])}
      {show && !disabled && (
        <span style={{ color: settings?.style?.lineColor }}>
          {formatNumber(data?.[layerId]?.swma, tickFormat)}
        </span>
      )}
    </div>
  );
};

const VWAPTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessor = GET_VWAP_BANDS_YACCESSORS(layerId, settings);

  const renderBandValue = (settings, i) => {
    if (!settings['band' + i]?.show) return null;
    return (
      <>
        <span style={{ color: settings['band' + i]?.lineColor }}>
          {formatNumber(yAccessor['topBand' + i](data), tickFormat)}
        </span>
        <span style={{ color: settings['band' + i]?.lineColor }}>
          {formatNumber(yAccessor['botBand' + i](data), tickFormat)}
        </span>
      </>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings, ['period', 'source', 'offset'])}
      {show && !disabled && (
        <>
          <span>{formatString(settings?.band1?.ratio)}</span>
          <span>{formatString(settings?.band2?.ratio)}</span>
          <span>{formatString(settings?.band3?.ratio)}</span>
          <span style={{ color: settings?.vwap?.lineColor }}>
            {formatNumber(data?.[layerId]?.vwap, tickFormat)}
          </span>
          {renderBandValue(settings, 1)}
          {renderBandValue(settings, 2)}
          {renderBandValue(settings, 3)}
        </>
      )}
    </div>
  );
};

const BollingerTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessor = GET_BOLLINGER_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings?.style?.[key]?.show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessor[key](data), tickFormat)}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, [
        'length',
        'source',
        'multiplier',
        'offset',
      ])}
      {show && !disabled && (
        <>
          {renderBandValue(settings, 'middle')}
          {renderBandValue(settings, 'top')}
          {renderBandValue(settings, 'bottom')}
        </>
      )}
    </div>
  );
};

const RSITooltip = (props) => {
  const { layerId, name, show, settings, data, disabled } = props;
  const yAccessors = GET_RSI_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings.style[key].show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessors[key](data), format(',.2f'))}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, [
        'rsiLength',
        'rsiSource',
        'maType',
        'maLength',
        'bollingerMultiplier',
      ])}
      {show && !disabled && (
        <>
          {renderBandValue(settings, 'rsi')}
          {renderBandValue(settings, 'rsiMA')}
          {settings.input.maType === RSI_MA_TYPES.BOLLINGER && (
            <>
              {renderBandValue(settings, 'bollingerTop')}
              {renderBandValue(settings, 'bollingerBottom')}
            </>
          )}
        </>
      )}
    </div>
  );
};

const DonchianTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessor = GET_DONCHIAN_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings?.style?.[key]?.show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessor[key](data), tickFormat)}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, ['length'])}
      {show && !disabled && (
        <>
          {renderBandValue(settings, 'middle')}
          {renderBandValue(settings, 'top')}
          {renderBandValue(settings, 'bottom')}
        </>
      )}
    </div>
  );
};

const ATRTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessors = GET_ATR_YACCESSORS(layerId, settings.input.maType);

  const renderBandValue = (settings, key) => {
    if (!settings.style[key].show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessors[key](data), tickFormat)}
      </span>
    );
  };

  const inputFields =
    settings.input.maType === ATR_MA_TYPES.NONE
      ? ['atrLength']
      : ['atrLength', 'maType'];

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, inputFields)}
      {show && !disabled && renderBandValue(settings, 'atr')}
    </div>
  );
};

const RVOLTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessors = GET_RVOL_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings.style[key].show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessors[key](data), tickFormat)}
      </span>
    );
  };

  const inputFields = ['rvolLength'];

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, inputFields)}
      {show && !disabled && renderBandValue(settings, 'rvol')}
    </div>
  );
};

const CETooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessors = GET_CE_YACCESSORS(layerId);
  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings?.input, ['length', 'multiplier'])}
      {show && !disabled && (
        <span style={{ color: settings?.style?.lineColor }}>
          {formatNumber(yAccessors.ce(data), tickFormat)}
        </span>
      )}
    </div>
  );
};

const DMITooltip = (props) => {
  const { layerId, name, show, settings, data, disabled } = props;
  const yAccessors = GET_DMI_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings.style[key].show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessors[key](data), format(',.4f'))}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, ['adxLength', 'diLength'])}
      {show && !disabled && (
        <>
          {renderBandValue(settings, 'adx')}
          {renderBandValue(settings, 'diP')}
          {renderBandValue(settings, 'diM')}
        </>
      )}
    </div>
  );
};

const STDIndexTooltip = (props) => {
  const { layerId, name, show, settings, data, tickFormat, disabled } = props;
  const yAccessor = GET_STD_INDEX_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings?.style?.[key]?.show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessor[key](data), tickFormat)}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, ['length', 'source', 'multiplier'])}
      {show && !disabled && <>{renderBandValue(settings, 'stdIndex')}</>}
    </div>
  );
};

const HPRTooltip = (props) => {
  const { layerId, name, show, settings, data, disabled } = props;
  const yAccessors = GET_HPR_YACCESSORS(layerId);

  const renderBandValue = (settings, key) => {
    if (!settings.style[key].show) return null;
    return (
      <span style={{ color: settings.style[key].lineColor }}>
        {formatNumber(yAccessors[key](data), format(',.6f'))}
      </span>
    );
  };

  return (
    <div className={style.tooltipContent}>
      <span>{name}</span>
      {renderInputSettings(settings.input, ['length', 'source'])}
      {show && !disabled && <>{renderBandValue(settings, 'hpr')}</>}
    </div>
  );
};

const TOOLTIPS = {
  sma: SMATooltip,
  wma: WMATooltip,
  vwma: VWMATooltip,
  swma: SWMATooltip,
  vwap: VWAPTooltip,
  bollinger: BollingerTooltip,
  rsi: RSITooltip,
  atr: ATRTooltip,
  donchian: DonchianTooltip,
  rvol: RVOLTooltip,
  ce: CETooltip,
  dmi: DMITooltip,
  stdIndex: STDIndexTooltip,
  hpr: HPRTooltip,
};

const TooltipContent = ({ layer, currentItem, disabled }) => {
  const { name } = LAYERS_MAP[layer.type];
  const tickFormat = getTickFormat(currentItem?.open || 0);
  const Tooltip = TOOLTIPS[layer.type];
  const props = {
    layerId: layer.i,
    name,
    show: layer.show,
    settings: layer.settings,
    data: currentItem,
    tickFormat,
    disabled,
  };

  return Tooltip ? <Tooltip {...props} /> : <span>{name}</span>;
};

export default TooltipContent;
