import { GATEWAY, get } from '@/fetcher';
import { getTypeOfData } from '@/components/Chart/hook';

export const getAccumulatedDelta = ({
  symbol,
  interval,
  startTime,
  endTime,
  signal,
  exchange,
  asset,
  type,
}) => {
  return get({
    gw: GATEWAY.API_MAIN_GW,
    options: { signal },
  })(
    `/getcandlehistorycvd?cvd=day&symbol=${symbol}&exchange=${exchange}&asset=${asset}&type=${type}&typedata=${getTypeOfData()}&resolution=${interval}&from=${startTime}&to=${endTime}&countback=1000`
  );
};

export const getOrderFlow = ({
  symbol,
  interval,
  startTime,
  endTime,
  signal,
  asset = '',
  type,
  exchange,
}) => {
  return get({
    gw: GATEWAY.API_MAIN_GW,
    options: { signal },
  })(
    `/getorderflowhistory?asset=${asset}&typedata=${getTypeOfData()}&type=${type}&exchange=${exchange}&symbol=${symbol}&resolution=${interval}&from=${startTime}&to=${endTime}&countback=1000`
  );
};
