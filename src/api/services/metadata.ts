import apiClient from "../apiClient";

// 获取数据库列表
export async function getDatabases() {
	return apiClient.get({ url: "/api/v1/databases" });
}

// 获取表列表（可按数据库、类型、标签筛选，后续扩展参数）
export async function getTables(params?: Record<string, any>) {
	return apiClient.get({ url: "/api/v1/tables", params });
}

// 获取表详情
export async function getTableDetail(tableId: string) {
	return apiClient.get({ url: `/api/v1/tables/${tableId}` });
}

// 获取标签列表
export async function getTags() {
	return apiClient.get({ url: "/api/v1/tags" });
}
