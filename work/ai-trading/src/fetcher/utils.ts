class Headers {
  headers = {
    m_affiliate: '',
    Authorization: '',
    'content-type': 'application/json',
  };

  setToken(token: string | null) {
    this.headers = {
      ...this.headers,
      Authorization: token ? `Bearer ${token}` : '',
    };
  }
  setAffiliateCode(code: string) {
    this.headers = {
      ...this.headers,
      m_affiliate: code,
    };
  }
}

export const headers = new Headers();
