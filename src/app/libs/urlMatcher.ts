import { UrlSegment, UrlSegmentGroup, Route } from '@angular/router';

export function matchFaq(segments: UrlSegment[],
                         segmentGroup: UrlSegmentGroup,
                         route: Route) {
  const posParams: { [key: string]: UrlSegment } = {};
  if (segments.length === 0) {
    return null;
  }
  if (segments.length === 3 && segments.find(s => s.path === 'faq' && segments.indexOf(s) === 1)) {
    posParams['lang'] = segments[0];
    posParams['faqSlug'] = segments[2];
  } else {
    if (segments.find(s => s.path === 'faq') && segments.length > 1) {
      switch (segments.length) {
        case 4:
          posParams['lang'] = segments[0];
          posParams['categorySlug'] = segments[1];
          posParams['faqSlug'] = segments[3];
          break;
        case 5:
          posParams['lang'] = segments[0];
          posParams['categorySlug'] = segments[1];
          posParams['subcategorySlug'] = segments[2];
          posParams['faqSlug'] = segments[4];
          break;
        default:
          return null;
      }
    } else {
      return null;
    }
  }
  return {
    consumed: segments,
    posParams
  };
}

export function matchCategory(segments: UrlSegment[],
                              segmentGroup: UrlSegmentGroup,
                              route: Route) {
  const posParams: { [key: string]: UrlSegment } = {};
  if (segments.length > 0) {
    switch (segments.length) {
      case 2:
        posParams['lang'] = segments[0];
        posParams['categorySlug'] = segments[1];
        break;
      case 3:
        posParams['lang'] = segments[0];
        posParams['categorySlug'] = segments[1];
        posParams['subcategorySlug'] = segments[2];
        break;
      default:
        return null;
    }
  }

  return {
    consumed: segments,
    posParams
  };
}
