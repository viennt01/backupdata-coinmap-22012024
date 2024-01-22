import { Td, Th } from '@chakra-ui/react';
import { useBgWhite } from 'components/hook';
import React from 'react';

export function MyTd({
  children,
  ...rest
}: { children: React.ReactNode } & any) {
  return (
    <Td whiteSpace={'nowrap'} py="5px" px="5px" {...rest}>
      {children}
    </Td>
  );
}

export function MyTh({
  children,
  ...rest
}: { children: React.ReactNode } & any) {
  const bgWhite = useBgWhite();
  return (
    <Th
      bg={bgWhite}
      position={'sticky'}
      zIndex="1 "
      top="0"
      whiteSpace={'nowrap'}
      color="gray.400"
      {...rest}
    >
      {children}
    </Th>
  );
}

interface Header {
  name: string;
  value: string;
  converter?: (value: any) => any;
}
export const exportCsv = (data: any, headers: Header[], fileName: string) => {
  const exportData = data.map((record: any) =>
    headers.map((column) => {
      const value = record[column.value]
        ? record[column.value].toString().replace(/,/g, ';')
        : '';
      return `${column.converter ? column.converter(value) : value}`;
    }),
  );
  exportData.unshift(headers.map((column) => column.name));

  const csvContent =
    'data:text/csv;charset=UTF-8,' +
    '\uFEFF' +
    exportData.map((row: any) => row.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.href = encodedUri;
  link.download = fileName;
  link.click();
};
