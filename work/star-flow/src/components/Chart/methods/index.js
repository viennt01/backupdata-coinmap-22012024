import * as trendLineMethods from './trendLine';
import * as fiboMethods from './fibo';
import * as pathMethods from './path';
import * as textMethods from './text';
import * as drawMethods from './draw';
import * as triangleMethods from './triangle';
import * as rectangleMethods from './rectangle';
import * as extendedLineMethods from './extendedLine';
import * as arrowMarkerMethods from './arrowMarker';
import * as verticalLineMethods from './verticalLine';
import * as horizontalLineMethods from './horizontalLine';
import * as horizontalRayMethods from './horizontalRay';
import * as calloutMethods from './callout';
import * as arrowMethods from './arrow';
import * as longPositionMethods from './longPosition';
import * as shortPositionMethods from './shortPosition';
import * as botOrderAnnotation from './botOrderAnnotation';

const methods = {
  ...trendLineMethods,
  ...fiboMethods,
  ...pathMethods,
  ...drawMethods,
  ...textMethods,
  ...triangleMethods,
  ...rectangleMethods,
  ...extendedLineMethods,
  ...arrowMarkerMethods,
  ...verticalLineMethods,
  ...horizontalLineMethods,
  ...horizontalRayMethods,
  ...calloutMethods,
  ...arrowMethods,
  ...longPositionMethods,
  ...shortPositionMethods,
  ...botOrderAnnotation,
};

export default methods;
