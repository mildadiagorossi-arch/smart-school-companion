/**
 * SchoolGenius - Sync Engine
 * Gestion de la synchronisation offline/online
 */

import { db, SyncAction, generateLocalId, getCurrentTimestamp } from './db';

// ============================================
// TYPES
// ============================================

type EntityType = 'student' | 'teacher' | 'class' | 'attendance' | 'grade' | 'message';
type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

interface SyncResult {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
}

// ============================================
// SYNC ENGINE CLASS
// ============================================

class SyncEngine {
    private isSyncing = false;
    private apiBaseUrl = '/api'; // À configurer selon le backend
    private maxRetries = 3;

    // ==========================================
    // QUEUE MANAGEMENT - File d'actions locales
    // ==========================================

    /**
     * Ajoute une action à la file de synchronisation
     */
    async queueAction(
        type: ActionType,
        entity: EntityType,
        entityId: string,
        payload: Record<string, unknown>
    ): Promise<void> {
        const action: SyncAction = {
            actionId: generateLocalId(),
            type,
            entity,
            entityId,
            payload: JSON.stringify(payload),
            status: 'pending',
            retryCount: 0,
            createdAt: getCurrentTimestamp(),
        };

        await db.syncActions.add(action);
        console.log(`[SyncEngine] Action queued: ${type} ${entity} ${entityId}`);

        // Tenter une sync immédiate si online
        if (navigator.onLine) {
            this.syncNow();
        }
    }

    /**
     * Récupère les actions en attente
     */
    async getPendingActions(): Promise<SyncAction[]> {
        return db.syncActions
            .where('status')
            .anyOf(['pending', 'error'])
            .and((action) => action.retryCount < this.maxRetries)
            .toArray();
    }

    /**
     * Compte les actions en attente
     */
    async getPendingCount(): Promise<number> {
        return db.syncActions.where('status').equals('pending').count();
    }

    // ==========================================
    // SYNCHRONIZATION
    // ==========================================

    /**
     * Lance la synchronisation
     */
    async syncNow(): Promise<SyncResult> {
        if (this.isSyncing) {
            console.log('[SyncEngine] Sync already in progress');
            return { success: false, syncedCount: 0, failedCount: 0, errors: ['Sync in progress'] };
        }

        if (!navigator.onLine) {
            console.log('[SyncEngine] Offline - sync skipped');
            return { success: false, syncedCount: 0, failedCount: 0, errors: ['Offline'] };
        }

        this.isSyncing = true;
        const result: SyncResult = { success: true, syncedCount: 0, failedCount: 0, errors: [] };

        try {
            const pendingActions = await this.getPendingActions();
            console.log(`[SyncEngine] Starting sync with ${pendingActions.length} pending actions`);

            for (const action of pendingActions) {
                try {
                    await this.processSyncAction(action);
                    result.syncedCount++;
                } catch (error) {
                    result.failedCount++;
                    result.errors.push(`${action.entity}/${action.entityId}: ${error}`);
                }
            }

            // Télécharger les nouvelles données du serveur
            await this.pullFromServer();

            console.log(`[SyncEngine] Sync complete: ${result.syncedCount} synced, ${result.failedCount} failed`);
        } catch (error) {
            result.success = false;
            result.errors.push(`Sync error: ${error}`);
            console.error('[SyncEngine] Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }

        return result;
    }

    /**
     * Traite une action de synchronisation
     */
    private async processSyncAction(action: SyncAction): Promise<void> {
        // Marquer comme en cours
        await db.syncActions.update(action.id!, { status: 'syncing' });

        try {
            const payload = JSON.parse(action.payload);
            const endpoint = this.getEndpoint(action.entity);

            let response: Response;

            switch (action.type) {
                case 'CREATE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'UPDATE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}/${action.entityId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'DELETE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}/${action.entityId}`, {
                        method: 'DELETE',
                    });
                    break;

                default:
                    throw new Error(`Unknown action type: ${action.type}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Marquer comme synchronisé
            await db.syncActions.update(action.id!, {
                status: 'synced',
                syncedAt: getCurrentTimestamp(),
            });

            // Mettre à jour le syncStatus de l'entité
            await this.updateEntitySyncStatus(action.entity, action.entityId, 'synced');

        } catch (error) {
            // Incrémenter le compteur de tentatives
            await db.syncActions.update(action.id!, {
                status: 'error',
                retryCount: action.retryCount + 1,
                errorMessage: String(error),
            });

            throw error;
        }
    }

    /**
     * Télécharge les données du serveur
     */
    private async pullFromServer(): Promise<void> {
        // TODO: Implémenter le pull des données serveur
        // Cela dépend de l'API backend
        console.log('[SyncEngine] Pull from server - Not yet implemented');
    }

    // ==========================================
    // HELPERS
    // ==========================================

    private getEndpoint(entity: EntityType): string {
        const endpoints: Record<EntityType, string> = {
            student: '/students',
            teacher: '/teachers',
            class: '/classes',
            attendance: '/attendance',
            grade: '/grades',
            message: '/messages',
        };
        return endpoints[entity];
    }

    private async updateEntitySyncStatus(
        entity: EntityType,
        localId: string,
        status: 'pending' | 'synced' | 'error'
    ): Promise<void> {
        const tableMap = {
            student: db.students,
            teacher: db.teachers,
            class: db.classes,
            attendance: db.attendance,
            grade: db.grades,
            message: db.messages,
        };

        const table = tableMap[entity];
        if (table) {
            const record = await table.where('localId').equals(localId).first();
            if (record) {
                await table.update(record.id!, { syncStatus: status });
            }
        }
    }

    // ==========================================
    // CONFLICT RESOLUTION
    // ==========================================

    /**
     * Résolution de conflits "Last Write Wins" pour présence et notes
     */
    async resolveConflict(
        entity: EntityType,
        localData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): Promise<Record<string, unknown>> {
        // Pour présence et notes: Last Write Wins
        if (entity === 'attendance' || entity === 'grade') {
            const localUpdated = new Date(localData.updatedAt as string).getTime();
            const serverUpdated = new Date(serverData.updatedAt as string).getTime();

            return localUpdated > serverUpdated ? localData : serverData;
        }

        // Pour les autres entités: priorité serveur (validation admin requise)
        return serverData;
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    /**
     * Initialise les listeners réseau
     */
    initNetworkListeners(): void {
        window.addEventListener('online', () => {
            console.log('[SyncEngine] Back online - starting sync');
            this.syncNow();
        });

        window.addEventListener('offline', () => {
            console.log('[SyncEngine] Gone offline - actions will be queued');
        });
    }
}

// Instance singleton
export const syncEngine = new SyncEngine();

// Initialiser les listeners au chargement
if (typeof window !== 'undefined') {
    syncEngine.initNetworkListeners();
}
