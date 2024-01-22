import { FormCheck } from 'react-bootstrap';
import style from './BSCheckbox.module.scss';

/**
 * Custom bootstrap checkbox
 * @param {FormCheckProps} props
 */
const BSCheckbox = (props) => {
  return <FormCheck className={style.checkbox} {...props} />;
};

export default BSCheckbox;
