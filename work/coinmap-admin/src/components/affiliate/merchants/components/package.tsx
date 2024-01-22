import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { FormInstance, Table, Typography } from 'antd';
import { ERROR_CODE } from '@/constants/code-constants';
import { FormValues } from './merchant-create-form';
import { Form } from 'antd';
import { FormAdditionalData, getAdditionalDataMerchant } from '../fetcher';
import { useRouter } from 'next/router';
import { PackageByMerchant } from '../interface';
import { getPackagePeriod } from '../../package-period/fetcher';
import { PackagePeriod } from '../../package-period/interface';
import { BotPeriod } from '../../tbot-period/interface';
import { getBotPeriod } from '../../tbot-period/fetcher';
import { ADDITIONAL_DATA_TYPE } from '../../interface';
import { TableRowSelection } from 'antd/es/table/interface';

const { Title } = Typography;

interface GuestsTableProps {
  dataSource: (BotPeriod | PackagePeriod)[];
  loading: boolean;
  rowSelection: TableRowSelection<BotPeriod | PackagePeriod>;
}

const MyTable = (props: GuestsTableProps) => {
  const { dataSource, loading, rowSelection } = props;

  const columns: ColumnsType<BotPeriod | PackagePeriod> = useMemo(
    () => [
      Table.SELECTION_COLUMN,
      {
        title: 'Name',
        dataIndex: ['data', 'translation', 'en', 'name'],
        width: '10%',
      },
      {
        title: 'Discount amount ($)',
        dataIndex: ['data', 'translation', 'en', 'discount_amount'],
        width: '10%',
        align: 'center',
      },
      {
        title: 'Discount rate (%)',
        dataIndex: ['data', 'translation', 'en', 'discount_rate'],
        width: '10%',
        align: 'center',
      },
    ],
    []
  );

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        tableLayout="auto"
        rowSelection={{
          columnWidth: '1%',
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </>
  );
};

interface Props {
  form: FormInstance<FormValues>;
}

export default function Package({ form }: Props) {
  const [botData, setDotData] = useState<BotPeriod[]>([]);
  const [packageData, setPackageData] = useState<PackagePeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = () => {
    setLoading(true);
    // get all
    getPackagePeriod({ keyword: '' })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setPackageData(res.payload);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    getBotPeriod({ keyword: '' })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setDotData(res.payload);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchPackageByMerchantId = (id: string) => {
    setLoading(true);
    getAdditionalDataMerchant(id)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const packagePeriod: FormValues['package_period'] = res.payload
            .filter(
              (f: PackageByMerchant) =>
                f.type === ADDITIONAL_DATA_TYPE.PKG_PERIOD
            )
            .map((f: PackageByMerchant) => {
              return {
                id: f.id,
                additional_data_id: f.additional_data_id,
                status: f.status,
              };
            });

          form.setFieldValue('package_period', packagePeriod);

          const botPeriod: FormValues['tbot_period'] = res.payload
            .filter(
              (f: PackageByMerchant) =>
                f.type === ADDITIONAL_DATA_TYPE.TBOT_PERIOD
            )
            .map((f: PackageByMerchant) => {
              return {
                id: f.id,
                additional_data_id: f.additional_data_id,
                status: f.status,
              };
            });
          form.setFieldValue('tbot_period', botPeriod);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    fetchPackageByMerchantId(id as string);
  }, [router.query]);

  const packagePeriod: FormValues['package_period'] = Form.useWatch(
    'package_period',
    {
      form,
    }
  );

  // rowSelection object indicates the need for row selection
  const selectedPackageRowKeys = (packagePeriod || []).reduce<string[]>(
    (keys, current) => {
      if (current.additional_data_id && current.status === 'ON') {
        keys.push(current.additional_data_id);
      }
      return keys;
    },
    []
  );

  const rowPackageSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedPackageRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      // step1: kiểm tra tồn tại trong mảng faq chưa, nếu tồn tại thay đổi status === ON
      // step2: kiểm tra tồn tại trong mảng faq chưa, chưa tồn tại thì push vào mảng với status === ON

      // step3: nếu tồn tại trong mảng faq mà selectedKeys ko tồn tại thì đổi status === OFF

      // ADD: length selectedRowKeys > length faq có status ON
      // REMOVE: length faq có status ON > length selectedRowKeys

      const lengthOfFAQOn = packagePeriod.filter(
        (f) => f.status === 'ON'
      ).length;

      // REMOVE
      if (lengthOfFAQOn > selectedRowKeys.length) {
        const faqTemp = packagePeriod.map((f) => {
          const existed = selectedRowKeys.some(
            (key) => f.additional_data_id === key
          );
          if (existed) {
            return f;
          }
          return {
            ...f,
            status: 'OFF',
          };
        });

        form.setFieldValue('package_period', faqTemp);
      } else {
        // ADD
        selectedRowKeys.forEach((key) => {
          const existed = packagePeriod.find(
            (f) => f.additional_data_id === key
          );
          if (existed) {
            const faqTemp = packagePeriod.map((f) => {
              if (f.additional_data_id === existed.additional_data_id) {
                return {
                  ...f,
                  status: 'ON',
                };
              }
              return f;
            });
            form.setFieldValue('package_period', faqTemp);
          } else {
            const data: FormAdditionalData = {
              additional_data_id: key as string,
              status: 'ON',
              order: 1,
            };
            let faqTemp = packagePeriod;
            faqTemp = faqTemp.concat([data]);
            form.setFieldValue('package_period', faqTemp);
          }
        });
      }
    },
  };

  const botPeriod: FormValues['tbot_period'] = Form.useWatch('tbot_period', {
    form,
  });

  // rowSelection object indicates the need for row selection
  const selectedBotRowKeys = (botPeriod || []).reduce<string[]>(
    (keys, current) => {
      if (current.additional_data_id && current.status === 'ON') {
        keys.push(current.additional_data_id);
      }
      return keys;
    },
    []
  );

  const rowBotSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedBotRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      // step1: kiểm tra tồn tại trong mảng faq chưa, nếu tồn tại thay đổi status === ON
      // step2: kiểm tra tồn tại trong mảng faq chưa, chưa tồn tại thì push vào mảng với status === ON

      // step3: nếu tồn tại trong mảng faq mà selectedKeys ko tồn tại thì đổi status === OFF

      // ADD: length selectedRowKeys > length faq có status ON
      // REMOVE: length faq có status ON > length selectedRowKeys

      const lengthOfFAQOn = botPeriod.filter((f) => f.status === 'ON').length;

      // REMOVE
      if (lengthOfFAQOn > selectedRowKeys.length) {
        const tbotTemp = botPeriod.map((f) => {
          const existed = selectedRowKeys.some(
            (key) => f.additional_data_id === key
          );
          if (existed) {
            return f;
          }
          return {
            ...f,
            status: 'OFF',
          };
        });
        form.setFieldValue('tbot_period', tbotTemp);
      } else {
        // ADD
        selectedRowKeys.forEach((key) => {
          const existed = botPeriod.find((f) => f.additional_data_id === key);
          if (existed) {
            const tbotTemp = botPeriod.map((f) => {
              if (f.additional_data_id === existed.additional_data_id) {
                return {
                  ...f,
                  status: 'ON',
                };
              }
              return f;
            });
            form.setFieldValue('tbot_period', tbotTemp);
          } else {
            const data: FormAdditionalData = {
              additional_data_id: key as string,
              status: 'ON',
              order: 1,
            };
            let tbotTemp = botPeriod;
            tbotTemp = tbotTemp.concat([data]);
            form.setFieldValue('tbot_period', tbotTemp);
          }
        });
      }
    },
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Package Period</Title>
        <Form.Item name="package_period">
          <MyTable
            key={'package_period'}
            dataSource={packageData}
            loading={loading}
            rowSelection={rowPackageSelection}
          />
        </Form.Item>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>TBot Period</Title>
        <Form.Item name="tbot_period">
          <MyTable
            dataSource={botData}
            key={'tbot_period'}
            loading={loading}
            rowSelection={rowBotSelection}
          />
        </Form.Item>
      </div>
    </>
  );
}
