import ora from 'ora';
import axios from 'axios';
import qs from 'qs';
import { APIError } from '../index.js';
import dayjs, { type Dayjs } from 'dayjs';

type AuthenticationReturn = { code: string; libelle: string };

type BearerResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  refresh_token: string;
};

export interface Authentication {
  generateBearer(): Promise<string>;
}

export class AuthenticationChallenger implements Authentication {
  private API_HOST = 'https://espace-client.linkygeredis.fr';

  private user = '';
  private password = '';

  private bearer: string | null = null;
  private bearerDeadline: Dayjs | null = null;

  constructor(private puser: string, private ppassword: string) {
    this.user = puser;
    this.password = ppassword;
  }

  async generateBearer(): Promise<string> {
    if (this.bearer !== null && this.bearerDeadline?.isAfter(dayjs())) {
      return this.bearer;
    }
    const cookie = await this.extractCookie();
    ora().info(`Cookie retrieved`);
    const code = await this.getCode(cookie);
    ora().info(`Code retrieved`);
    const { bearer, deadline } = await this.getBearer(code);
    ora().info(`Bearer retrieved`);
    this.bearer = bearer;
    this.bearerDeadline = deadline;
    return bearer;
  }

  private async extractCookie(): Promise<string> {
    const cookieUrl = `${this.API_HOST}/application/auth/externe/authentification`;

    return await axios
      .post<AuthenticationReturn>(
        cookieUrl,
        qs.stringify({
          username: this.user,
          password: this.password,
          client_id: 'aelGRD',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        }
      )
      .then((res) => {
        if (res.status === 200 && res.data.libelle === 'valide') {
          const cookies =
            res.headers['set-cookie'] && res.headers['set-cookie'].length > 0
              ? res.headers['set-cookie'][0].split(';')
              : [];
          const cookie = cookies.find((cookie) => cookie.startsWith('cookieOauth'));
          if (cookie) {
            return cookie;
          }
        }
        throw new Error(`Wrong response from authentication : ${JSON.stringify(res)}`);
      })
      .catch((err) => {
        if (err.response) {
          throw new APIError(err, err.response.status, err.response.data);
        }
        if (err.request) {
          throw new Error(`Aucune réponse\nRequête : ` + JSON.stringify(err.request, null, 4));
        }
        throw new Error(`Impossible d'appeler\nErreur : ${err.message}`);
      });
  }

  private async getCode(cookie: string): Promise<string> {
    try {
      const response = await axios.get(`${this.API_HOST}/application/auth/authorize-internet`, {
        params: {
          redirect_uri: 'https://espace-client.linkygeredis.fr/autorisation-callback.html',
          response_type: 'code',
          code_challenge: 'TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84',
          code_challenge_method: 'S256',
          client_id: 'aelGRD',
        },
        headers: {
          Cookie: cookie,
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 303,
      });

      const locationHeader = response.headers['location'];
      const urlParams = new URLSearchParams(locationHeader.split('?')[1]);
      const code = urlParams.get('code');
      if (code) {
        return code;
      }
      throw new Error(`Code absent du header`);
    } catch (err) {
      throw new Error(`Impossible de récupérer le code\nErreur : ${err}`);
    }
  }

  private async getBearer(code: string): Promise<{ bearer: string; deadline: Dayjs }> {
    try {
      const response = await axios.post<BearerResponse>(
        `${this.API_HOST}/application/auth/tokenUtilisateurInternet`,
        qs.stringify({
          code: code,
          redirect_uri: 'https://espace-client.linkygeredis.fr/autorisation-callback.html',
          grant_type: 'authorization_code',
          code_verifier: 3,
          client_id: 'aelGRD',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        }
      );

      return {
        bearer: response.data.access_token,
        deadline: dayjs().add(response.data.expires_in, 's'),
      };
    } catch (err) {
      throw new Error(`Impossible de récupérer le bearer\nErreur : ${err}`);
    }
  }
}
