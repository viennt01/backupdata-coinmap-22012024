import style from './style.module.css';
import SvgLoadingBar from './bar.svg';

const Loading = ({ iconProps = {}, className }) => (
  <div className={`${style.wrapper} ${className ? className : ''}`}>
    <SvgLoadingBar {...iconProps} />
  </div>
);

export default Loading;
