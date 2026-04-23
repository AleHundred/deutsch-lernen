import Dexie, { type EntityTable } from 'dexie';
import type {
  Noun,
  Verb,
  Preposition,
  DrillItem,
  SRSState,
  DrillSession,
  AppState,
} from './schema';

export class ProjektDeutschDB extends Dexie {
  nouns!: EntityTable<Noun, 'id'>;
  verbs!: EntityTable<Verb, 'id'>;
  prepositions!: EntityTable<Preposition, 'id'>;
  drillItems!: EntityTable<DrillItem, 'id'>;
  srsState!: EntityTable<SRSState, 'itemId'>;
  sessions!: EntityTable<DrillSession, 'id'>;
  appState!: EntityTable<AppState, 'id'>;

  constructor() {
    super('ProjektDeutschDB');
    this.version(1).stores({
      nouns: "id, gender, *tags",
      verbs: "id, irregularity, auxiliary, *tags",
      prepositions: "id, governs",
      drillItems: "id, kind, rule, grammarTopic, difficulty, *tags",
      srsState: "itemId, nextReview, rule",
      sessions: "id, startedAt, kind",
      appState: "id",  // single row with id="singleton"
    });
  }
}

export const db = new ProjektDeutschDB();
