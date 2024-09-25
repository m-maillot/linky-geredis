import { Session } from '../lib/index.js';
import * as store from './store.js';
import ora from 'ora';
import { LinkyGeredisAPI } from '../lib/LinkyGeredisApi.js';

export async function auth(user: string | undefined, password: string | undefined) {
  if (!user || !password) {
    ora().fail("L'authentification nécessite un utilisateur et mot de passe");
    ora().info('Pour les obtenir, rendez-vous sur https://espace-client.linkygeredis.fr/');
    throw new Error();
  }

  try {
    const linkyAPI = new LinkyGeredisAPI(user, password);
    new Session(linkyAPI);
  } catch (e: any) {
    if (e.message) {
      ora().fail(e.message);
    }
    throw new Error();
  }

  store.saveLogin(user, password);

  ora().succeed('Token sauvegardé avec succès');
}

export function getSession({
  user,
  password,
  prm,
}: {
  user?: string | undefined;
  password?: string | undefined;
  prm?: string | undefined;
}): Session {
  if (!user || !password) {
    ora().fail("Vous n'avez aucun token enregistré");
    ora().info("Lancez 'linky auth' pour vous connecter ou renseignez le paramètre --token");

    throw new Error();
  }

  return new Session(new LinkyGeredisAPI(user, password)); // prm);
}
