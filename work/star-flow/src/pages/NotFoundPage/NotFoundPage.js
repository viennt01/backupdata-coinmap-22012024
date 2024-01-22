import { Component } from 'react';
import style from './NotFoundPage.module.scss';
class NotFoundPage extends Component {
  render() {
    return (
      <div className={style.container}>
        <div className={style.box}>
          <div className={style.group}>
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-hidden="true"
            >
              &times;
            </button>
            <strong>Không Tìm Thấy Trang</strong>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
