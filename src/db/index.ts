import Dexie, { type EntityTable } from 'dexie';

export interface Decision {
    id?: number;
    created_at: Date;
    options: string[];
    released: string[];
    kept: string[];
    chosen: string;
    reflection?: string;
    mode: 'standard' | 'blitz';
    duration_seconds: number;
}

const db = new Dexie('LiminalDB') as Dexie & {
    decisions: EntityTable<Decision, 'id'>;
};

db.version(1).stores({
    decisions: '++id, created_at, mode'
});

export { db };
