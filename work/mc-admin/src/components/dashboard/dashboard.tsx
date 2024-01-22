import { Breadcrumb, Card } from 'antd';
import { useEffect, useState } from 'react';
import {
  getUserReport,
  getUserChart,
  getTransactionReport,
  getTransactionChart,
  UserReport,
  UserChart,
  TransactionReport,
  TransactionChart,
} from './fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { getClientTimezone, formatDate } from '@/utils/format';
import { TIME_TYPE } from '@/constant/transaction';
import PurchaseChart from './purchase-chart';
import VisitChart from './visit-chart';
import CommissionSummary from './commission-summary';
import FilterForm from './filter-form';
import dayjs from 'dayjs';

const TIME_ZONE = getClientTimezone();

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [userReport, setUserReport] = useState<UserReport>();
  const [userChart, setUserChart] = useState<UserChart[]>([]);
  const [transactionReport, setTransactionReport] =
    useState<TransactionReport>();
  const [transactionChart, setTransactionChart] = useState<TransactionChart[]>(
    []
  );

  const fetchReportData = (from?: number, to?: number) => {
    setLoading(true);
    let queryString = '?';
    if (from) queryString += `&from=${from}`;
    if (to) queryString += `&to=${to}`;

    Promise.all([getUserReport(queryString), getTransactionReport(queryString)])
      .then(([userReportRes, transactionReportRes]) => {
        if (userReportRes.error_code === ERROR_CODE.SUCCESS) {
          setUserReport(userReportRes.payload);
        }
        if (transactionReportRes.error_code === ERROR_CODE.SUCCESS) {
          setTransactionReport(transactionReportRes.payload);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  const fetchChartData = (from?: number, to?: number) => {
    let queryString = '?';
    queryString += from ? `&from=${from}` : '';
    queryString += to ? `&to=${to}` : '';

    getTransactionChart(
      queryString + `&timezone=${TIME_ZONE}&time_type=${TIME_TYPE.DAY}`
    )
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const formatData = res.payload.map((item) => ({
            ...item,
            time: formatDate(new Date(item.time)),
            count_complete: Number(item.count_complete),
          }));
          setTransactionChart(formatData);
        }
      })
      .catch((e) => console.log(e));

    getUserChart()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const formatData = res.payload.map((item) => ({
            ...item,
            time: formatDate(new Date(item.time)),
            visitor: Number(item.visitor),
          }));
          setUserChart(formatData);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleSearch = (from?: number, to?: number) => {
    fetchReportData(from, to);
  };

  useEffect(() => {
    const dateTo = new Date();
    const dateFrom = new Date(new Date().setDate(dateTo.getDate() - 30));
    const startOfDateFrom = dayjs(dateFrom).startOf('day');
    const endOfDateTo = dayjs(dateTo).endOf('day');

    fetchChartData(startOfDateFrom.valueOf(), endOfDateTo.valueOf());
    handleSearch(startOfDateFrom.valueOf(), endOfDateTo.valueOf());
  }, []);

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bordered={false}
        style={{
          width: 'fit-content',
          margin: '0 0 24px auto',
        }}
        bodyStyle={{
          padding: 12,
        }}
      >
        <FilterForm loading={loading} handleSearch={handleSearch} />
      </Card>

      <div style={{ marginBottom: 24 }}>
        <CommissionSummary
          visits={userReport?.pageView ?? 0}
          transactions={transactionReport?.count_complete ?? 0}
          commission_cash={transactionReport?.commission_cash ?? 0}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <VisitChart data={userChart} />
      </div>

      <PurchaseChart data={transactionChart} />
    </>
  );
}
