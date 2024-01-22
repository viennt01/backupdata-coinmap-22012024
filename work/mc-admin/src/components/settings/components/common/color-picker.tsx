import { Avatar, Input, InputProps, Tooltip } from 'antd';

export interface ColorPickerProps extends InputProps {
  title: string;
}

const ColorPicker = ({ title, ...props }: ColorPickerProps) => {
  return (
    <Tooltip title={title} placement="bottom">
      <div style={{ display: 'flex', width: '100%', gap: 8 }}>
        <Avatar
          size="large"
          shape="square"
          style={{ background: `${props.value}`, border: '1px solid #d9d9d9' }}
        />
        <Input
          style={{ flex: 1 }}
          size="large"
          placeholder="Ex: #0B84FE"
          onFocus={(e) => e.target.select()}
          {...props}
        />
      </div>
    </Tooltip>
  );
};

export default ColorPicker;
