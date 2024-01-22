import { Breadcrumb, Card, Table, Space, Button, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Key, useEffect, useState } from 'react';
import { getFaq, updateFaqStatus } from './fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { Faq, FaqOfDataMap, STATUS } from './interface';
import { errorToast, successToast } from '@/hook/toast';
import { formatDateTime } from '@/utils/format';

const { Title } = Typography;

export default function ListFaq() {
  const [checkSelectCheckbox, setCheckSelectCheckbox] = useState(true);
  const [dataFaq, setDataFaq] = useState<FaqOfDataMap[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<FaqOfDataMap> = [
    Table.SELECTION_COLUMN,
    {
      title: 'FAQ',
      dataIndex: ['data', 'translation', 'en', 'name'],
    },
    {
      title: 'FAQ',
      dataIndex: ['data', 'translation', 'vi', 'name'],
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      align: 'right',

      render: (value: Faq['created_at']) =>
        formatDateTime(new Date(Number(value))),
    },
    Table.EXPAND_COLUMN,
  ];

  const handleEdit = () => {
    if (!checkSelectCheckbox) {
      setLoading(true);

      const dataUpdate = dataFaq.map((item) => {
        const status = selectedRowKeys.includes(item.key)
          ? STATUS.ON
          : STATUS.OFF;
        return {
          id: item.key,
          additional_data_id: item.additional_data_id,
          status,
        };
      });
      updateFaqStatus(dataUpdate)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            successToast('FAQ status updated successfully');
            setLoading(false);
            return;
          }
          errorToast(res.message);
        })
        .catch((e: Error) => {
          errorToast(JSON.parse(e.message)?.message || 'Failed');
          console.log(e);
        });
    }
    setCheckSelectCheckbox(!checkSelectCheckbox);
  };

  const handleSelectionChange = (selectedRowKeys: Key[]) => {
    console.log(selectedRowKeys);

    setSelectedRowKeys(selectedRowKeys);
  };

  const fetchFaq = () => {
    getFaq()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setDataFaq(
            res.payload.map((item) => {
              return {
                key: item.id,
                data: item.data,
                status: item.status,
                additional_data_id: item.additional_data_id,
                created_at: item.created_at,
              };
            })
          );
          setSelectedRowKeys(
            res.payload
              .filter((item) => item.status === STATUS.ON)
              .map((obj) => obj.id)
          );
        }
      })
      .catch((e: Error) => console.log(e));
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>FAQ</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        bordered={false}
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>
              FAQ
            </Title>
            <Button onClick={handleEdit} type="primary" loading={loading}>
              {checkSelectCheckbox ? 'EDIT' : 'SAVE'}
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          rowSelection={{
            columnWidth: '5%',
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange: handleSelectionChange,
            getCheckboxProps: () => ({
              disabled: checkSelectCheckbox,
            }),
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <div>
                  <div>EN:</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: record.data.translation.vi.answer,
                    }}
                  />
                  <div>VI:</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: record.data.translation.en.answer,
                    }}
                  />
                </div>
              </div>
            ),
          }}
          dataSource={dataFaq}
        />
      </Card>
    </>
  );
}
