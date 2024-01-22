import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Divider from '../components/divider';

import styled from '../components/styles.module.scss';
import { ColorSection } from '../../components/index';
import {
  POC_TYPE,
  APPLY_SETTINGS_FOR,
} from '@/config/consts/settings/footprint';
import { Input } from '../components';
import { Title, Selector } from '../components';

// data = [
//   {
//     Title: () => JSX.Element
//     Content: []() => JSX.Element
//   },
// ]

const TYPE_OPTIONS = [{ value: 'imbalance', label: 'Imbalance' }];
const CLUSTER_OPTIONS = [{ value: 'histogram', label: 'Histogram' }];
const POC_OPTIONS = [
  { value: POC_TYPE.COMBINED, label: 'Combined' },
  { value: POC_TYPE.SEPERATOR, label: 'Seperate' },
];

const DELTA_DEVERGENCE_OPTIONS = [
  { value: 'delta', label: 'Follow Delta' },
  { value: 'candlestick', label: 'Follow Candlestick' },
];

export const DATA_NORMAL = [
  {
    title: () => <Title text="These settings will apply for" />,
    content: [],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="All symbols" />
        <Form.Check
          inline
          type={'checkbox'}
          checked={settings.applySettingsFor === APPLY_SETTINGS_FOR.ALL}
          onChange={handleToggle('applySettingsFor')}
          value={APPLY_SETTINGS_FOR.ALL}
          id={`applySettingsForAll`}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Current symbol" />
        <Form.Check
          inline
          type={'checkbox'}
          checked={settings.applySettingsFor === APPLY_SETTINGS_FOR.CURRENT}
          onChange={handleToggle('applySettingsFor')}
          value={APPLY_SETTINGS_FOR.CURRENT}
          id={`applySettingsForAll`}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="Type" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.type,
            label: TYPE_OPTIONS.find((t) => t.value === settings.type).label,
          }}
          options={TYPE_OPTIONS}
          key="type"
          onChange={handleChangeValue('type')}
        />
      ),
    ],
  },
  {
    title: () => <Title text="Cluster Visualization" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.clusterVisualization,
            label: CLUSTER_OPTIONS.find(
              (t) => t.value === settings.clusterVisualization
            ).label,
          }}
          options={CLUSTER_OPTIONS}
          key="cluster-visualizattion"
          onChange={handleChangeValue('clusterVisualization')}
        />
      ),
    ],
  },
  {
    title: () => <Title text="Volume Color" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          handleChangeColor={handleChangeColor}
          label=""
          keyColor="volume.color"
          color={settings.volume.color}
          key="volume.color"
        />
      ),
    ],
  },
  {
    title: () => <Title text="Imbalance Ratio" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          value={settings.imbalance.ratio}
          onChange={handleChangeValue('imbalance.ratio')}
          key="imbalance-1"
          step={1}
          max={100}
          min={0}
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          keyColor="imbalance.sellColor"
          color={settings.imbalance.sellColor}
          handleChangeColor={handleChangeColor}
          label="Sell"
          key="imbalance.sellColor"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Buy"
          keyColor="imbalance.buyColor"
          color={settings.imbalance.buyColor}
          handleChangeColor={handleChangeColor}
          key="imbalance.buyColor"
        />
      ),
    ],
  },
  {
    title: () => <Title margin text="Filtered Volume" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          value={settings.imbalance.filterVolume}
          onChange={handleChangeValue('imbalance.filterVolume')}
          key="imbalance.filterVolume"
          step={1}
          min={0}
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title margin text="Imbalance" />
        <Form.Check
          inline
          name="imbalance.display"
          type={'checkbox'}
          id={`imbalance.display`}
          checked={settings.imbalance.display}
          onChange={handleToggle('imbalance.display')}
          className={styled.checkboxSettings}
          key="imbalance.display"
        />
      </div>
    ),
    content: [],
  },
  {
    title: () => <Title margin text="Zone Count" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          key={'imbalance.zoneCount'}
          value={settings.imbalance.zoneCount}
          onChange={handleChangeValue('imbalance.zoneCount')}
          step={1}
          min={0}
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          keyColor="imbalance.noSellColor"
          color={settings.imbalance.noSellColor}
          handleChangeColor={handleChangeColor}
          label="Sell"
          key="imbalance.noSellColor"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Buy"
          keyColor="imbalance.noBuyColor"
          color={settings.imbalance.noBuyColor}
          handleChangeColor={handleChangeColor}
          key="imbalance.noBuyColor"
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Stack Imbalance" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`stackImbalance`}
          checked={settings.stackImbalance}
          onChange={handleToggle('stackImbalance')}
          className={styled.checkboxSettings}
          key="stackImbalance"
        />
      </div>
    ),
    content: [],
  },
  {
    type: 'divider',
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="highlight-zero" className={styled.tdLeftContainer}>
        <Title text="Highlight Zeros" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`highlight-zero`}
          checked={settings.highlightZero.display}
          onChange={handleToggle('highlightZero.display')}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Text"
          keyColor="highlightZero.textColor"
          color={settings.highlightZero.textColor}
          handleChangeColor={handleChangeColor}
          key="highlight-zero-1"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Back"
          keyColor="highlightZero.color"
          color={settings.highlightZero.color}
          handleChangeColor={handleChangeColor}
          key="highlight-zero-2"
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="unfinished-auction" className={styled.tdLeftContainer}>
        <Title text="Highlight Unfinished Aution" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`unfinished-auction`}
          className={styled.checkboxSettings}
          key="unfinished-auction"
          checked={settings.unFinishedAuction.display}
          onChange={handleToggle('unFinishedAuction.display')}
        />
      </div>
    ),

    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Text"
          key="unfinished-auction-1"
          keyColor="unFinishedAuction.textColor"
          color={settings.unFinishedAuction.textColor}
          handleChangeColor={handleChangeColor}
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          label="Back"
          key="unfinished-auction-2"
          keyColor="unFinishedAuction.color"
          color={settings.unFinishedAuction.color}
          handleChangeColor={handleChangeColor}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="exhaustion-airow" className={styled.tdLeftContainer}>
        {/* it is label of 'exhaustionAirow' */}
        <Title text="Exhaustion Arrow" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          checked={settings.exhaustionAirow.display}
          onChange={handleToggle('exhaustionAirow.display')}
          id={`exhaustion-airow`}
          className={styled.checkboxSettings}
        />
      </div>
    ),

    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          key="exhaustion-airow"
          value={settings.exhaustionAirow.value}
          onChange={handleChangeValue('exhaustionAirow.value')}
          step={1}
          min={0}
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="deltaDivergence.display" className={styled.tdLeftContainer}>
        <Title text="Delta Divergence" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          checked={settings.deltaDivergence.display}
          onChange={handleToggle('deltaDivergence.display')}
          id={`detla-div`}
          className={styled.checkboxSettings}
        />
      </div>
    ),

    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.deltaDivergence.type,
            label: DELTA_DEVERGENCE_OPTIONS.find(
              (t) => t.value === settings.deltaDivergence.type
            ).label,
          }}
          options={DELTA_DEVERGENCE_OPTIONS}
          key="deltaDivergence.type"
          onChange={handleChangeValue('deltaDivergence.type')}
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="poc.display" className={styled.tdLeftContainer}>
        <Title text="Show POC" />
        <Form.Check
          inline
          name="poc.display"
          checked={settings.poc.display}
          onChange={handleToggle('poc.display')}
          type={'checkbox'}
          id={`show-poc`}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          keyColor="poc.textColor"
          color={settings.poc.textColor}
          handleChangeColor={handleChangeColor}
          label="Text"
          key="show-poc-1"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          keyColor="poc.color"
          color={settings.poc.color}
          handleChangeColor={handleChangeColor}
          label="Back"
          key="show-poc-2"
        />
      ),
    ],
  },
  {
    title: () => (
      <div className={styled.tdLeftContainer}>
        <Title margin text="POC Type" />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.poc.type,
            label: POC_OPTIONS.find((t) => t.value === settings.poc.type).label,
          }}
          onChange={handleChangeValue('poc.type')}
          options={POC_OPTIONS}
          key="poc-type"
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div key="va.display" className={styled.tdLeftContainer}>
        <Title disabled text="Show Value Area" />
        <Form.Check
          disabled
          inline
          name="group1"
          type={'checkbox'}
          id={`show-value-area`}
          checked={settings.va.display}
          onChange={handleToggle('va.display')}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          disabled
          key="show-value-area-1"
          value={settings.va.value}
          onChange={handleChangeValue('va.value')}
          step={1}
          max={100}
          min={0}
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          disabled
          label="Back"
          keyColor="va.color"
          color={settings.va.color}
          handleChangeColor={handleChangeColor}
          key="show-value-area-2"
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
];

const DATA_ADVANCE = [
  {
    title: ({ settings, handleToggle }) => (
      <Form.Check
        inline
        label="Show Volume"
        name="group1"
        type={'checkbox'}
        checked={settings.volume.display}
        onChange={handleToggle('volume.display')}
        id={`show-volume`}
        className={styled.checkboxSettings}
      />
    ),
    content: [
      ({ settings, handleToggle }) => (
        <Form.Check
          inline
          label="Show Delta"
          name="delta"
          checked={settings.delta}
          onChange={handleToggle('delta')}
          type={'checkbox'}
          id={`show-delta`}
          className={styled.checkboxSettings}
          key="delta"
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <Form.Check
        inline
        label="Show Total"
        type={'checkbox'}
        checked={settings.totalBidAsk}
        onChange={handleToggle('totalBidAsk')}
        id={`show-total`}
        className={styled.checkboxSettings}
      />
    ),
    content: [
      ({ settings, handleToggle }) => (
        <Form.Check
          key="ratio"
          inline
          label="Show Hight/Low Ratio"
          name="group1"
          checked={settings.ratioHigh && settings.ratioLow}
          onChange={handleToggle('ratio')}
          type={'checkbox'}
          id={`show-ratio`}
          className={styled.checkboxSettings}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
];

export default function Content({ setSettings, settings }) {
  const handleChangeColor = (key, value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = value;
    }
    setSettings({ ...settings });
  };

  const handleToggle = (key) => (e) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      if (key === 'ratio') {
        settings.ratioHigh = e.target.checked;
        settings.ratioLow = e.target.checked;
      } else {
        settings[keys[0]] = e.target.checked;
      }
      if (key === 'applySettingsFor') {
        settings[keys[0]] = e.target.value;
      }
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = e.target.checked;
    }
    setSettings({ ...settings });
  };

  const handleChangeValue = (key) => (value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = value;
    }
    setSettings({ ...settings });
  };

  return (
    <>
      <Table className={styled.tableSettings} responsive borderless>
        <tbody>
          {DATA_NORMAL.map((d, i) => {
            if (d.type === 'divider') {
              return (
                <tr key={i}>
                  <td colSpan={4}>
                    <Divider />
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i}>
                <td width="40%">
                  {d.title({
                    settings,
                    handleChangeColor,
                    handleToggle,
                    handleChangeValue,
                  })}
                </td>
                <td>
                  <div className={styled.contentSettingsContainer}>
                    {d.content.map((c) => {
                      return c({
                        settings,
                        handleChangeColor,
                        handleToggle,
                        handleChangeValue,
                      });
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Table className={styled.tableSettings} responsive borderless>
        <tbody>
          {DATA_ADVANCE.map((d, i) => {
            if (d.type === 'divider') {
              return (
                <tr key={i}>
                  <td colSpan={4}>
                    <Divider />
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i}>
                <td width={'50%'}>
                  {d.title({
                    settings,
                    handleChangeColor,
                    handleToggle,
                    handleChangeValue,
                  })}
                </td>
                <td width={'50%'}>
                  <div className={styled.contentSettingsContainer}>
                    {d.content.map((c) => {
                      return c({
                        settings,
                        handleChangeColor,
                        handleToggle,
                        handleChangeValue,
                      });
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
