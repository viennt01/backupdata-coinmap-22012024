import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { FormInstance, Table, Select } from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { ERROR_CODE } from '@/constants/code-constants';
import { Form } from 'antd';
import { useRouter } from 'next/router';

import { getAdditionalDataMerchant, FormAdditionalData } from '../fetcher';
import { FormValues } from './merchant-create-form';
import { FAQ } from '../../faq/interface';
import { getFAQ } from '../../faq/fetcher';
import { FaqByMerchant } from '../interface';

interface GuestsTableProps {
  dataSource: FAQ[];
  loading: boolean;
  form: FormInstance<FormValues>;
}

const FaqTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading, form } = props;
  const orderOptions = useMemo(
    () =>
      Array.from(Array(dataSource.length).keys()).map((v) => ({
        value: v + 1,
        label: v + 1,
      })),
    [dataSource]
  );

  const faq: FormValues['faq'] = Form.useWatch('faq', {
    form,
  });

  // rowSelection object indicates the need for row selection
  const selectedRowKeys = (faq || []).reduce<string[]>((keys, current) => {
    if (current.additional_data_id && current.status === 'ON') {
      keys.push(current.additional_data_id);
    }
    return keys;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeOrder = (value: number, record: FAQ) => {
    const faqTemp = faq.map((f) => {
      if (f.additional_data_id === record.id) {
        return {
          ...f,
          order: value,
        };
      }
      return f;
    });
    form.setFieldValue('faq', faqTemp);
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      // step1: kiểm tra tồn tại trong mảng faq chưa, nếu tồn tại thay đổi status === ON
      // step2: kiểm tra tồn tại trong mảng faq chưa, chưa tồn tại thì push vào mảng với status === ON

      // step3: nếu tồn tại trong mảng faq mà selectedKeys ko tồn tại thì đổi status === OFF

      // ADD: length selectedRowKeys > length faq có status ON
      // REMOVE: length faq có status ON > length selectedRowKeys

      const lengthOfFAQOn = faq.filter((f) => f.status === 'ON').length;

      // REMOVE
      if (lengthOfFAQOn > selectedRowKeys.length) {
        const faqTemp = faq.map((f) => {
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
        form.setFieldValue('faq', faqTemp);
      } else {
        // ADD
        selectedRowKeys.forEach((key) => {
          const existed = faq.find((f) => f.additional_data_id === key);
          if (existed) {
            const faqTemp = faq.map((f) => {
              if (f.additional_data_id === existed.additional_data_id) {
                return {
                  ...f,
                  status: 'ON',
                };
              }
              return f;
            });
            form.setFieldValue('faq', faqTemp);
          } else {
            const data: FormAdditionalData = {
              additional_data_id: key as string,
              status: 'ON',
              order: 0,
            };
            let faqTemp = faq;
            faqTemp = faqTemp.concat([data]);
            form.setFieldValue('faq', faqTemp);
          }
        });
      }
    },
  };
  const columns: ColumnsType<FAQ> = useMemo(
    () => [
      Table.SELECTION_COLUMN,
      {
        title: 'FAQ',
        dataIndex: ['data', 'translation', 'en', 'name'],
        width: '10%',
      },
      {
        title: 'FAQ',
        dataIndex: ['data', 'translation', 'vi', 'name'],
        width: '10%',
      },
      {
        title: 'Order',
        dataIndex: 'id',
        width: '10%',
        align: 'center',
        render: (id: string, record: FAQ) => {
          const orderValue = faq.find((f) => f.additional_data_id === id);
          return (
            <Select
              value={(orderValue && orderValue.order) || 1}
              style={{ width: 100 }}
              onChange={(value) => handleChangeOrder(value, record)}
              options={orderOptions}
            />
          );
        },
      },
      Table.EXPAND_COLUMN,
    ],
    [orderOptions, faq, handleChangeOrder]
  );
  const dataSourceFormated = useMemo(() => {
    const selectedFAQ: (FAQ & { order?: number })[] = [];
    const unSelectedFAQ: (FAQ & { order?: number })[] = [];
    dataSource.map((d) => {
      const existed = (faq || []).find(
        (f) => f.additional_data_id === d.id && f.status === 'ON'
      );
      if (existed) {
        selectedFAQ.push({
          ...d,
          order: existed.order,
        });
      } else {
        unSelectedFAQ.push(d);
      }
    });

    return selectedFAQ
      .sort((a, b) => {
        if ((a.order || a.order === 0) && (b.order || b.order === 0)) {
          return a.order - b.order;
        }
        return Infinity;
      })
      .concat(unSelectedFAQ);
  }, [dataSource, faq]);

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSourceFormated}
        pagination={false}
        loading={loading}
        tableLayout="auto"
        expandable={{
          columnWidth: '1%',
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ) : (
              <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ),
          expandedRowRender: (record) => (
            <div>
              <div>
                <div>EN:</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: record.data.translation.en.answer,
                  }}
                />
                <div>VI:</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: record.data.translation.vi.answer,
                  }}
                />
              </div>
            </div>
          ),
          fixed: true,
          rowExpandable: (record) => Boolean(record.name),
        }}
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

export default function Faq({ form }: Props) {
  const [tableData, setTableData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = () => {
    setLoading(true);
    // get all
    getFAQ({ keyword: '' })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTableData(res.payload);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFaqByMerchantId = (id: string) => {
    setLoading(true);
    getAdditionalDataMerchant(id)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const faq: FormValues['faq'] = res.payload
            .filter((f: FaqByMerchant) => f.type === 'FAQ')
            .map((f: FaqByMerchant) => {
              return {
                id: f.id,
                additional_data_id: f.additional_data_id,
                status: f.status,
                order: f.order,
              };
            });
          form.setFieldValue('faq', faq);
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
    fetchFaqByMerchantId(id as string);
  }, [router.query]);

  return (
    <Form.Item name="faq">
      <FaqTable dataSource={tableData} loading={loading} form={form} />
    </Form.Item>
  );
}
