import style from './Loading.module.scss';
const SIZES = {
  small: 1,
  normal: 2,
};

const Loading = ({ size = SIZES.normal }) => {
  let sizeStyle = {
    width: 32,
    height: 32,
    WebkitMask: 'radial-gradient(farthest-side,#0000 calc(100% - 6px),#fff 0)',
  };

  switch (size) {
    case SIZES.small: {
      sizeStyle = {
        width: 24,
        height: 24,
        WebkitMask:
          'radial-gradient(farthest-side,#0000 calc(100% - 4px),#fff 0)',
      };
    }
  }

  return (
    <div className={style.container}>
      <div style={sizeStyle} className={style.box}></div>
    </div>
  );
};

Loading.sizes = SIZES;

export default Loading;
