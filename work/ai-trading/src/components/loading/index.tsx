import { Spin } from 'antd';
import style from './index.module.scss';

export default function Loading() {
  return (
    <div className={style.loadingContainer}>
      <Spin />
    </div>
  );
}
