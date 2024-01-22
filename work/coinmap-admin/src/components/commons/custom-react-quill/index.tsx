import React from 'react';
import dynamic from 'next/dynamic';
import { ReactQuillProps } from 'react-quill';
import style from './index.module.scss';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {
    ssr: false,
  }
);

const COLORS = [
  '#000000',
  '#ffffff',
  '#df1125',
  '#fc4e12',
  '#ffe0ab',
  '#1ea5fc',
  '#8962f8',
  '#578887',
  '#d8c9af',
];

export const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
    ['clean'],
    [{ color: COLORS }],
    [{ background: COLORS }],
  ],
};

const CustomReactQuill = (props: ReactQuillProps) => {
  return (
    <ReactQuill
      theme="snow"
      modules={MODULES}
      className={style.reactQuill}
      {...props}
    />
  );
};

CustomReactQuill.displayName = 'CustomReactQuill';

export default CustomReactQuill;
