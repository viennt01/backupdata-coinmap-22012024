import { useEffect } from 'react';
import {
  createDefaultChart,
  getListChart,
  getResolutionsList,
} from './fetcher';
import { useDispatch, useSelector } from 'react-redux';
import { setChartsFromServer } from '@/redux/actions/setting';
import { setResolutionList } from '@/redux/actions/common';
import { ERROR_CODE } from '@/fetcher/utils';
import { defaultSettings } from '@/redux/reducers/utils/chart-settings';
import { useState } from 'react';
import { setShowNeedUpgradePlan } from '@/redux/actions/common';
import { addToggleIndicatorList } from '@/utils/chart';

export default function useBaseData() {
  const [loading, setLoading] = useState(true);
  const [openUserGuide, setOpenUserGuide] = useState(true);

  const [showNeedUpgradePlan, userInfo] = useSelector((state) => [
    state.common.showNeedUpgradePlan,
    state.userProfile.user,
  ]);

  const dispatch = useDispatch();

  const handleShowNeedUpgradePlan = (showNeedUpgradePlan) => {
    dispatch(setShowNeedUpgradePlan(showNeedUpgradePlan));
  };

  useEffect(() => {
    getResolutionsList().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const resolutions = res.payload.map((r) => ({
          display_name: r.display_name,
          resolutions_name: r.resolutions_name,
        }));
        defaultSettings.updateIntervalsSettings(
          resolutions.map((r) => r.resolutions_name)
        );
        dispatch(setResolutionList(resolutions));

        getListChart().then((res) => {
          if (res.status === ERROR_CODE.OK) {
            const charts = {};
            if (res.data.length) {
              const chartFromServer = res.data.reverse();
              for (const chart of chartFromServer) {
                charts[chart.content.chartId] = {
                  ...chart.content,
                  id: chart.id, // id for call api
                };
              }
              dispatch(setChartsFromServer(charts));
              setLoading(false);
            } else {
              addToggleIndicatorList(defaultSettings.value.chart.chartId);
              Promise.all([
                createDefaultChart({
                  chart: defaultSettings.value.chart,
                }),
                createDefaultChart({
                  chart: {
                    ...defaultSettings.value.tradingview,
                    symbol: defaultSettings.value.tradingview.chartId,
                    interval: defaultSettings.value.tradingview.chartId,
                  },
                }),
              ]).then((res) => {
                if (res.some((r) => r.status === ERROR_CODE.OK)) {
                  // TODO: remove timeout
                  setTimeout(() => {
                    getListChart()
                      .then((res) => {
                        if (res.status === ERROR_CODE.OK) {
                          const charts = {};
                          if (res.data.length) {
                            for (const chart of res.data) {
                              charts[chart.content.chartId] = {
                                ...chart.content,
                                id: chart.id, // id for call api
                              };
                            }
                            dispatch(setChartsFromServer(charts));
                          }
                        }
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }, 500);
                }
              });
            }
          }
        });
      }
    });
  }, [dispatch]);
  return [
    loading,
    showNeedUpgradePlan,
    handleShowNeedUpgradePlan,
    openUserGuide,
    setOpenUserGuide,
    userInfo,
  ];
}
