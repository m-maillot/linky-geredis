export type PointDaccessResponse = PointDaccess[];

export interface PointDaccess {
  id: string;
  pointDeService: PointDeService;
}

export interface PointDeService {
  id: string;
  reference: string;
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
  blocFournisseur: BlocFournisseur | null;
  puissancesMaximales: PuissancesMaximales | null;
}

export interface BlocFournisseur {
  typeObjet: string;
  postesHorosaisonnier: PostesHorosaisonnier[];
}

export interface PostesHorosaisonnier {
  typeObjet: string;
  mnemo: string;
  libelle: string;
  valeurAffichage: number;
  etiquette: Etiquette;
  consommationsJournalieres: ConsommationsJournaliere[];
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
  consommation?: number | null;
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

export interface PuissancesMaximales {
  typeObjet: string;
  id: any;
  puissancesJournalieres: PuissancesJournaliere[];
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
