import GoogleAnalytics from '@/components/layout/components/analytics/google-analytics';
import FacebookPixel from '@/components/layout/components/analytics/facebook-pixel';

interface Props {
  startScript: boolean;
  analytics: {
    ggTagIds: string[];
    fbPixelId: string;
  };
}

const Analytics = ({ startScript, analytics }: Props) => {
  if (!startScript) return <></>;
  return (
    <>
      <GoogleAnalytics ggTagIds={analytics.ggTagIds} />
      <FacebookPixel fbPixelId={analytics.fbPixelId} />
    </>
  );
};

export default Analytics;
