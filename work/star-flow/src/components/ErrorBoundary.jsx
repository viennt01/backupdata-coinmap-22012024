import { LOCAL_CACHE_KEYS } from '@/config';
import { ERROR_CODE } from '@/fetcher/utils';
import { getListChart } from '@/hook/fetcher';
import { deleteChart } from '@/utils/chart';
import { localStore } from '@/utils/localStorage';
import Router from 'next/router';
import React from 'react';

const ERROR_CHART_SETTINGS_CACHE = [
  `Cannot read properties of undefined (reading 'tickvalue')`,
];

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  resetSettings = () => {
    getListChart().then(async (res) => {
      if (res.status === ERROR_CODE.OK) {
        await Promise.all(res.data.map((c) => deleteChart(c.id)));
      }
      localStore.remove(LOCAL_CACHE_KEYS.LOCAL_SETTINGS_CACHE_KEY);
      window.location.reload();
    });
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isErrorCchartSettingsCache = ERROR_CHART_SETTINGS_CACHE.some(
        (m) => m === this.state.error?.message
      );
      if (isErrorCchartSettingsCache) {
        localStore.remove(LOCAL_CACHE_KEYS.LOCAL_SETTINGS_CACHE_KEY, () => {
          Router.reload();
        });
      }
      // You can render any custom fallback UI
      return (
        <div className="text-center">
          <div className="alert alert-info">
            <h3 className="fs-4">Có lỗi xảy ra, hãy thử tải lại trang</h3>
            <button onClick={this.reloadPage} className="btn btn-primary mt-2">
              Tải lại trang
            </button>
            <hr className="my-3" />
            <p>Nếu vẫn lỗi hãy thử nhấn nút xóa thiết lập</p>
            <p className="text-danger">
              Lưu ý: Nhấn nút này sẽ xóa toàn bộ cài đặt của bạn!
            </p>
            <button
              onClick={this.resetSettings}
              className="btn btn-outline-secondary mt-2"
            >
              Xóa thiết lập
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
