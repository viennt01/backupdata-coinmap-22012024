import Chart from './Chart';
import { withHeatmapData } from './hocs/withHeatmapData';

const ChartHeatmapWrapper = withHeatmapData(Chart);
export default ChartHeatmapWrapper;
