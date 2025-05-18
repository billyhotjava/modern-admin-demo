import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Text, Title } from "@/ui/typography";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { type AirbyteConnection, type SyncJobStatus, airbyteService } from "@/api/services/airbyte";

// Define types that are missing from airbyte.ts but needed for this component
interface SyncHistory {
	jobId: string;
	status: SyncJobStatus;
	startTime: number;
	endTime?: number;
	recordsEmitted?: number;
}

interface JobLog {
	jobId: string;
	logLines: string[];
}

// Status badge component
const StatusBadge = ({ status }: { status: SyncJobStatus | undefined }) => {
	if (!status) return null;

	const statusConfig: Record<string, { color: string; label: string }> = {
		succeeded: { color: "bg-green-100 text-green-800", label: "成功" },
		failed: { color: "bg-red-100 text-red-800", label: "失败" },
		running: { color: "bg-blue-100 text-blue-800", label: "运行中" },
		pending: { color: "bg-yellow-100 text-yellow-800", label: "等待中" },
		cancelled: { color: "bg-gray-100 text-gray-800", label: "已取消" },
	};

	const config = statusConfig[status];
	return (
		<Badge variant="outline" className={`${config.color} border-0`}>
			{config.label}
		</Badge>
	);
};

// Format timestamp to readable date
const formatTimestamp = (timestamp: number | undefined) => {
	if (!timestamp) return "-";
	return format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss");
};

// Connection list component
const ConnectionList = ({
	connections,
	onSelectConnection,
}: {
	connections: AirbyteConnection[];
	onSelectConnection: (id: string) => void;
}) => {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>名称</TableHead>
						<TableHead>来源</TableHead>
						<TableHead>目标</TableHead>
						<TableHead>状态</TableHead>
						<TableHead>最近同步</TableHead>
						<TableHead>操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{connections.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								暂无数据
							</TableCell>
						</TableRow>
					) : (
						connections.map((connection) => (
							<TableRow key={connection.connectionId}>
								<TableCell className="font-medium">{connection.name}</TableCell>
								<TableCell>{connection.sourceName}</TableCell>
								<TableCell>{connection.destinationName}</TableCell>
								<TableCell>
									<StatusBadge status={connection.latestSyncJobStatus} />
								</TableCell>
								<TableCell>
									{connection.latestSyncStartedAt
										? format(new Date(connection.latestSyncStartedAt), "yyyy-MM-dd HH:mm:ss")
										: "-"}
								</TableCell>
								<TableCell>
									<Button variant="outline" size="sm" onClick={() => onSelectConnection(connection.connectionId)}>
										查看详情
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

// Sync history component
const SyncHistoryTable = ({
	history,
	onViewLogs,
	onRetry,
	onCancel,
}: {
	history: SyncHistory[];
	onViewLogs: (jobId: string) => void;
	onRetry: (jobId: string) => void;
	onCancel: (jobId: string) => void;
}) => {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>任务ID</TableHead>
						<TableHead>状态</TableHead>
						<TableHead>开始时间</TableHead>
						<TableHead>结束时间</TableHead>
						<TableHead>记录数</TableHead>
						<TableHead>操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{history.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								暂无同步历史
							</TableCell>
						</TableRow>
					) : (
						history.map((job) => (
							<TableRow key={job.jobId}>
								<TableCell className="font-medium">{job.jobId}</TableCell>
								<TableCell>
									<StatusBadge status={job.status} />
								</TableCell>
								<TableCell>{formatTimestamp(job.startTime)}</TableCell>
								<TableCell>{formatTimestamp(job.endTime)}</TableCell>
								<TableCell>{job.recordsEmitted || "-"}</TableCell>
								<TableCell className="space-x-2">
									<Button variant="outline" size="sm" onClick={() => onViewLogs(job.jobId)}>
										查看日志
									</Button>
									{job.status === "failed" && (
										<Button variant="outline" size="sm" onClick={() => onRetry(job.jobId)}>
											重试
										</Button>
									)}
									{job.status === "running" && (
										<Button variant="outline" size="sm" onClick={() => onCancel(job.jobId)}>
											停止
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

// Job logs component
const JobLogs = ({ logs }: { logs: JobLog | null }) => {
	if (!logs) {
		return (
			<div className="p-4 text-center">
				<Text>选择一个任务查看日志</Text>
			</div>
		);
	}

	return (
		<ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/30">
			<div className="space-y-1 font-mono text-sm">
				{logs.logLines.map((line: string, index: number) => {
					// Create a more unique key by combining the job ID with the index and a hash of the line content
					const lineHash = line.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
					return (
						<div key={`${logs.jobId}-${index}-${lineHash}`} className="whitespace-pre-wrap break-all">
							{line}
						</div>
					);
				})}
			</div>
		</ScrollArea>
	);
};

// Connection details component
const ConnectionDetails = ({ connectionId }: { connectionId: string }) => {
	const [connection, setConnection] = useState<AirbyteConnection | null>(null);
	const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
	const [selectedJobLogs, setSelectedJobLogs] = useState<JobLog | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchConnectionDetails = async () => {
			setIsLoading(true);
			try {
				const connectionData = await airbyteService.getConnection(connectionId);
				// Convert SyncJob[] to SyncHistory[]
				const jobs = await airbyteService.getConnectionJobs(connectionId);
				const historyData: SyncHistory[] = jobs.map((job) => ({
					jobId: job.jobId,
					status: job.status,
					startTime: new Date(job.startedAt).getTime(),
					endTime: job.completedAt ? new Date(job.completedAt).getTime() : undefined,
					recordsEmitted: job.recordsSynced,
				}));

				setConnection(connectionData);
				setSyncHistory(historyData);
			} catch (error) {
				console.error("Error fetching connection details:", error);
				toast.error("获取连接详情失败");
			} finally {
				setIsLoading(false);
			}
		};

		fetchConnectionDetails();
	}, [connectionId]);

	const handleViewLogs = async (jobId: string) => {
		try {
			// Since getJobLogs doesn't exist, we'll use getSyncJob and extract logs
			const job = await airbyteService.getSyncJob(jobId);
			const logs: JobLog = {
				jobId: job.jobId,
				logLines: job.logs || ["No logs available for this job"],
			};
			setSelectedJobLogs(logs);
		} catch (error) {
			console.error("Error fetching job logs:", error);
			toast.error("获取日志失败");
		}
	};

	const handleRetry = async (_jobId: string) => {
		try {
			await airbyteService.triggerSync(connectionId);
			toast.success("已触发同步任务");

			// Refresh history after a short delay
			setTimeout(async () => {
				// Convert SyncJob[] to SyncHistory[]
				const jobs = await airbyteService.getConnectionJobs(connectionId);
				const historyData: SyncHistory[] = jobs.map((job) => ({
					jobId: job.jobId,
					status: job.status,
					startTime: new Date(job.startedAt).getTime(),
					endTime: job.completedAt ? new Date(job.completedAt).getTime() : undefined,
					recordsEmitted: job.recordsSynced,
				}));
				setSyncHistory(historyData);
			}, 1000);
		} catch (error) {
			console.error("Error retrying sync:", error);
			toast.error("重试同步失败");
		}
	};

	const handleCancel = async (jobId: string) => {
		try {
			await airbyteService.cancelSync(jobId);
			toast.success("已停止同步任务");

			// Refresh history after a short delay
			setTimeout(async () => {
				// Convert SyncJob[] to SyncHistory[]
				const jobs = await airbyteService.getConnectionJobs(connectionId);
				const historyData: SyncHistory[] = jobs.map((job) => ({
					jobId: job.jobId,
					status: job.status,
					startTime: new Date(job.startedAt).getTime(),
					endTime: job.completedAt ? new Date(job.completedAt).getTime() : undefined,
					recordsEmitted: job.recordsSynced,
				}));
				setSyncHistory(historyData);
			}, 1000);
		} catch (error) {
			console.error("Error cancelling sync:", error);
			toast.error("停止同步失败");
		}
	};

	const handleBackToList = () => {
		navigate("/dashboard/data-platform/data-ingestion");
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Text>加载中...</Text>
			</div>
		);
	}

	if (!connection) {
		return (
			<div className="flex flex-col gap-4 items-center justify-center h-64">
				<Text>未找到连接信息</Text>
				<Button onClick={handleBackToList}>返回列表</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={handleBackToList}>
						返回
					</Button>
					<Title as="h5">{connection.name}</Title>
					<StatusBadge status={connection.latestSyncJobStatus} />
				</div>
				<Button onClick={() => handleRetry("")} disabled={connection.latestSyncJobStatus === "running"}>
					触发同步
				</Button>
			</div>

			<Card className="p-4">
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div>
						<Text className="text-muted-foreground">来源</Text>
						<Text className="font-medium">{connection.sourceName}</Text>
					</div>
					<div>
						<Text className="text-muted-foreground">目标</Text>
						<Text className="font-medium">{connection.destinationName}</Text>
					</div>
					<div>
						<Text className="text-muted-foreground">状态</Text>
						<div className="flex items-center gap-2">
							<StatusBadge status={connection.latestSyncJobStatus} />
							{connection.latestSyncJobStatus === "running" && <Text className="text-blue-600">同步中</Text>}
						</div>
					</div>
					<div>
						<Text className="text-muted-foreground">最近同步</Text>
						<Text className="font-medium">
							{connection.latestSyncStartedAt
								? format(new Date(connection.latestSyncStartedAt), "yyyy-MM-dd HH:mm:ss")
								: "-"}
						</Text>
					</div>
				</div>

				<Separator className="my-4" />

				<Tabs defaultValue="history">
					<TabsList>
						<TabsTrigger value="history">同步历史</TabsTrigger>
						<TabsTrigger value="logs">日志</TabsTrigger>
					</TabsList>
					<TabsContent value="history" className="mt-4">
						<SyncHistoryTable
							history={syncHistory}
							onViewLogs={handleViewLogs}
							onRetry={handleRetry}
							onCancel={handleCancel}
						/>
					</TabsContent>
					<TabsContent value="logs" className="mt-4">
						<JobLogs logs={selectedJobLogs} />
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
};

// Main component
function DataIngestion() {
	const [connections, setConnections] = useState<AirbyteConnection[]>([]);
	const [filteredConnections, setFilteredConnections] = useState<AirbyteConnection[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const { connectionId } = useParams<{ connectionId: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchConnections = async () => {
			setIsLoading(true);
			try {
				const data = await airbyteService.getConnections();
				setConnections(data);
				setFilteredConnections(data);
			} catch (error) {
				console.error("Error fetching connections:", error);
				toast.error("获取连接列表失败");
			} finally {
				setIsLoading(false);
			}
		};

		fetchConnections();
	}, []);

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter);

		if (filter === "all") {
			setFilteredConnections(connections);
			return;
		}

		const statusMap: Record<string, SyncJobStatus> = {
			succeeded: "succeeded",
			failed: "failed",
			running: "running",
		};

		const filtered = connections.filter((conn) => conn.latestSyncJobStatus === statusMap[filter]);

		setFilteredConnections(filtered);
	};

	const handleSelectConnection = (id: string) => {
		navigate(`/dashboard/data-platform/data-ingestion/${id}`);
	};

	// If we have a connectionId, show the connection details
	if (connectionId) {
		return <ConnectionDetails connectionId={connectionId} />;
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<Title as="h4">数据接入</Title>
			</div>

			<Card className="p-4">
				<div className="flex justify-between items-center mb-4">
					<Title as="h5">Airbyte 同步任务</Title>
					<div className="flex gap-2">
						<Button
							variant={activeFilter === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => handleFilterChange("all")}
						>
							全部
						</Button>
						<Button
							variant={activeFilter === "succeeded" ? "default" : "outline"}
							size="sm"
							onClick={() => handleFilterChange("succeeded")}
						>
							成功
						</Button>
						<Button
							variant={activeFilter === "failed" ? "default" : "outline"}
							size="sm"
							onClick={() => handleFilterChange("failed")}
						>
							失败
						</Button>
						<Button
							variant={activeFilter === "running" ? "default" : "outline"}
							size="sm"
							onClick={() => handleFilterChange("running")}
						>
							运行中
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Text>加载中...</Text>
					</div>
				) : (
					<ConnectionList connections={filteredConnections} onSelectConnection={handleSelectConnection} />
				)}
			</Card>
		</div>
	);
}

export default DataIngestion;
