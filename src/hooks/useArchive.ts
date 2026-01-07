import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Decision } from '../db';

export function useArchive() {
    const decisions = useLiveQuery(
        () => db.decisions.orderBy('created_at').reverse().toArray(),
        []
    );

    const addDecision = async (decision: Omit<Decision, 'id'>) => {
        return await db.decisions.add(decision);
    };

    const deleteDecision = async (id: number) => {
        return await db.decisions.delete(id);
    };

    const clearAll = async () => {
        return await db.decisions.clear();
    };

    return {
        decisions: decisions ?? [],
        isLoading: decisions === undefined,
        addDecision,
        deleteDecision,
        clearAll,
    };
}
