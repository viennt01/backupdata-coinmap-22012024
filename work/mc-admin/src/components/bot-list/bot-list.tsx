import {
  Breadcrumb,
  Row,
  Col,
  Radio,
  RadioChangeEvent,
  Tabs,
  Spin,
  Empty,
} from 'antd';
import { getMerchantInfo, getAvailableBots, AvailableBot } from './fetcher';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ERROR_CODE } from '@/constant/error-code';
import { BOT_STATUS, BOT_CATEGORY } from '@/constant/bot';
import CardBot from '@/components/bot-list/components/cart-bot';
import { MerchantInfo } from '@/interface/merchant-info';
import { DOMAIN_TYPE } from '@/constant/merchant';

interface BotListProps {
  data: AvailableBot[];
  loading: boolean;
  canSettingWebsite: boolean;
}

interface Filter {
  status: BOT_STATUS;
  category: BOT_CATEGORY;
}

const TABS_DATA: {
  title: string;
  key: BOT_STATUS.ALL | BOT_STATUS.ACTIVE | BOT_STATUS.INACTIVE;
}[] = [
  {
    title: 'All',
    key: BOT_STATUS.ALL,
  },
  {
    title: 'Activated',
    key: BOT_STATUS.ACTIVE,
  },
  {
    title: 'Deactivated',
    key: BOT_STATUS.INACTIVE,
  },
];

const BotList = ({ data, loading, canSettingWebsite }: BotListProps) => {
  if (loading)
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Spin />
      </div>
    );

  if (!data.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <Row gutter={[24, 24]}>
      {data.map((bot) => (
        <Col key={bot.id} span={24} md={12} lg={8}>
          <CardBot bot={bot} disabled={!canSettingWebsite} />
        </Col>
      ))}
    </Row>
  );
};

export default function AffiliateList() {
  const [loading, setLoading] = useState(false);
  const [botList, setAvailableBots] = useState<AvailableBot[]>([]);
  const [filter, setFilter] = useState<Filter>({
    status: BOT_STATUS.ALL,
    category: BOT_CATEGORY.ALL,
  });
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | undefined>();

  const fetchMerchantInfo = () => {
    getMerchantInfo()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setMerchantInfo(res.payload);
        }
      })
      .catch((e: Error) => console.log(e));
  };

  const fetchBotList = (queryString?: string) => {
    setLoading(true);
    getAvailableBots(queryString ?? '')
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setAvailableBots(res.payload.rows);
        }
      })
      .catch((e: Error) => console.log(e))
      .finally(() => setLoading(false));
  };

  const handleClickTabItem = (key: string) => {
    setFilter((prev) => ({ ...prev, status: key as BOT_STATUS }));
  };

  const onChangeBotType = useCallback((e: RadioChangeEvent) => {
    setFilter((prev) => ({ ...prev, category: e.target.value }));
  }, []);

  const operations = useMemo(
    () => (
      <Radio.Group onChange={onChangeBotType} value={filter.category}>
        <Radio value={BOT_CATEGORY.ALL}>All</Radio>
        <Radio value={BOT_CATEGORY.SBOT}>Signal</Radio>
        <Radio value={BOT_CATEGORY.TBOT}>Trading</Radio>
      </Radio.Group>
    ),
    [filter.category, onChangeBotType]
  );

  const canSettingWebsite = useMemo(
    () =>
      [DOMAIN_TYPE.OTHERS].includes(
        merchantInfo?.config.domain_type as DOMAIN_TYPE
      ),
    [merchantInfo]
  );

  const tabItems = TABS_DATA.map((item) => {
    return {
      label: (
        <div>
          {item.title} {item.title === 'All' ? `(#)` : ''}
        </div>
      ),
      key: item.key,
      children: (
        <BotList
          data={botList}
          loading={loading}
          canSettingWebsite={canSettingWebsite}
        />
      ),
    };
  });

  useEffect(() => {
    fetchMerchantInfo();
  }, []);

  useEffect(() => {
    // remove key with empty value
    const queryFilter = Object.keys(filter).reduce(
      (result: { [key: string]: string }, key) => {
        if (filter[key as keyof Filter]) {
          result[key] = filter[key as keyof Filter];
        }
        return result;
      },
      {}
    );
    const queryString = new URLSearchParams(
      queryFilter as unknown as string
    ).toString();

    fetchBotList(queryString);
  }, [filter]);

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>A.I Trading list</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs
        onTabClick={handleClickTabItem}
        activeKey={filter.status}
        tabBarExtraContent={operations}
        items={tabItems}
      />
    </>
  );
}
