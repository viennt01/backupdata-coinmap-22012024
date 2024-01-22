import { forwardRef } from 'react';

const ResizeFit = ({
  contentComponent: ContentComponent,
  dimension,
  dataKey,
  customRef,
}) => {
  return (
    <div key={dataKey} ref={customRef}>
      <div className="customDragHandler" style={{ background: '#fff' }}>
        asdadsasdasd
      </div>
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 40px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ContentComponent {...dimension} />
      </div>
    </div>
  );
};

export default forwardRef(ResizeFit);
