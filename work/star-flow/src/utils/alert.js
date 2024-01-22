import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export const showSweetAlert = (options) => {
  Swal.fire(options);
};

export const showInfoIncomming = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  showSweetAlert({
    title: 'This function is coming soon',
    icon: 'info',
  });

  return false;
};

export const showTooltipNeedUpgrade = (child) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Please upgrade to use this function</Tooltip>}
    >
      {child}
    </OverlayTrigger>
  );
};
