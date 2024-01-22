import React from 'react';
import { Card, CardProps } from 'antd';

const CustomCard = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return (
    <Card
      {...props}
      style={{
        borderRadius: 4,
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        ...props.style,
      }}
      ref={ref}
    >
      {props.children}
    </Card>
  );
});

CustomCard.displayName = 'CustomCard';

export default CustomCard;
