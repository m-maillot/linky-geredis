import Conf from 'conf';
import pkg from '../package.json' assert { type: 'json' };

const LOGIN = 'login';

const store = new Conf({
  projectName: 'linky',
  projectVersion: pkg.version,
  migrations: {
    '>=2.0.0': (store: any) => {
      store.clear();
    },
  },
});

export function getLogin(): { user: string; password: string } | undefined {
  const login = store.get(LOGIN, undefined);
  if (login) {
    return JSON.parse(login as string) as { user: string; password: string };
  }
  return undefined;
}

export function saveLogin(user: string, password: string) {
  return store.set(LOGIN, JSON.stringify({ user, password }));
}
