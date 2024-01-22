import type { ColumnsType } from 'antd/es/table';
import React, { useState, memo } from 'react';
import {
  Table,
  Modal,
  Typography,
  Button,
  Pagination,
  PaginationProps,
  Tag,
} from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import QRCode from '@/components/commons/qr';
import CustomCard from '@/components/commons/custom-card';
import domtoimage from 'dom-to-image';
import { AdminGetUserDataOutput } from '@/utils/api-getters';
import { URLS } from '@/constants/urls';
import { formatDate } from '@/utils/format';
import {
  ATTEND_STATUS,
  ATTEND_STATUS_COLOR,
  EVENT_CONFIRM_STATUS_COLOR,
  PAYMENT_STATUS_COLOR,
} from '@/constants/code-constants';
import { ROUTERS } from '@/constants/router';

interface GuestsTableProps {
  dataSource: AdminGetUserDataOutput[];
  loading: boolean;
  maxHeight: number;
  pagination: TablePaginationConfig | undefined;
  onChange: PaginationProps['onChange'];
  eventOptions: OptionSelect[];
}

interface OptionSelect {
  label: string;
  value: string;
}

const { Text } = Typography;

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading, maxHeight, pagination, onChange, eventOptions } =
    props;
  const router = useRouter();
  const [openQRCode, setOpenQRCode] = useState(false);
  const [guestInfo, setGuestInfo] = useState<AdminGetUserDataOutput>();

  const columns: ColumnsType<AdminGetUserDataOutput> = [
    {
      title: '',
      dataIndex: 'qr_code',
      fixed: 'left',
      align: 'left',
      width: '56px',
      render: (_, record) => (
        <QrcodeOutlined
          style={{ cursor: 'pointer', fontSize: '18px' }}
          onClick={() => {
            setGuestInfo(record);
            setOpenQRCode(true);
          }}
        />
      ),
    },
    {
      title: '#',
      dataIndex: 'index',
      fixed: 'left',
      align: 'right',
      width: '40px',
      render: (value, record, index) => {
        const { pageSize = 0, current = 0 } = pagination ?? {};
        return index + pageSize * (current - 1) + 1;
      },
    },
    {
      title: 'Name',
      dataIndex: 'fullname',
      width: '10%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '10%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '10%',
    },
    {
      title: 'Telegram',
      dataIndex: 'telegram',
      width: '10%',
      align: 'center',
      render: (value) => {
        return value || '--';
      },
    },
    {
      title: 'Event',
      dataIndex: 'event_id',
      width: '15%',
      render: (value) =>
        eventOptions.find((item) => item.value === value)?.label ?? '',
    },
    {
      title: 'Invite code',
      dataIndex: 'invite_code',
      width: '7%',
    },
    {
      title: 'Confirm status',
      dataIndex: 'confirm_status',
      align: 'center',
      width: '10%',
      render: (value) => (
        <Tag
          color={
            EVENT_CONFIRM_STATUS_COLOR[
              value as keyof typeof EVENT_CONFIRM_STATUS_COLOR
            ]
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      title: 'Payment status',
      dataIndex: 'payment_status',
      align: 'center',
      width: '10%',
      render: (value) => (
        <Tag
          color={
            PAYMENT_STATUS_COLOR[value as keyof typeof PAYMENT_STATUS_COLOR]
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      title: 'Attend',
      dataIndex: 'attend',
      width: '7%',
      align: 'center',
      // render: (value) => (value ? 'YES' : 'NO'),
      render: (value) => (
        <Tag
          color={
            ATTEND_STATUS_COLOR[
              ATTEND_STATUS[
                value as keyof typeof ATTEND_STATUS
              ] as keyof typeof ATTEND_STATUS_COLOR
            ]
          }
        >
          {ATTEND_STATUS[value as keyof typeof ATTEND_STATUS]}
        </Tag>
      ),
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      width: '10%',
      align: 'right',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      align: 'right',
      width: '15%',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: '',
      dataIndex: 'action',
      fixed: 'right',
      align: 'right',
      width: '56px',
      render: (_, record) => (
        <EditOutlined
          style={{ cursor: 'pointer', fontSize: '18px' }}
          onClick={() => router.push(`${ROUTERS.GUESTS}/${record.id}`)}
        />
      ),
    },
  ];

  const downloadQRCode = () => {
    const qrCodeInfoNode = document.getElementById('qr-code-info') as Node;
    if (!guestInfo || !qrCodeInfoNode) return;
    domtoimage.toPng(qrCodeInfoNode).then((dataUrl: string) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = guestInfo.id + '.png';
      link.click();
    });
  };

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        scroll={{ x: 2000, y: maxHeight }}
        tableLayout="auto"
      />
      <Pagination
        responsive={true}
        style={{ textAlign: 'right', marginTop: '24px' }}
        {...pagination}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        onChange={onChange}
      />
      <Modal
        centered
        width={368 + 48}
        open={openQRCode}
        onCancel={() => setOpenQRCode(false)}
        footer={null}
        title={null}
        closable={false}
      >
        <div>
          <div id="qr-code-info" style={{ background: '#fff' }}>
            <CustomCard>
              <QRCode
                data={URLS.CALLBACK_ATTEND_URL + `?token=${guestInfo?.id}`}
                width={320}
                height={320}
                image="/images/coinmap-logo-border.svg"
                imageOptions={{ imageSize: 0.5, hideBackgroundDots: false }}
              />
              <div style={{ marginTop: 24 }}>
                <Text strong>Name: </Text>
                {guestInfo ? guestInfo.fullname : ''}
              </div>
              <div>
                <Text strong>Email: </Text>
                {guestInfo ? guestInfo.email : ''}
              </div>
              <div>
                <Text strong>Phone: </Text>
                {guestInfo ? guestInfo.phone : ''}
              </div>
            </CustomCard>
          </div>
          <Button
            type="primary"
            size="large"
            style={{ marginTop: 24, width: '100%' }}
            onClick={downloadQRCode}
          >
            Download
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default memo(GuestsTable);
