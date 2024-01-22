class Headers {
  headers = {
    Authorization: '',
    'content-type': 'application/json',
    m_affiliate: '',
  };

  setToken(token) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  setMerchantCode(code) {
    this.headers = {
      ...this.headers,
      m_affiliate: code ?? '',
    };
  }
}
class HeadersUploadFromData {
  headers = {
    Authorization: '',
  };

  setToken(token) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }
}
export const headers = new Headers();
export const headersUploadFromData = new HeadersUploadFromData();
export const ERROR_CODE = {
  SUCCESS: 'SUCCESS',
  OK: 'ok',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
};

/**
 * * Add delay for api response
 *  - response time < minDelay -> delay -> resolve
 *  - response time > minDelay -> resolve
 * * Pros:
 *  - Prevent flash when api so fast
 *  - Increase time between api calls -> optimize for BE
 * @param {Function} requester
 * @param {number} [minDelay=500]
 */
export const withMinDelay =
  (requester, minDelay = 500) =>
  async (...props) => {
    const startTime = Date.now();
    const res = await requester(...props);

    const endTime = Date.now();
    const diffTime = endTime - startTime;
    if (diffTime > minDelay) {
      return res;
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(res), minDelay - diffTime);
    });
  };
