import Script from 'next/script';

const GoogleAnalytics = ({ ggTagIds }) => {
  const generateGtagConfig = (tagId) => {
    if (!tagId) return '';
    return `gtag('config', '${tagId}', { page_path: window.location.pathname, cookie_flags: 'secure;samesite=none' });`;
  };

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GG_ANALYTICS_KEY}`}
      />
      <Script id="gg-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${generateGtagConfig(process.env.GG_ANALYTICS_KEY)}
          ${ggTagIds.reduce(
            (result, id) => result + generateGtagConfig(id),
            ''
          )}
          `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
