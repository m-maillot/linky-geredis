export type PointDaccessResponse = PointDaccess[];

export interface PointDaccess {
  typeObjet: string;
  id: string;
  link: Link;
  reference: string;
  refusEnregistrementCourbeDeCharge: boolean;
  refusCollecteCourbeDeCharge: boolean;
  dateDebut: string;
  dateFin: any;
  dateFinRefusEnregistrementCourbeDeCharge: any;
  statut: Statut;
  pointDeService: PointDeService;
  contratsAcheminements: ContratsAcheminement[];
  servicesSouscritsHorsContrat: ServicesSouscritsHorsContrat[];
  nature: Nature2;
  actions: Action2[];
}

export interface Link {
  href: string;
  rel: string;
}

export interface Statut {
  code: string;
  libelle: string;
}

export interface PointDeService {
  typeObjet: string;
  id: string;
  link: Link2;
  reference: string;
  referenceExterne: any;
  appelUrgence: string;
  regroupementPadt: boolean;
  dateEtat: string;
  dateMiseEnService: string;
  dateProchaineReleveReelle: string;
  dateRemiseAttestationConformite: any;
  etat: Etat;
  nature: Nature;
  activite: Activite;
  modeReleve: ModeReleve;
  particularitePDS: any;
  motifNonMiseEnService: any;
  systemeAMI: any;
  concession: Concession;
  espaceDeLivraison: EspaceDeLivraison;
  communicabiliteAMM: CommunicabiliteAmm;
  periodesActiviteProfil: PeriodesActiviteProfil[];
  actions: Action[];
  ammCommunicant: boolean;
  calibreDisjoncteur: any;
  datePrevueDeploiementAMMMasse: string;
  dateAmmCommunicant: any;
  calibreProtection: CalibreProtection;
  niveauDeTension: NiveauDeTension;
  typeTension: TypeTension;
  palierTechnique: any;
  typeProtection: TypeProtection;
  sousEtatElec: SousEtatElec;
  calibreCompteur: CalibreCompteur;
  normeCommunicationCpl: NormeCommunicationCpl;
  eligibiliteDeploiementAMMMasse: EligibiliteDeploiementAmmmasse;
  niveauCommunicabiliteAMMSuivantPDS: any;
  declinaisonGeographiqueActive: DeclinaisonGeographiqueActive;
  certificatConformite: CertificatConformite;
  certificatPresente: boolean;
  hautRisqueVital: HautRisqueVital;
  dateDebutHautRisqueVital: any;
  limiteElectricite: boolean;
  raisonLimitation: any;
  lieuLimitation: any;
  puissanceLimitation: any;
  dateEtatLimitation: any;
  pasDeCourbeConsoActif: any;
  pasDeCourbeProdActif: any;
  activationCourbeConso: any;
  activationCourbeProd: any;
}

export interface Link2 {
  href: string;
  rel: string;
}

export interface Etat {
  code: string;
  libelle: string;
}

export interface Nature {
  code: string;
  libelle: string;
}

export interface Activite {
  code: string;
  libelle: string;
}

export interface ModeReleve {
  code: string;
  libelle: string;
}

export interface Concession {
  typeObjet: string;
  id: string;
  link: Link3;
}

export interface Link3 {
  href: string;
  rel: string;
}

export interface EspaceDeLivraison {
  typeObjet: string;
  id: string;
  link: Link4;
  reference: string;
  ancienneReference: string;
  libelle: any;
  libelleAbrege: any;
  etat: Etat2;
  statut: Statut2;
  typeEspace: TypeEspace;
  utilisation: Utilisation;
  edlPere: any;
  occupantEDL: any;
  adresse: Adresse;
  niveauUrbanisation: any;
  edlEnfants: any[];
  locaux: any[];
  pointsDeService: any[];
  rolesActeur: any[];
  entree: any;
  niveau: any;
  appartement: any;
  situationNiveau: any;
  complementLocalisation: any;
  commentaire: any;
  codesAcces: any[];
  decoupagesTerritoire: DecoupagesTerritoire[];
  positionGPS: string;
  actions: any[];
}

export interface Link4 {
  href: string;
  rel: string;
}

export interface Etat2 {
  code: string;
  libelle: string;
}

export interface Statut2 {
  code: string;
  libelle: string;
}

export interface TypeEspace {
  code: string;
  libelle: string;
}

export interface Utilisation {
  code: string;
  libelle: string;
}

export interface Adresse {
  typeObjet: string;
  id: string;
  link: Link5;
}

export interface Link5 {
  href: string;
  rel: string;
}

export interface DecoupagesTerritoire {
  typeObjet: string;
  id: string;
  link: Link6;
}

export interface Link6 {
  href: string;
  rel: string;
}

export interface CommunicabiliteAmm {
  code: string;
  libelle: string;
}

export interface PeriodesActiviteProfil {
  typeObjet: string;
  id: string;
  link: Link7;
}

export interface Link7 {
  href: string;
  rel: string;
}

export interface Action {
  typeObjet: string;
  id: string;
  link: Link8;
}

export interface Link8 {
  href: string;
  rel: string;
}

export interface CalibreProtection {
  value: number;
  unit: string;
}

export interface NiveauDeTension {
  code: string;
  libelle: string;
}

export interface TypeTension {
  code: string;
  libelle: string;
}

export interface TypeProtection {
  code: string;
  libelle: string;
}

export interface SousEtatElec {
  code: string;
  libelle: string;
}

export interface CalibreCompteur {
  code: string;
  libelle: string;
}

export interface NormeCommunicationCpl {
  code: string;
  libelle: string;
}

export interface EligibiliteDeploiementAmmmasse {
  code: string;
  libelle: string;
}

export interface DeclinaisonGeographiqueActive {
  typeObjet: string;
  id: string;
  link: Link9;
}

export interface Link9 {
  href: string;
  rel: string;
}

export interface CertificatConformite {
  code: string;
  libelle: string;
}

export interface HautRisqueVital {
  code: string;
  libelle: string;
}

export interface ContratsAcheminement {
  typeObjet: string;
  id: string;
  link: Link10;
}

export interface Link10 {
  href: string;
  rel: string;
}

export interface ServicesSouscritsHorsContrat {
  typeObjet: string;
  id: string;
  link: Link11;
}

export interface Link11 {
  href: string;
  rel: string;
}

export interface Nature2 {
  code: string;
  libelle: string;
}

export interface Action2 {
  typeObjet: string;
  id: string;
  link: Link12;
}

export interface Link12 {
  href: string;
  rel: string;
}

export interface GeredisApiResponse {
  typeObjet: string;
  referencePds: string;
  activite: Activite;
  periodesActivite: PeriodesActivite[];
}

export interface Activite {
  code: string;
  libelle: string;
}

export interface PeriodesActivite {
  typeObjet: string;
  dateDebut: string;
  dateFin: string | null;
  blocGRD: BlocGrd;
  blocFournisseur: BlocFournisseur;
  puissancesMaximales: PuissancesMaximales;
  courbe: any;
}

export interface BlocGrd {
  typeObjet: string;
  referenceCalendrier: string;
  libelleCalendrier: string;
  postesHorosaisonnier: PostesHorosaisonnier[];
}

export interface PostesHorosaisonnier {
  typeObjet: string;
  mnemo: string;
  libelle: string;
  valeurAffichage: number;
  etiquette: Etiquette;
  consommationsJournalieres: ConsommationsJournaliere[];
  consommationsMensuelles: ConsommationsMensuelle[];
  consommationsAnnuelles: ConsommationsAnnuelle[];
}

export interface Etiquette {
  typeObjet: string;
  id: string;
  mnemo: string;
  libelle: string;
}

export interface ConsommationsJournaliere {
  typeObjet: string;
  id: string;
  consommation?: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  date: string;
  natureReleve: NatureReleve;
  index: number;
}

export interface NatureReleve {
  code: string;
  libelle: string;
}

export interface ConsommationsMensuelle {
  typeObjet: string;
  consommation: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  annee: number;
  mois: number;
}

export interface ConsommationsAnnuelle {
  typeObjet: string;
  consommation: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  annee: number;
}

export interface BlocFournisseur {
  typeObjet: string;
  referenceCalendrier: string;
  libelleCalendrier: string;
  postesHorosaisonnier: PostesHorosaisonnier2[];
}

export interface PostesHorosaisonnier2 {
  typeObjet: string;
  mnemo: string;
  libelle: string;
  valeurAffichage: number;
  etiquette: Etiquette2;
  consommationsJournalieres: ConsommationsJournaliere2[];
  consommationsMensuelles: ConsommationsMensuelle2[];
  consommationsAnnuelles: ConsommationsAnnuelle2[];
}

export interface Etiquette2 {
  typeObjet: string;
  id: string;
  mnemo: string;
  libelle: string;
}

export interface ConsommationsJournaliere2 {
  typeObjet: string;
  id: string;
  consommation?: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  date: string;
  natureReleve: NatureReleve2;
  index: number;
}

export interface NatureReleve2 {
  code: string;
  libelle: string;
}

export interface ConsommationsMensuelle2 {
  typeObjet: string;
  consommation: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  annee: number;
  mois: number;
}

export interface ConsommationsAnnuelle2 {
  typeObjet: string;
  consommation: number;
  uniteConsommation: string;
  volumeConsommation: number;
  uniteVolumeConsommation: any;
  coefficientConversion: number;
  annee: number;
}

export interface PuissancesMaximales {
  typeObjet: string;
  id: any;
  puissancesJournalieres: PuissancesJournaliere[];
  puissancesMensuelles: PuissancesMensuelle[];
  puissancesAnnuelles: PuissancesAnnuelle[];
}

export interface PuissancesJournaliere {
  typeObjet: string;
  puissanceMaximale: number;
  unitePuissance: string;
  dateMesure: string;
  heureMesure: string;
  date: string;
  heure: string;
}

export interface PuissancesMensuelle {
  typeObjet: string;
  puissanceMaximale: number;
  unitePuissance: string;
  dateMesure: string;
  heureMesure: string;
  annee: number;
  mois: number;
}

export interface PuissancesAnnuelle {
  typeObjet: string;
  puissanceMaximale: number;
  unitePuissance: string;
  dateMesure: string;
  heureMesure: string;
  annee: number;
}
