import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';
import FacebookPixel from '@/components/Analytics/FacebookPixel';

const Analytics = ({ startScript, analytics }) => {
  if (!startScript) return <></>;
  return (
    <>
      <GoogleAnalytics ggTagIds={analytics.ggTagIds} />
      <FacebookPixel fbPixelId={analytics.fbPixelId} />
    </>
  );
};

export default Analytics;
