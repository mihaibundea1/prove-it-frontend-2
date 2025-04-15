// services/api/endpoints/sync/SyncService.ts
import { BaseApiService } from '../../core/BaseApiService';
import { ApiResponse } from '../../core/types/api.types';
import { SYNC_ENDPOINTS } from './constants/sync.endpoints';

export class SyncService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(SYNC_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
  }

  async syncData(key: string, data: any): Promise<ApiResponse<any>> {
    return this.post<any>(SYNC_ENDPOINTS.ALL, {
      key,
      data,
      timestamp: Date.now(),
    });
  }
}