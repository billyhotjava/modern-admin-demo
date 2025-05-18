import apiClient from "../apiClient";

export interface AirbyteConnection {
	connectionId: string;
	name: string;
	sourceId: string;
	sourceName: string;
	destinationId: string;
	destinationName: string;
	status: ConnectionStatus;
	schedule: {
		timeUnit: string;
		units: number;
	};
	latestSyncJobStatus?: SyncJobStatus;
	latestSyncStartedAt?: string;
	latestSyncCompletedAt?: string;
}

export interface AirbyteSource {
	sourceId: string;
	name: string;
	sourceType: string;
	connectionConfiguration: Record<string, any>;
}

export interface AirbyteDestination {
	destinationId: string;
	name: string;
	destinationType: string;
	connectionConfiguration: Record<string, any>;
}

export interface SyncJob {
	jobId: string;
	connectionId: string;
	status: SyncJobStatus;
	startedAt: string;
	completedAt?: string;
	bytesSynced?: number;
	recordsSynced?: number;
	logs?: string[];
	errors?: string[];
}

export type ConnectionStatus = "active" | "inactive" | "deprecated";
export type SyncJobStatus = "pending" | "running" | "succeeded" | "failed" | "cancelled";

export const airbyteService = {
	/**
	 * Get all connections
	 */
	async getConnections(): Promise<AirbyteConnection[]> {
		const response = await apiClient.get({ url: "/airbyte/connections" });
		return response.data;
	},

	/**
	 * Get a specific connection by ID
	 */
	async getConnection(connectionId: string): Promise<AirbyteConnection> {
		const response = await apiClient.get({ url: `/airbyte/connections/${connectionId}` });
		return response.data;
	},

	/**
	 * Get all sync jobs for a connection
	 */
	async getConnectionJobs(connectionId: string): Promise<SyncJob[]> {
		const response = await apiClient.get({ url: `/airbyte/connections/${connectionId}/jobs` });
		return response.data;
	},

	/**
	 * Get a specific sync job by ID
	 */
	async getSyncJob(jobId: string): Promise<SyncJob> {
		const response = await apiClient.get({ url: `/airbyte/jobs/${jobId}` });
		return response.data;
	},

	/**
	 * Trigger a manual sync for a connection
	 */
	async triggerSync(connectionId: string): Promise<SyncJob> {
		const response = await apiClient.post({ url: `/airbyte/connections/${connectionId}/sync` });
		return response.data;
	},

	/**
	 * Cancel a running sync job
	 */
	async cancelSync(jobId: string): Promise<void> {
		await apiClient.post({ url: `/airbyte/jobs/${jobId}/cancel` });
	},

	/**
	 * Get all sources
	 */
	async getSources(): Promise<AirbyteSource[]> {
		const response = await apiClient.get({ url: "/airbyte/sources" });
		return response.data;
	},

	/**
	 * Get all destinations
	 */
	async getDestinations(): Promise<AirbyteDestination[]> {
		const response = await apiClient.get({ url: "/airbyte/destinations" });
		return response.data;
	},
};
