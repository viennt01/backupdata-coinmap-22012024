import Table from 'react-bootstrap/Table';
import Divider from '../components/divider';
import THEMES from '@/config/theme';

import styled from '../components/styles.module.scss';
import { Title, Selector } from '../components';
import { ColorSection } from '../../components/index';

// data = [
//   {
//     Title: () => JSX.Element
//     Content: []() => JSX.Element
//   },
// ]

export const DATA_NORMAL = [
  {
    title: () => <Title text="Theme" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.activeKey,
            label: THEMES[settings.activeKey].name,
          }}
          options={Object.keys(THEMES).map((key) => {
            return { label: THEMES[key].name, value: key };
          })}
          key="activeKey"
          onChange={handleChangeValue('activeKey')}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="Candle body" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          handleChangeColor={handleChangeColor}
          label="Buy"
          keyColor="custom.upColor"
          color={settings.custom.upColor}
          key="0"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          handleChangeColor={handleChangeColor}
          label="Sell"
          keyColor="custom.dwColor"
          color={settings.custom.dwColor}
          key="0"
        />
      ),
    ],
  },
  {
    title: () => <Title text="Candle border" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <ColorSection
          handleChangeColor={handleChangeColor}
          label="Buy"
          keyColor="custom.borderUpColor"
          color={settings.custom.borderUpColor}
          key="0"
        />
      ),
      ({ settings, handleChangeColor }) => (
        <ColorSection
          handleChangeColor={handleChangeColor}
          label="Sell"
          keyColor="custom.borderDwColor"
          color={settings.custom.borderDwColor}
          key="0"
        />
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
