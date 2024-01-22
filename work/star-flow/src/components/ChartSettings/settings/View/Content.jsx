import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Divider from '../components/divider';

import styled from '../components/styles.module.scss';
import { ColorSection } from '../../components/index';
import { Input, Title, Selector } from '../components';
import SelectLines, { LINES_OPTIONS } from '../components/select-line';
import {
  BACKGROUND_TYPE,
  DRAWING_DEFAULT,
  FONT_FAMILY,
  FPS_VALUES,
} from '@/config/consts/settings/view';
// data = [
//   {
//     Title: () => JSX.Element
//     Content: []() => JSX.Element
//   },
// ]

const FONT_OPTIONS = [
  { value: FONT_FAMILY.IONICONS, label: 'Ionicons' },
  { value: FONT_FAMILY.ROBOTO, label: 'Roboto' },
];

const BACKGROUND_OPTIONS = [
  { value: BACKGROUND_TYPE.SOLID, label: 'Solid' },
  { value: BACKGROUND_TYPE.GRADIENT, label: 'Gradient' },
];

const DRAWING_TYPE_OPTIONS = [
  { value: DRAWING_DEFAULT.CURRENT_CHART, label: 'Current chart' },
  { value: DRAWING_DEFAULT.ALL_CHARTS, label: 'All charts' },
];

const FPS_OPTIONS = FPS_VALUES.map((value) => ({
  value,
  label: value ? value + ' FPS' : 'Auto',
}));

const WIDTH_OPTIONS = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
];

export const DATA_NORMAL = [
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Custom Tick Size" />
        <Form.Check
          disabled
          inline
          name="group1"
          type={'checkbox'}
          id={`tacked-imbalance`}
          checked={settings.customTickSize.display}
          onChange={handleToggle('customTickSize.display')}
          className={styled.checkboxSettings}
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          disabled
          value={settings.customTickSize.value}
          onChange={handleChangeValue('customTickSize.value')}
          key="customTickSize.value"
          step={1}
          min={0}
        />
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Drawings default availability" />
        <Form.Check
          disabled
          inline
          name="group1"
          type={'checkbox'}
          id={`tacked-imbalance`}
          checked={settings.drawingDefault.display}
          onChange={handleToggle('drawingDefault.display')}
          className={styled.checkboxSettings}
          key="stacked-imbalance"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          disabled
          isSearchable={false}
          value={{
            value: settings.drawingDefault.value,
            label: DRAWING_TYPE_OPTIONS.find(
              (t) => t.value === settings.drawingDefault.value
            ).label,
          }}
          options={DRAWING_TYPE_OPTIONS}
          key="drawingDefault.value"
          onChange={handleChangeValue('drawingDefault.value')}
        />
      ),
    ],
  },
  {
    title: () => (
      <div className={styled.tdLeftContainer}>
        <Title text="Limit FPS" />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.fps,
            label: FPS_OPTIONS.find((t) => t.value === settings.fps).label,
          }}
          options={FPS_OPTIONS}
          key="fps"
          onChange={handleChangeValue('fps')}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Background" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`tacked-imbalance`}
          checked={settings.background.display}
          onChange={handleToggle('background.display')}
          className={styled.checkboxSettings}
          key="stacked-imbalance"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.background.type,
            label: BACKGROUND_OPTIONS.find(
              (t) => t.value === settings.background.type
            ).label,
          }}
          options={BACKGROUND_OPTIONS}
          key="background.type"
          onChange={handleChangeValue('background.type')}
        />
      ),
      ({ settings, handleChangeColor }) => (
        <div key="settings.background.color[0]" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="background.color[0]"
            color={settings.background['color[0]']}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="settings.background.color[1]" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="background.color[1]"
            color={settings.background['color[1]']}
          />
        </div>
      ),
    ],
  },

  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Watermark" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`tacked-imbalance`}
          checked={settings.waterMark.display}
          onChange={handleToggle('waterMark.display')}
          className={styled.checkboxSettings}
          key="stacked-imbalance"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <Input
          type="text"
          value={settings.waterMark.text}
          onChange={handleChangeValue('waterMark.text')}
          key="waterMark.text"
          placeholder={'Text'}
        />
      ),
    ],
  },

  {
    title: () => null,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.waterMark.font,
            label: FONT_OPTIONS.find((t) => t.value === settings.waterMark.font)
              .label,
          }}
          options={FONT_OPTIONS}
          key="cluster-visualizattion"
          onChange={handleChangeValue('waterMark.font')}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <Input
          value={settings.waterMark.fontSize}
          onChange={handleChangeValue('waterMark.fontSize')}
          key="waterMark.fontSize"
          placeholder={'All charts with the same symbol'}
          step={1}
          min={0}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <Input
          value={Number(settings.waterMark.opacity)}
          onChange={(value) =>
            handleChangeValue('waterMark.opacity')(
              Number(value || 0).toFixed(1)
            )
          }
          key="waterMark.opacity"
          placeholder={'All charts with the same symbol'}
          step={0.1}
          min={0}
          max={1}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="CROSSHAIR" />,
    content: [],
  },

  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Visible" />
        <Form.Check
          inline
          name="group1"
          type={'checkbox'}
          id={`tacked-imbalance`}
          checked={settings.crossHair.visible.display}
          onChange={handleToggle('crossHair.visible.display')}
          className={styled.checkboxSettings}
          key="stacked-imbalance"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.crossHair.visible.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.crossHair.visible.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('crossHair.visible.type')(line.value);
          }}
          key={'crossHair.visible.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="crossHair.visible.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.crossHair.visible.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.crossHair.visible.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="cluster-visualizattion"
            onChange={handleChangeValue('crossHair.visible.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="crossHair.visible.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="crossHair.visible.color"
            color={settings.crossHair.visible.color}
          />
        </div>
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="GRID" />,
    content: [],
  },

  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Time (vertical)" />
        <Form.Check
          inline
          name="grid.timeVertical.display"
          type={'checkbox'}
          id={`grid.timeVertical.display`}
          checked={settings.grid.timeVertical.display}
          onChange={handleToggle('grid.timeVertical.display')}
          className={styled.checkboxSettings}
          key="grid.timeVertical.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.grid.timeVertical.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.grid.timeVertical.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('grid.timeVertical.type')(line.value);
          }}
          key={'grid.timeVertical.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="grid.timeVertical.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.grid.timeVertical.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.grid.timeVertical.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="grid.timeVertical.width"
            onChange={handleChangeValue('grid.timeVertical.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="grid.timeVertical.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="grid.timeVertical.color"
            color={settings.grid.timeVertical.color}
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Price (horizontal)" />
        <Form.Check
          inline
          name="grid.priceHorizontal.display"
          type={'checkbox'}
          id={`grid.priceHorizontal.display`}
          checked={settings.grid.priceHorizontal.display}
          onChange={handleToggle('grid.priceHorizontal.display')}
          className={styled.checkboxSettings}
          key="grid.priceHorizontal.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.grid.priceHorizontal.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.grid.priceHorizontal.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('grid.priceHorizontal.type')(line.value);
          }}
          key={'grid.priceHorizontal.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="grid.priceHorizontal.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.grid.priceHorizontal.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.grid.priceHorizontal.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="grid.priceHorizontal.width"
            onChange={handleChangeValue('grid.priceHorizontal.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="grid.priceHorizontal.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="grid.priceHorizontal.color"
            color={settings.grid.priceHorizontal.color}
            key="grid.priceHorizontal.color"
          />
        </div>
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
    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = value;
    }
    setSettings({ ...settings });
  };

  const handleToggle = (key) => (e) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = e.target.checked;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = e.target.checked;
    }
    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = e.target.checked;
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

    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = value;
    }
    setSettings({ ...settings });
  };

  return (
    <div className={styled.viewSettingsContainer}>
      <Table
        id="table-settings-view"
        className={styled.tableSettings}
        responsive
        borderless
      >
        <tbody>
          {DATA_NORMAL.map((d, i) => {
            if (d.type === 'divider') {
              return (
                <tr key={i}>
                  <td colSpan={2}>
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
    </div>
  );
}
