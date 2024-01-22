/* eslint-disable @typescript-eslint/no-explicit-any */
interface Header {
  name: string;
  value: string;
  converter?: (value: any) => any;
}

// generate string based on system date
export const getSystemDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = ('00' + (date.getMonth() + 1)).slice(-2);
  const dd = ('00' + date.getDate()).slice(-2);
  const hh = ('00' + date.getHours()).slice(-2);
  const mm = ('00' + date.getMinutes()).slice(-2);
  const ss = ('00' + date.getSeconds()).slice(-2);
  const SSS = ('000' + date.getMilliseconds()).slice(-3);
  return yyyy + MM + dd + hh + mm + ss + SSS;
};

// export data to csv and auto download
export const exportCsv = (data: any, headers: Header[], fileName?: string) => {
  const exportData = data.map((record: any) =>
    headers.map((column) => {
      const value = record[column.value];
      return `"${column.converter ? column.converter(value) : value ?? ''}"`;
    })
  );
  exportData.unshift(headers.map((column) => column.name));

  const csvContent =
    'data:text/csv;charset=UTF-8,' +
    '\uFEFF' +
    exportData.map((row: any) => row.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.href = encodedUri;
  link.download = fileName ? getSystemDate() + '_' + fileName : getSystemDate();
  link.click();
};
