interface Props {
  statusCode: number;
}
function Error({ statusCode }: Props) {
  return (
    <p style={{ textAlign: 'center', margin: '32px 0' }}>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
