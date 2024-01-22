export function getCookie(cookieName: string) {
  const cookieCondition = (pair: string) => {
    return pair.trim().startsWith(`${cookieName}=`);
  };

  const cookieList = document.cookie.split(';');
  const cookiePair = cookieList.find(cookieCondition);

  return decodeURIComponent(cookiePair ? cookiePair.split('=')[1] : '');
}

export function getAccessTokenFromCookie(): string {
  let access_token = '';
  if (process.env.APP_ENV === 'local') {
    headers.setToken(process.env.ACCESS_TOKEN || '');
    access_token = process.env.ACCESS_TOKEN || '';
  } else {
    access_token = getCookie('_pomerium');
    headers.setToken(getCookie('_pomerium') || '');
  }
  if (headers.headers.Authorization) {
    return access_token;
  }
  return '';
}
class Headers {
  public headers = {
    Authorization: '',
    'content-type': 'application/json',
  };
  // constructor() {
  //   if (process.env.APP_ENV === 'local') {
  //     this.setToken(process.env.ACCESS_TOKEN || '');
  //   } else {
  //     this.setToken(getCookie('_pomerium') || '');
  //   }
  // }

  setToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  removeToken() {
    this.headers = {
      ...this.headers,
      Authorization: '',
    };
  }
}

export const headers = new Headers();

export function convertToParamsString<T>(obj: any & T): string {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}
