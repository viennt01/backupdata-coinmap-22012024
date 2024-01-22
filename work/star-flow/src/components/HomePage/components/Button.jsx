import Loading from './Loading';
import style from './Button.module.scss';
const Colors = {
  secondary: 1,
  primary: 2,
};

const Button = (props) => {
  return (
    <button
      id={props.id}
      type={props.type || 'button'}
      onClick={props.onClick}
      className={[
        style.btn__1,
        style.btn__2,
        props.fill ? style.btn__3 : style.btn__4,
        !props.disabled &&
          (props.color === Colors.primary ? style.btn__5 : style.btn__6),
        props.disabled ? style.btnDisable : '',
      ].join(' ')}
    >
      {props.children}
      {props.loading && <Loading />}
    </button>
  );
};
Button.colors = Colors;
export default Button;
