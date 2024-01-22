import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Divider from '../components/divider';

import styled from '../components/styles.module.scss';
import { ColorSection } from '../../components/index';
import { Title, Selector } from '../components';
import SelectLines, { LINES_OPTIONS } from '../components/select-line';
import { timeFormat } from 'd3-time-format';

import {
  DATE_FORMAT,
  FONT_SIZE,
  FONT_FAMILY,
} from '@/config/consts/settings/timescale';
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

const FONT_SIZE_OPTIONS = [
  { value: FONT_SIZE[8], label: '8' },
  { value: FONT_SIZE[9], label: '9' },
  { value: FONT_SIZE[10], label: '10' },
  { value: FONT_SIZE[11], label: '11' },
  { value: FONT_SIZE[12], label: '12' },
];

const DATE_FORMAT_OPTIONS = [
  {
    value: DATE_FORMAT.DDMMYYYY,
    label: timeFormat(DATE_FORMAT.DDMMYYYY)(new Date()),
  },
  {
    value: DATE_FORMAT.MMDDYYYY,
    label: timeFormat(DATE_FORMAT.MMDDYYYY)(new Date()),
  },
  {
    value: DATE_FORMAT.YYYYMMDD,
    label: timeFormat(DATE_FORMAT.YYYYMMDD)(new Date()),
  },
  {
    value: DATE_FORMAT['YYYY-MM-DD'],
    label: timeFormat(DATE_FORMAT['YYYY-MM-DD'])(new Date()),
  },
  {
    value: DATE_FORMAT['YY-MM-DD'],
    label: timeFormat(DATE_FORMAT['YY-MM-DD'])(new Date()),
  },
  {
    value: DATE_FORMAT['YY/MM/DD'],
    label: timeFormat(DATE_FORMAT['YY/MM/DD'])(new Date()),
  },
  {
    value: DATE_FORMAT['YYYY/MM/DD'],
    label: timeFormat(DATE_FORMAT['YYYY/MM/DD'])(new Date()),
  },
  {
    value: DATE_FORMAT['DD-MM-YYYY'],
    label: timeFormat(DATE_FORMAT['DD-MM-YYYY'])(new Date()),
  },
  {
    value: DATE_FORMAT['DD-MM-YY'],
    label: timeFormat(DATE_FORMAT['DD-MM-YY'])(new Date()),
  },
  {
    value: DATE_FORMAT['DD/MM/YY'],
    label: timeFormat(DATE_FORMAT['DD/MM/YY'])(new Date()),
  },
  {
    value: DATE_FORMAT['DD/MM/YYYY'],
    label: timeFormat(DATE_FORMAT['DD/MM/YYYY'])(new Date()),
  },
  {
    value: DATE_FORMAT['MM/DD/YYYY'],
    label: timeFormat(DATE_FORMAT['MM/DD/YYYY'])(new Date()),
  },
  {
    value: DATE_FORMAT['MM/DD/YY'],
    label: timeFormat(DATE_FORMAT['MM/DD/YY'])(new Date()),
  },
];

const WIDTH_OPTIONS = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
];

export const DATA_NORMAL = [
  {
    title: () => <Title text="Date format" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.dateFormat,
            label: DATE_FORMAT_OPTIONS.find(
              (t) => t.value === settings.dateFormat
            ).label,
          }}
          options={DATE_FORMAT_OPTIONS}
          key="dateFormat"
          onChange={handleChangeValue('dateFormat')}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },

  {
    title: () => <Title text="APPEARANCE" />,
    content: [],
  },
  {
    title: () => <Title text="Font" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.font.fontFamily,
            label: FONT_OPTIONS.find(
              (t) => t.value === settings.font.fontFamily
            ).label,
          }}
          options={FONT_OPTIONS}
          key="font.fontFamily"
          onChange={handleChangeValue('font.fontFamily')}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.font.fontSize,
            label: FONT_SIZE_OPTIONS.find(
              (t) => t.value === settings.font.fontSize
            ).label,
          }}
          options={FONT_SIZE_OPTIONS}
          key="font.fontSize"
          onChange={handleChangeValue('font.fontSize')}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div className="w-auto">
          <button
            className={[
              styled.buttonBold,
              settings.font.bold ? styled.active : '',
            ].join(' ')}
            onClick={() => handleChangeValue('font.bold')(!settings.font.bold)}
          >
            B
          </button>
        </div>
      ),
    ],
  },
  {
    title: () => <Title text="Font color" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="fontColor">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="fontColor"
            color={settings.fontColor}
            key="fontColor"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    title: () => <Title text="Axis" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="axis">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="axis"
            color={settings.axis}
            key="axis"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    title: () => <Title text="Axis background" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="axisBackground">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="axisBackground"
            color={settings.axisBackground}
            key="axisBackground"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    type: 'divider',
  },

  {
    title: () => <Title text="HIGHLIGHT DATE" />,
    content: [],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Day separators" />
        <Form.Check
          inline
          name="daySeparators.display"
          type={'checkbox'}
          id={`daySeparators.display`}
          checked={settings.daySeparators.display}
          onChange={handleToggle('daySeparators.display')}
          className={styled.checkboxSettings}
          key="daySeparators.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.daySeparators.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.daySeparators.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('daySeparators.type')(line.value);
          }}
          key={'daySeparators.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="daySeparators.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.daySeparators.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.daySeparators.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="daySeparators.width"
            onChange={handleChangeValue('daySeparators.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="daySeparators.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="daySeparators.color"
            color={settings.daySeparators.color}
            key="daySeparators.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Week separators" />
        <Form.Check
          inline
          name="weekSeparators.display"
          type={'checkbox'}
          id={`weekSeparators.display`}
          checked={settings.weekSeparators.display}
          onChange={handleToggle('weekSeparators.display')}
          className={styled.checkboxSettings}
          key="weekSeparators.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.weekSeparators.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.weekSeparators.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('weekSeparators.type')(line.value);
          }}
          key={'weekSeparators.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="weekSeparators.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.weekSeparators.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.weekSeparators.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="weekSeparators.width"
            onChange={handleChangeValue('weekSeparators.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="weekSeparators.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="weekSeparators.color"
            color={settings.weekSeparators.color}
            key="weekSeparators.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Month separators" />
        <Form.Check
          inline
          name="monthSeparators.display"
          type={'checkbox'}
          id={`monthSeparators.display`}
          checked={settings.monthSeparators.display}
          onChange={handleToggle('monthSeparators.display')}
          className={styled.checkboxSettings}
          key="monthSeparators.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.monthSeparators.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.monthSeparators.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('monthSeparators.type')(line.value);
          }}
          key={'monthSeparators.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="monthSeparators.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.monthSeparators.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.monthSeparators.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="monthSeparators.width"
            onChange={handleChangeValue('monthSeparators.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="monthSeparators.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="monthSeparators.color"
            color={settings.monthSeparators.color}
            key="monthSeparators.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title text="Year separators" />
        <Form.Check
          inline
          name="yearSeparators.display"
          type={'checkbox'}
          id={`yearSeparators.display`}
          checked={settings.yearSeparators.display}
          onChange={handleToggle('yearSeparators.display')}
          className={styled.checkboxSettings}
          key="yearSeparators.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          line={{
            value: settings.yearSeparators.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.yearSeparators.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('yearSeparators.type')(line.value);
          }}
          key={'yearSeparators.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="yearSeparators.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            isSearchable={false}
            value={{
              value: settings.yearSeparators.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.yearSeparators.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="yearSeparators.width"
            onChange={handleChangeValue('yearSeparators.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="yearSeparators.color" className="w-auto">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="yearSeparators.color"
            color={settings.yearSeparators.color}
            key="yearSeparators.color"
          />
        </div>
      ),
    ],
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
