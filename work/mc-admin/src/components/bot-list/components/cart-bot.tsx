import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Tag,
  Switch,
  Popconfirm,
  Badge,
} from 'antd';
import { FALLBACK_IMG } from '@/constant/common';
import { updateBotStatus, AvailableBot } from '@/components/bot-list/fetcher';
import { useState } from 'react';
import { ERROR_CODE } from '@/constant/error-code';
import {
  BOT_STATUS,
  BOT_STATUS_LABEL,
  BOT_CATEGORY_LABEL,
} from '@/constant/bot';
import Link from 'next/link';

const { Title, Text } = Typography;

interface CardBotProps {
  bot: AvailableBot;
  disabled: boolean;
}

const COLORS = {
  INACTIVE: '#FF4D4F',
  ACTIVE: '#52C41A',
  BORDER: '#e5e5e5',
};

const CardBot = ({ bot, disabled }: CardBotProps) => {
  const [botInfo, setBotInfo] = useState<AvailableBot>(bot);
  const active = botInfo.status === BOT_STATUS.ACTIVE;

  const handleUpdateBotStatus = () => {
    const status = active ? BOT_STATUS.INACTIVE : BOT_STATUS.ACTIVE;
    const _requestData = {
      category: botInfo.category,
      data: [
        {
          id: botInfo.id,
          asset_id: botInfo.asset_id,
          status,
        },
      ],
    };
    updateBotStatus(_requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setBotInfo((prev) => ({ ...prev, status }));
        }
      })
      .catch((e: Error) => console.log(e));
  };

  return (
    <Badge.Ribbon
      text={BOT_CATEGORY_LABEL[bot.category as keyof typeof BOT_CATEGORY_LABEL]}
    >
      <Card bordered={false} style={{ overflow: 'hidden' }}>
        <Row gutter={8} wrap={false} style={{ marginBottom: 8 }}>
          <Col>
            <Image
              style={{ borderRadius: '50%' }}
              preview={false}
              width={60}
              height={60}
              src={botInfo.image_url ?? ''}
              alt=""
              fallback={FALLBACK_IMG}
            />
          </Col>
          <Col flex="auto">
            <Link href={`/customer/list?tbots=${botInfo.asset_id}`}>
              <Title style={{ color: '#2f54eb' }} ellipsis level={4}>
                {botInfo.name}
              </Title>
            </Link>
            <Text>{botInfo.category}</Text>
          </Col>
        </Row>
        <Row justify={'space-between'} style={{ marginBottom: 8 }}>
          <Col>
            <Text strong>ID</Text>
          </Col>
          <Col>{botInfo.id.slice(-7)}</Col>
        </Row>
        <Row justify={'space-between'} style={{ marginBottom: 8 }}>
          <Col>
            <Text strong>Commission</Text>
          </Col>
          <Col>{botInfo.commission * 100}%</Col>
        </Row>
        <Row
          justify={'space-between'}
          style={{
            margin: '24px -24px -24px',
            padding: 24,
            borderTop: `1px solid ${COLORS.BORDER}`,
          }}
        >
          <Col>
            <Tag
              style={{ margin: 0, padding: '2px 8px' }}
              color={
                botInfo.status === BOT_STATUS.ACTIVE
                  ? COLORS.ACTIVE
                  : COLORS.INACTIVE
              }
            >
              {
                BOT_STATUS_LABEL[
                  botInfo.status as keyof typeof BOT_STATUS_LABEL
                ]
              }
            </Tag>
          </Col>
          <Col>
            <Popconfirm
              disabled={disabled}
              placement="topLeft"
              title="Are you sure to do this?"
              description=""
              onConfirm={handleUpdateBotStatus}
              okText="Yes"
              cancelText="No"
            >
              <Switch checked={active} disabled={disabled} />
            </Popconfirm>
          </Col>
        </Row>
      </Card>
    </Badge.Ribbon>
  );
};

export default CardBot;
