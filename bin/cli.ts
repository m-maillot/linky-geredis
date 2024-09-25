import meow from 'meow';
import { auth } from './auth.js';
import { type MeteringFlags, type Format, MeteringHandler } from './metering.js';
import chalk from 'chalk';
import ora from 'ora';
import updateNotifier from 'update-notifier';
import dayjs from 'dayjs';
import pkg from '../package.json' assert { type: 'json' };

function exit(e: any) {
  if (e.message) {
    ora().fail(e.message);
  }
  process.exitCode = 1;
}

const mainHelp = `
    linky <commande> [options]
    
    Commandes:
      linky auth            Crée une connexion à un compte Geredis. Vous pouvez obtenir un compte sur https://espace-client.linkygeredis.fr/
      linky daily           Récupère la consommation quotidienne
      linky loadcurve       Récupère la puissance moyenne consommée quotidiennement, sur un intervalle de 30 min
      linky maxpower        Récupère la puissance maximale de consommation atteinte quotidiennement
      linky dailyprod       Récupère la production quotidienne
      linky loadcurveprod   Récupère la puissance moyenne produite quotidiennement, sur un intervalle de 30 min
    
    Options:
      linky auth:
        --token     -t      Token récupéré sur https://conso.boris.sh

      linky (daily|loadcurve|maxpower|dailyprod|loadcurveprod):
        --start     -s      Date de début (AAAA-MM-JJ). Par défaut: hier
        --end       -e      Date de début (AAAA-MM-JJ). Par défaut: aujourd'hui
        --prm       -p      Numéro de PRM, obligatoire si le token permet d'accéder à plusieurs PRMs, optionnel sinon.
        --token     -t      Token, pour utiliser un token différent de celui enregistré avec la commande auth. Optionnel
        --format    -f      Determine le format d'affichage de sortie du script. Options: pretty, json, csv. Par défaut: pretty
        --quiet     -q      N'affiche pas les messages et animations de progression. Optionnel
        --output    -o      Fichier de sortie. Optionnel
        
    Exemples:
      linky auth --user xxx --password xxx
      linky daily
      linky dailyprod --start 2023-01-01 --end 2023-01-08
      linky maxpower --start 2023-05-01 --end 2023-05-15 --format json --quiet
      linky loadcurve -s 2023-01-01 -e 2023-01-08 -o data/ma_conso.json --format json
      linky loadcurveprod -p 225169
`;

const authCommand = 'auth';
const dailyConsumptionCommand = 'daily';
const dailyProductionCommand = 'dailyprod';
const loadCurveCommand = 'loadcurve';
const loadCurveProductionCommand = 'loadcurveprod';
const maxPowerCommand = 'maxpower';

const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

const cli = meow(mainHelp, {
  importMeta: import.meta,
  description: false,
  flags: {
    prm: { type: 'string', shortFlag: 'p' },
    user: { type: 'string', shortFlag: 'u' },
    password: { type: 'string', shortFlag: 'p' },
    start: { type: 'string', shortFlag: 's', default: yesterday },
    end: { type: 'string', shortFlag: 'e', default: today },
    output: { type: 'string', shortFlag: 'o' },
    format: { type: 'string', shortFlag: 'f', default: 'pretty' },
    quiet: { type: 'boolean', shortFlag: 'q', default: false },
  },
});

const meteringFlags: MeteringFlags = {
  start: cli.flags.start,
  end: cli.flags.end,
  output: cli.flags.output,
  quiet: cli.flags.quiet,
  format: cli.flags.format as Format,
  prm: cli.flags.prm,
  user: cli.flags.user,
  password: cli.flags.password,
};

const notifier = updateNotifier({ pkg });
notifier.notify({
  message:
    'Mise à jour disponible: ' +
    chalk.dim('{currentVersion}') +
    chalk.reset(' → ') +
    chalk.green('{latestVersion}') +
    ' \nLancez ' +
    chalk.cyan('npm i -g linky') +
    ' pour mettre à jour',
});

switch (cli.input[0]) {
  case authCommand:
    try {
      await auth(cli.flags.user, cli.flags.password);
    } catch (e) {
      exit(e);
    }

    break;
  case dailyConsumptionCommand:
    try {
      await new MeteringHandler(meteringFlags).daily();
    } catch (e) {
      exit(e);
    }
    break;
  case loadCurveCommand:
    try {
      await new MeteringHandler(meteringFlags).loadCurve();
    } catch (e) {
      exit(e);
    }
    break;
  case maxPowerCommand:
    try {
      await new MeteringHandler(meteringFlags).maxPower();
    } catch (e) {
      exit(e);
    }
    break;
  case dailyProductionCommand:
    try {
      await new MeteringHandler(meteringFlags).dailyProduction();
    } catch (e) {
      exit(e);
    }
    break;
  case loadCurveProductionCommand:
    try {
      await new MeteringHandler(meteringFlags).loadCurveProduction();
    } catch (e) {
      exit(e);
    }
    break;
  default:
    cli.showHelp();
}
