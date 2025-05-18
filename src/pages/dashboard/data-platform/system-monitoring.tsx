import { type AirbyteConnection, type SyncJob, airbyteService } from "@/api/services/airbyte";
import { Card } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Text, Title } from "@/ui/typography";
import { useEffect, useState } from "react";

export default function SystemMonitoring() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<Title as="h4">System Monitoring</Title>
				<div className="flex gap-2">
					<button type="button" className="px-3 py-2 border rounded-md hover:bg-accent transition-colors">
						Configure Alerts
					</button>
					<button type="button" className="px-3 py-2 border rounded-md hover:bg-accent transition-colors">
						View Reports
					</button>
				</div>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="compute">Compute Resources</TabsTrigger>
					<TabsTrigger value="storage">Storage</TabsTrigger>
					<TabsTrigger value="costs">Cost Management</TabsTrigger>
					<TabsTrigger value="alerts">Alerts</TabsTrigger>
					<TabsTrigger value="airbyte">Airbyte</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<SystemOverview />
				</TabsContent>

				<TabsContent value="compute">
					<ComputeResources />
				</TabsContent>

				<TabsContent value="storage">
					<StorageMonitoring />
				</TabsContent>

				<TabsContent value="costs">
					<CostManagement />
				</TabsContent>

				<TabsContent value="alerts">
					<AlertsMonitoring />
				</TabsContent>

				<TabsContent value="airbyte">
					<AirbyteMonitoring />
				</TabsContent>
			</Tabs>
		</div>
	);
}

// System Overview Component
function SystemOverview() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card className="p-4">
				<Title as="h5" className="mb-4">
					System Health
				</Title>
				<div className="grid grid-cols-2 gap-4">
					<MetricCard title="Overall Health" value="Good" status="success" icon="✓" />
					<MetricCard title="Active Alerts" value="2" status="warning" icon="⚠️" />
				</div>
			</Card>

			<Card className="p-4">
				<Title as="h5" className="mb-4">
					Resource Utilization
				</Title>
				<div className="flex flex-col gap-4">
					<ResourceUtilization name="CPU" value={42} status="normal" />
					<ResourceUtilization name="Memory" value={68} status="warning" />
				</div>
			</Card>
		</div>
	);
}

// Compute Resources Component
function ComputeResources() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard title="Active Clusters" value="4" status="success" icon="🖥️" />
				<MetricCard title="Total Cores" value="128" status="success" icon="⚙️" />
			</div>
		</div>
	);
}

// Storage Monitoring Component
function StorageMonitoring() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard title="Total Storage" value="24.5 TB" status="success" icon="💾" />
				<MetricCard title="Used Storage" value="18.3 TB" status="warning" icon="📊" />
			</div>
		</div>
	);
}

// Cost Management Component
function CostManagement() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard title="Current Month" value="$12,450" status="warning" icon="💰" />
				<MetricCard title="Previous Month" value="$10,280" status="success" icon="📅" />
			</div>
		</div>
	);
}

// Alerts Monitoring Component
function AlertsMonitoring() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard title="Critical Alerts" value="0" status="success" icon="🔴" />
				<MetricCard title="Warning Alerts" value="2" status="warning" icon="🟠" />
			</div>
		</div>
	);
}

// Helper Components
function MetricCard({ title, value, status, icon }: { title: string; value: string; status: string; icon: string }) {
	let statusColor = "";

	switch (status) {
		case "success":
			statusColor = "text-green-500";
			break;
		case "warning":
			statusColor = "text-yellow-500";
			break;
		case "error":
			statusColor = "text-red-500";
			break;
		default:
			statusColor = "text-gray-500";
	}

	return (
		<Card className="p-4">
			<div className="flex justify-between items-start">
				<div>
					<Text variant="caption" className="text-muted-foreground">
						{title}
					</Text>
					<Title as="h3" className={`text-2xl font-bold mt-1 ${statusColor}`}>
						{value}
					</Title>
				</div>
				<span className="text-2xl">{icon}</span>
			</div>
		</Card>
	);
}

function ResourceUtilization({ name, value, status }: { name: string; value: number; status: string }) {
	let statusColor = "";

	switch (status) {
		case "normal":
			statusColor = "text-green-500";
			break;
		case "warning":
			statusColor = "text-yellow-500";
			break;
		case "critical":
			statusColor = "text-red-500";
			break;
		default:
			statusColor = "text-gray-500";
	}

	return (
		<div>
			<div className="flex justify-between mb-1">
				<Text variant="caption">{name}</Text>
				<Text variant="caption" className={statusColor}>
					{value}%
				</Text>
			</div>
			<Progress value={value} className="h-2" />
		</div>
	);
}

// Airbyte Monitoring Component
function AirbyteMonitoring() {
	const [connections, setConnections] = useState<AirbyteConnection[]>([]);
	const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
	const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchConnections() {
			try {
				setLoading(true);
				const data = await airbyteService.getConnections();
				setConnections(data);
				if (data.length > 0) {
					setSelectedConnection(data[0].connectionId);
				}
				setLoading(false);
			} catch (err) {
				setError("获取连接失败");
				setLoading(false);
				console.error("Error fetching connections:", err);
			}
		}

		fetchConnections();
	}, []);

	useEffect(() => {
		async function fetchSyncJobs() {
			if (!selectedConnection) return;

			try {
				setLoading(true);
				const data = await airbyteService.getConnectionJobs(selectedConnection);
				setSyncJobs(data);
				setLoading(false);
			} catch (err) {
				setError("获取同步任务失败");
				setLoading(false);
				console.error("Error fetching sync jobs:", err);
			}
		}

		fetchSyncJobs();
	}, [selectedConnection]);

	const handleTriggerSync = async (connectionId: string) => {
		try {
			await airbyteService.triggerSync(connectionId);
			// Refresh the sync jobs list
			const data = await airbyteService.getConnectionJobs(connectionId);
			setSyncJobs(data);
		} catch (err) {
			setError("触发同步失败");
			console.error("Error triggering sync:", err);
		}
	};

	if (loading && connections.length === 0) {
		return (
			<div className="flex justify-center items-center h-64">
				<Text>加载中...</Text>
			</div>
		);
	}

	if (error && connections.length === 0) {
		return (
			<div className="flex justify-center items-center h-64">
				<Text className="text-red-500">{error}</Text>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard
					title="活跃连接"
					value={connections.filter((c) => c.status === "active").length.toString()}
					status="success"
					icon="🔄"
				/>
				<MetricCard title="总连接数" value={connections.length.toString()} status="success" icon="🔌" />
				<MetricCard
					title="最近同步任务"
					value={syncJobs.length > 0 ? syncJobs[0].status : "无"}
					status={syncJobs.length > 0 ? (syncJobs[0].status === "succeeded" ? "success" : "warning") : "normal"}
					icon="📊"
				/>
			</div>

			<Card className="p-4">
				<Title as="h5" className="mb-4">
					数据连接
				</Title>
				<div className="space-y-4">
					{connections.map((connection) => (
						<div
							key={connection.connectionId}
							className={`p-4 border rounded-md cursor-pointer ${
								selectedConnection === connection.connectionId ? "border-primary bg-primary/5" : ""
							}`}
							onClick={() => setSelectedConnection(connection.connectionId)}
						>
							<div className="flex justify-between items-center">
								<div>
									<Text className="font-medium">{connection.name}</Text>
									<Text variant="caption" className="text-muted-foreground">
										{connection.sourceName} → {connection.destinationName}
									</Text>
								</div>
								<div className="flex items-center gap-3">
									<StatusBadge status={connection.status} />
									<button
										type="button"
										className="px-2 py-1 text-xs border rounded-md hover:bg-accent"
										onClick={(e) => {
											e.stopPropagation();
											handleTriggerSync(connection.connectionId);
										}}
									>
										触发同步
									</button>
								</div>
							</div>
							{connection.latestSyncJobStatus && (
								<div className="mt-2 flex items-center gap-2">
									<Text variant="caption" className="text-muted-foreground">
										最近同步:
									</Text>
									<StatusBadge status={connection.latestSyncJobStatus} />
									{connection.latestSyncStartedAt && (
										<Text variant="caption" className="text-muted-foreground">
											{new Date(connection.latestSyncStartedAt).toLocaleString()}
										</Text>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</Card>

			{selectedConnection && (
				<Card className="p-4">
					<div className="flex justify-between items-center mb-4">
						<Title as="h5">同步任务历史</Title>
						<button
							type="button"
							className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
							onClick={() => {
								if (selectedConnection) {
									handleTriggerSync(selectedConnection);
								}
							}}
						>
							触发新同步
						</button>
					</div>
					{loading ? (
						<div className="flex justify-center items-center h-32">
							<Text>加载中...</Text>
						</div>
					) : syncJobs.length > 0 ? (
						<div className="space-y-3">
							{syncJobs.map((job) => (
								<div key={job.jobId} className="p-3 border rounded-md">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<StatusBadge status={job.status} />
											<Text className="font-medium">任务 ID: {job.jobId.substring(0, 8)}</Text>
										</div>
										<Text variant="caption" className="text-muted-foreground">
											{new Date(job.startedAt).toLocaleString()}
										</Text>
									</div>
									<div className="mt-2 grid grid-cols-2 gap-4">
										<div>
											<Text variant="caption" className="text-muted-foreground">
												开始时间
											</Text>
											<Text>{new Date(job.startedAt).toLocaleString()}</Text>
										</div>
										<div>
											<Text variant="caption" className="text-muted-foreground">
												完成时间
											</Text>
											<Text>{job.completedAt ? new Date(job.completedAt).toLocaleString() : "进行中..."}</Text>
										</div>
										{job.bytesSynced !== undefined && (
											<div>
												<Text variant="caption" className="text-muted-foreground">
													同步数据量
												</Text>
												<Text>{formatBytes(job.bytesSynced)}</Text>
											</div>
										)}
										{job.recordsSynced !== undefined && (
											<div>
												<Text variant="caption" className="text-muted-foreground">
													同步记录数
												</Text>
												<Text>{job.recordsSynced.toLocaleString()}</Text>
											</div>
										)}
									</div>
									{job.errors && job.errors.length > 0 && (
										<div className="mt-2">
											<Text variant="caption" className="text-red-500">
												错误:
											</Text>
											<div className="mt-1 p-2 bg-red-50 rounded text-sm">
												{job.errors.map((error, i) => (
													<div key={`error-${i}-${error.substring(0, 10)}`}>{error}</div>
												))}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex justify-center items-center h-32">
							<Text>暂无同步任务记录</Text>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function StatusBadge({ status }: { status: string }) {
	let bgColor = "";
	let textColor = "";

	switch (status) {
		case "running":
		case "active":
		case "success":
			bgColor = "bg-green-100";
			textColor = "text-green-800";
			break;
		case "warning":
		case "pending":
			bgColor = "bg-yellow-100";
			textColor = "text-yellow-800";
			break;
		case "error":
		case "failed":
			bgColor = "bg-red-100";
			textColor = "text-red-800";
			break;
		default:
			bgColor = "bg-gray-100";
			textColor = "text-gray-800";
	}

	return (
		<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
}
