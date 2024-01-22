import React, { useState } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Row,
  Tabs,
  TabsProps,
  ConfigProvider,
} from 'antd';
import COLORS from '@/constants/color';

import style from './index.module.scss';
import {
  SvgCompair,
  SvgDiscuss,
  SvgExport,
  SvgHistory,
  SvgInfo,
  SvgMirror,
  SvgOptimize,
  SvgOverview,
  SvgRefresh,
  SvgSetting,
  SvgTopTrader,
} from './assets/svg';
import { DownOutlined } from '@ant-design/icons';

const FEATURES = [
  {
    name: 'Social Trading',
    description: 'Connect, Learn, and Profit Together',
    keyValues: [
      {
        icon: <SvgTopTrader />,
        title: 'Discover top-performing traders',
        desc: "Browse through our platform's leaderboard to identify and follow successful traders who consistently generate profits.",
      },
      {
        icon: <SvgMirror />,
        title: 'Mirror trading strategies',
        desc: 'Seamlessly copy the trades of your chosen experts, automatically replicating their strategies and performance in your own portfolio.',
      },
      {
        icon: <SvgDiscuss />,
        title: 'Engage in discussions',
        desc: 'Join our active forums to exchange ideas, discuss market trends, and learn from fellow traders.',
      },
    ],
  },
  {
    name: 'Backtest engine',
    description: 'Test Your Strategies with Confidence',
    keyValues: [
      {
        icon: <SvgHistory />,
        title: 'Historical data analysis',
        desc: 'Our Backtest Engine provides access to extensive historical market data, allowing you to test your trading strategies against real-world scenarios.',
      },
      {
        icon: <SvgSetting />,
        title: 'Customizable parameters',
        desc: 'Tailor your backtests by adjusting parameters such as date range, assets, and trading frequency to match your desired trading approach.',
      },
      {
        icon: <SvgInfo />,
        title: 'Risk management',
        desc: "Gain insights into your strategy's risk profile, including metrics such as drawdown, volatility, and Sharpe ratio.",
      },
      {
        icon: <SvgOptimize />,
        title: 'Optimize for success',
        desc: 'Use the results from your backtests to refine your strategies, minimizing risks and maximizing potential returns.',
      },
    ],
  },
  {
    name: 'Performance Report',
    description: 'In-Depth Analysis to Drive Informed Decisions',
    keyValues: [
      {
        icon: <SvgOverview />,
        title: 'Portfolio overview',
        desc: ' Get a detailed view of your trading performance with our user-friendly dashboard, featuring essential metrics and visualizations.',
      },
      {
        icon: <SvgRefresh />,
        title: 'Real-time tracking',
        desc: 'Monitor your trades and strategies in real-time, enabling you to make informed decisions and respond to market changes swiftly.',
      },
      {
        icon: <SvgCompair />,
        title: 'Benchmark comparisons',
        desc: "Gauge your performance against relevant benchmarks, such as market indices, to evaluate your strategy's effectiveness.",
      },
      {
        icon: <SvgExport />,
        title: 'Exportable reports',
        desc: 'Download your performance data in various formats (PDF, CSV, etc.) for further analysis or to share with your financial advisor.',
      },
    ],
  },
];

const KeyValueCol: React.FC<{
  keyvalue: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  };
  xl: number;
}> = ({ keyvalue: { icon, title, desc }, xl = 8 }) => (
  <Col span={24} xl={xl}>
    <div className={style.feature}>
      <span className={style.icon}>{icon}</span>
      <h2 className={style.featureTitle}>{title}</h2>
      <p className={style.featureDesc}>{desc}</p>
    </div>
  </Col>
);

const tabItems: TabsProps['items'] = FEATURES.map((feature, index) => ({
  key: `${index}`,
  label: null,
  children: (
    <>
      <p className={style.desc}>{feature.description}</p>
      <Row gutter={16}>
        {feature.keyValues.map((keyValue, index) => (
          <KeyValueCol
            key={index}
            keyvalue={keyValue}
            xl={Math.floor(24 / feature.keyValues.length)}
          />
        ))}
      </Row>
    </>
  ),
}));

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <section id="features" className={style.section}>
      <div className="container">
        <p className={style.title}>Features</p>
        <div className={style.featureSelect}>
          {/* DESKTOP */}
          {FEATURES.map((feature, index) => (
            <Button
              size="large"
              type="primary"
              key={index}
              className={`${style.btnFeature} ${
                selectedFeature === index ? '' : style.selectable
              }`}
              onClick={() => setSelectedFeature(index)}
            >
              {feature.name}
            </Button>
          ))}

          {/* MOBILE */}
          <ConfigProvider
            theme={{
              token: {
                colorText: COLORS.BLACK,
                colorBgElevated: COLORS.WHITE,
              },
            }}
          >
            <Dropdown
              menu={{
                items: FEATURES.map((feature, index) => ({
                  key: index,
                  label: feature.name,
                })),
                selectable: true,
                defaultSelectedKeys: ['3'],
                onClick: ({ key }) => setSelectedFeature(+key),
              }}
            >
              <Button
                type="primary"
                className={`${style.btnFeature} ${style.btnSelectMobile}`}
              >
                {FEATURES[selectedFeature].name} <DownOutlined />
              </Button>
            </Dropdown>
          </ConfigProvider>
        </div>
        <Tabs
          items={tabItems}
          activeKey={`${selectedFeature}`}
          renderTabBar={() => <></>}
        />
      </div>
    </section>
  );
};

export default FeaturesSection;
