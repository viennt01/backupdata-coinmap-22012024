import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useState, useEffect } from 'react';
import {
  getPayments,
  MerchantUpdatePayment,
  updateMerchant,
} from '@/components/affiliate/payment/fetcher';
import DrawerPaymentDetail from './drawer-payment-detail';
import PaymentFilter from './payment-filter';
import PaymentTable from './payment-table';
import { NETWORK, Payment } from '@/components/affiliate/payment/interface';
import { Form } from 'antd';
import { errorToast, successToast } from '@/hook/toast';
import dayjs from 'dayjs';
import { exportCsv } from '@/utils/common';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format';
import ModalRequestPayout from './modal-request-payout';

const now = new Date();
const name = '';

const csvHeaders = [
  {
    name: 'Merchant Name',
    value: 'merchant_name',
  },
  {
    name: 'Merchant Code',
    value: 'merchant_code',
  },
  {
    name: 'Email',
    value: 'merchant_email',
  },
  {
    name: 'Transaction Id',
    value: 'transaction_id',
  },
  {
    name: 'Wallet address',
    value: 'wallet_address',
  },
  {
    name: 'Profit',
    value: 'amount_commission_complete',
    converter: (value: number) => formatCurrency(value),
  },
  {
    name: 'Status',
    value: 'status',
  },
  {
    name: 'Created at',
    value: 'created_at',
    converter: (value: string) => formatDate(Number(value)),
  },
  {
    name: 'Updated at',
    value: 'updated_at',
    converter: (value: string) => formatDate(Number(value)),
  },
];

export default function PaymentTab() {
  const [tableData, setTableData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openRequestPayout, setOpenRequestPayout] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState<Payment | null>(null);
  const [monthProfit, setMonthProfit] = useState<string>(
    dayjs(now).format('MM/YYYY')
  );

  const [form] = Form.useForm();

  const getMonth = (date: Date) => {
    const dayjsDate = dayjs(date);
    const firstDayOfMonth = dayjsDate.startOf('month').toDate().getTime();
    const lastDayOfMonth = dayjsDate.endOf('month').toDate().getTime();
    return { firstDayOfMonth, lastDayOfMonth };
  };

  const fetchData = (date: Date, name: string) => {
    const month = dayjs(date);
    const dataSearch = getMonth(date);
    setLoading(true);
    getPayments(
      dataSearch.firstDayOfMonth,
      dataSearch.lastDayOfMonth,
      name || ''
    )
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTableData(res.payload.rows);
          setMonthProfit(month.format('MM/YYYY'));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(now, name);
  }, []);

  const handleOpenDrawer = (paymentSelected: Payment) => {
    setOpenDrawer(true);
    setPaymentSelected(paymentSelected);
  };
  const handleSearch = (value: { keyword: { $d: Date }; name: string }) => {
    const name = value.name;
    const month = value.keyword ? value.keyword.$d : now;
    fetchData(month, name);
  };
  const handleUpdatePayment = (value: MerchantUpdatePayment) => {
    const data: MerchantUpdatePayment = {
      transaction_id: value.transaction_id,
      status: value.status,
      description: value.description,
      type: paymentSelected?.wallet_network || NETWORK.TRC20,
    };
    if (paymentSelected) {
      updateMerchant(data, paymentSelected.id)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            successToast('Save successfully');
            fetchData(now, name);
            setOpenDrawer(false);
          } else {
            errorToast(res.message);
          }
        })
        .catch((e: Error) => {
          errorToast(JSON.parse(e.message)?.message || 'Request failed');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // export table data to csv
  const exportTableData = () => {
    exportCsv(tableData, csvHeaders, `profit_invoice_${monthProfit}`);
    successToast('Export CSV file successfully');
  };

  // sync table data
  const syncTableData = () => {
    fetchData(now, name);
  };

  return (
    <>
      <PageTitle title="Payment" />
      <PaymentFilter
        form={form}
        handleSearch={handleSearch}
        exportTableData={exportTableData}
        syncTableData={syncTableData}
        createPayout={() => setOpenRequestPayout(true)}
      />
      <CustomCard style={{ marginTop: '24px' }}>
        <PaymentTable
          handleOpenDrawer={handleOpenDrawer}
          dataSource={tableData}
          loading={loading}
        />
      </CustomCard>
      <DrawerPaymentDetail
        open={openDrawer}
        paymentSelected={paymentSelected}
        onClose={() => setOpenDrawer(false)}
        handleUpdatePayment={handleUpdatePayment}
      />
      <ModalRequestPayout
        open={openRequestPayout}
        onClose={() => setOpenRequestPayout(false)}
        onCreatedPayout={syncTableData}
      />
    </>
  );
}
