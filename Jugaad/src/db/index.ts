import Dexie, { Table } from 'dexie';

export interface Thought {
    id?: number;
    content: string;
    createdAt: number;
    lastActiveAt: number;
    emotion?: string;
    solidified: number; // 0 for false, 1 for true (IndexedDB doesn't index booleans)
}

export class UdyanaDB extends Dexie {
    thoughts!: Table<Thought>;

    constructor() {
        super('udyanaDB');

        // Version 1-2 legacy stores
        this.version(1).stores({
            thoughts: '++id, createdAt, lastActiveAt, emotion'
        });

        this.version(2).stores({
            thoughts: '++id, createdAt, lastActiveAt, emotion, solidified'
        });

        // Version 3: Standardize solidified as number for indexing
        this.version(3).stores({
            thoughts: '++id, createdAt, lastActiveAt, emotion, solidified'
        }).upgrade(async tx => {
            // Migration: Convert all boolean solidified or undefined to numbers
            return tx.table('thoughts').toCollection().modify(thought => {
                if (thought.solidified === undefined) {
                    thought.solidified = 0;
                } else if (typeof thought.solidified === 'boolean') {
                    thought.solidified = thought.solidified ? 1 : 0;
                }
            });
        });
    }
}

export const db = new UdyanaDB();
