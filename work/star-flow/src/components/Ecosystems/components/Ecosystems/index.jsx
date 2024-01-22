import Image from 'next/image';
import style from './index.module.scss';
import useAnimation from './useAnimation';

export default function EcosystemsSection() {
  useAnimation();
  return (
    <>
      <div className={style.container}>
        <div id="ecosystems_container" className={style.content}>
          <div id="ecosystems_timeline_1" className={style.title}>
            Ecosystem
          </div>
          <div id="ecosystems_timeline_2" className={style.description}>
            Coinmap constructed an ecosystem around trader
          </div>
          <div id="ecosystems_timeline_3" className={style.description}>
            WITH
          </div>
        </div>
      </div>
      <div className={style.bottomContainer}>
        <svg
          id="ecosystems_timeline_3"
          className={style.features}
          width="100%"
          viewBox="0 0 1920 248"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1857.31 248H1749.05C1748.53 247.877 1748.02 247.752 1747.5 247.626C1728.48 242.988 1712.83 236.96 1700.55 229.541L1726.98 169.721C1738.57 176.445 1751.44 181.893 1765.58 186.067C1779.96 190.009 1793.87 191.979 1807.32 191.979C1815.2 191.979 1821.34 191.516 1825.75 190.588C1830.39 189.429 1833.75 187.922 1835.84 186.067C1837.92 183.98 1838.97 181.546 1838.97 178.763C1838.97 174.358 1836.53 170.88 1831.66 168.33C1826.79 165.779 1820.3 163.693 1812.19 162.07C1804.3 160.215 1795.61 158.36 1786.1 156.505C1776.6 154.418 1766.97 151.752 1757.23 148.506C1747.73 145.26 1738.92 140.97 1730.8 135.638C1722.92 130.305 1716.54 123.349 1711.67 114.77C1706.81 105.96 1704.37 95.0622 1704.37 82.0781C1704.37 67.0073 1708.54 53.3276 1716.89 41.0391C1725.47 28.5187 1738.11 18.5487 1754.8 11.1292C1771.73 3.70975 1792.71 0 1817.75 0C1834.21 0 1850.44 1.73894 1866.44 5.21683C1882.44 8.69471 1896.81 14.0275 1909.57 21.2151L1884.87 80.687C1872.82 74.6586 1861.11 70.1374 1849.75 67.1232C1838.62 64.1091 1827.72 62.602 1817.05 62.602C1809.17 62.602 1802.91 63.2975 1798.27 64.6887C1793.64 66.0798 1790.27 67.9347 1788.19 70.2533C1786.33 72.5719 1785.41 75.1224 1785.41 77.9047C1785.41 82.0781 1787.84 85.4401 1792.71 87.9905C1797.58 90.3091 1803.95 92.2799 1811.84 93.903C1819.95 95.526 1828.76 97.2649 1838.27 99.1198C1848.01 100.975 1857.63 103.525 1867.14 106.771C1876.64 110.017 1885.34 114.307 1893.22 119.639C1901.34 124.972 1907.83 131.928 1912.7 140.507C1917.57 149.085 1920 159.751 1920 172.503C1920 187.342 1915.71 201.022 1907.13 213.542C1898.78 225.831 1886.26 235.801 1869.57 243.452C1865.71 245.166 1861.63 246.682 1857.31 248ZM82.0781 248H0V5.56461H197.892V67.471H82.0781V109.206H183.632V171.112H82.0781V248ZM426.234 248H223.821V5.56461H421.713V67.471H304.508V95.9897H407.453V155.114H304.508V187.11H426.234V248ZM515.259 248H431.844L537.823 5.56461H618.51L724.489 248H639.682L623.764 206.587H531.177L515.259 248ZM860.747 248H778.669V69.21H707.372V5.56461H932.044V69.21H860.747V248ZM1113.33 248H1019.62C1003.79 242.98 990.315 235.088 979.18 224.324C958.313 204.152 947.879 175.865 947.879 139.463V5.56461H1029.96V137.029C1029.96 155.577 1033.32 168.793 1040.04 176.677C1046.77 184.328 1055.81 188.154 1067.17 188.154C1078.76 188.154 1087.81 184.328 1094.3 176.677C1101.02 168.793 1104.38 155.577 1104.38 137.029V5.56461H1185.07V139.463C1185.07 175.865 1174.64 204.152 1153.77 224.324C1142.63 235.088 1129.16 242.98 1113.33 248ZM1304.77 248H1222.69V5.56461H1339.9C1362.62 5.56461 1382.21 9.27436 1398.68 16.6938C1415.37 24.1133 1428.24 34.7789 1437.28 48.6904C1446.32 62.3701 1450.84 78.6003 1450.84 97.3808C1450.84 116.161 1446.32 132.392 1437.28 146.071C1429.4 157.787 1418.62 167.127 1404.94 174.092L1455.37 248H1367.73L1327.13 187.806H1304.77V248ZM1684.25 248H1481.84V5.56461H1679.73V67.471H1562.52V95.9897H1665.47V155.114H1562.52V187.11H1684.25V248ZM577.471 86.1408L601.04 147.462H553.901L577.471 86.1408ZM1304.77 125.9H1334.68C1346.04 125.9 1354.39 123.349 1359.72 118.248C1365.29 113.147 1368.07 106.191 1368.07 97.3808C1368.07 88.5702 1365.29 81.6144 1359.72 76.5135C1354.39 71.4126 1346.04 68.8622 1334.68 68.8622H1304.77V125.9Z"
            fill="#31AFFE"
          />
        </svg>
        <div className={style.gridBackground}>
          <Image
            src="/images/grid-layout.png"
            alt=""
            width={1920}
            height={480}
          />
        </div>
        <div className={style.contentContainer}>
          <div id="features_container" className={style.content}>
            <div id="features_timeline_2" className={style.title}>
              Footprint x Heatmap
            </div>
            <p id="features_timeline_3" className={style.shortDescription}>
              Despite being the most typical chart type used among retail
              traders, a candlestick chart remains limited and restricted in
              expressing market data. Nearly 90% of the data market is hidden if
              using only the candlestick chart.
            </p>
            <p id="features_timeline_3" className={style.description}>
              Traditional indicators are the same; most are lagging and slow and
              create diversions from learning the nature of the market.
            </p>
            <p id="features_timeline_3" className={style.description}>
              Coinmap is now packed with more advanced indicators and unique
              tools to refine your edge in trading in the financial market. Our
              indicator helps you to detect critical market movement, track
              massive order flow, and reveal significant volume intent that
              changes rapidly over time.
            </p>
          </div>
          <div id="features_timeline_1" className={style.image}>
            <div>
              <Image
                src="/images/ecosystems/1.png"
                alt=""
                width={656}
                height={407}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
