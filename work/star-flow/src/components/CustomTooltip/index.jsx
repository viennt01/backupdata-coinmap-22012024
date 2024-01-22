import { Tooltip } from 'react-bootstrap';
import { forwardRef } from 'react';

const CustomTooltip = ({ children, ...props }, ref) => (
  <div className="custom-tooltip">
    <Tooltip ref={ref} {...props}>
      {children}
    </Tooltip>
  </div>
);

CustomTooltip.displayName = 'CustomTooltip';

export default forwardRef(CustomTooltip);
