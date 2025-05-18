import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { Link } from "react-router";

function DataPlatformDashboard() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<Title as="h4">数据湖仓一体化平台</Title>
				<div className="flex gap-2">
					<Link
						to="/dashboard/data-platform/data-catalog"
						className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
					>
						数据目录
					</Link>
					<Link
						to="/dashboard/data-platform/data-governance"
						className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
					>
						数据治理
					</Link>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<SummaryCard title="今日数据总量" value="1.2 TB" change="+120 GB" trend="up" icon="📊" />
				<SummaryCard title="活跃用户数" value="87" change="+12" trend="up" icon="👥" />
				<SummaryCard title="运行中任务" value="24" change="+5" trend="up" icon="⚙️" />
				<SummaryCard title="总存储量" value="24.5 TB" change="+2.1 TB" trend="up" icon="💾" />
				<SummaryCard title="计算用量" value="128 核" change="+32" trend="up" icon="🖥️" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Usage Trend */}
				<Card className="p-4 md:col-span-2">
					<div className="flex justify-between items-center mb-4">
						<Title as="h5">资源使用趋势</Title>
						<div className="flex gap-2">
							<button type="button" className="px-2 py-1 text-xs border rounded-md hover:bg-accent">
								日
							</button>
							<button type="button" className="px-2 py-1 text-xs border rounded-md bg-accent">
								周
							</button>
							<button type="button" className="px-2 py-1 text-xs border rounded-md hover:bg-accent">
								月
							</button>
						</div>
					</div>
					<div className="h-64 border rounded-md p-4 bg-muted/30 flex items-center justify-center">
						<Text>存储与计算资源使用趋势图表</Text>
					</div>
				</Card>

				{/* Quick Actions */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						快捷操作
					</Title>
					<div className="flex flex-col gap-3">
						<QuickActionButton
							icon="📊"
							title="运行SQL查询"
							description="在数据仓库中执行SQL查询"
							to="/dashboard/workbench"
						/>
						<QuickActionButton
							icon="📥"
							title="数据接入"
							description="从外部源导入数据"
							to="/dashboard/data-platform/data-ingestion"
						/>
						<QuickActionButton
							icon="⚙️"
							title="数据处理"
							description="转换和处理数据"
							to="/dashboard/data-platform/data-processing"
						/>
						<QuickActionButton
							icon="📈"
							title="系统监控"
							description="查看系统性能和指标"
							to="/dashboard/data-platform/system-monitoring"
						/>
						<QuickActionButton icon="📚" title="帮助中心" description="查看文档和教程" to="/dashboard/help-center" />
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Jobs/Pipelines Monitor */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						任务监控
					</Title>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div className="h-40 border rounded-md p-4 bg-muted/30 flex items-center justify-center">
							<Text>任务状态分布饼图</Text>
						</div>
						<div className="flex flex-col justify-center">
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">成功</Text>
								<Text className="text-green-500">124</Text>
							</div>
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">失败</Text>
								<Text className="text-red-500">12</Text>
							</div>
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">运行中</Text>
								<Text className="text-blue-500">24</Text>
							</div>
							<div className="flex justify-between items-center">
								<Text className="font-medium">等待中</Text>
								<Text className="text-yellow-500">8</Text>
							</div>
						</div>
					</div>
					<Title as="h6" className="text-sm mb-2">
						最近失败任务
					</Title>
					<div className="space-y-2">
						{failedTasks.map((task) => (
							<div key={task.id} className="p-2 border rounded-md">
								<div className="flex justify-between">
									<Text className="font-medium">{task.name}</Text>
									<Text variant="caption" className="text-muted-foreground">
										{task.time}
									</Text>
								</div>
								<Text variant="caption" className="text-red-500">
									{task.error}
								</Text>
							</div>
						))}
					</div>
				</Card>

				{/* Data Assets Distribution */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						数据资产分布
					</Title>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div className="h-40 border rounded-md p-4 bg-muted/30 flex items-center justify-center">
							<Text>数据资产类型分布图</Text>
						</div>
						<div className="flex flex-col justify-center">
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">原始表</Text>
								<Text>245</Text>
							</div>
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">处理表</Text>
								<Text>312</Text>
							</div>
							<div className="flex justify-between items-center mb-2">
								<Text className="font-medium">仓库表</Text>
								<Text>178</Text>
							</div>
							<div className="flex justify-between items-center">
								<Text className="font-medium">总计</Text>
								<Text className="font-bold">735</Text>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="p-3 border rounded-md">
							<Text variant="caption" className="text-muted-foreground">
								数据湖
							</Text>
							<Title as="h3" className="text-xl font-bold">
								557
							</Title>
							<Text variant="caption">表 / 76%</Text>
						</div>
						<div className="p-3 border rounded-md">
							<Text variant="caption" className="text-muted-foreground">
								数据仓库
							</Text>
							<Title as="h3" className="text-xl font-bold">
								178
							</Title>
							<Text variant="caption">表 / 24%</Text>
						</div>
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Data Quality & Alerts */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						数据质量与告警
					</Title>
					<div className="space-y-3">
						{alerts.map((alert) => (
							<div key={alert.id} className="p-3 border rounded-md">
								<div className="flex items-start gap-3">
									<div className={`p-1 rounded-full ${getAlertTypeColor(alert.type)}`}>
										{getAlertTypeIcon(alert.type)}
									</div>
									<div>
										<Text className="font-medium">{alert.title}</Text>
										<Text variant="caption" className="text-muted-foreground">
											{alert.description}
										</Text>
										<div className="flex justify-between items-center mt-1">
											<Text variant="caption" className="text-muted-foreground">
												{alert.time}
											</Text>
											<Link to={alert.link} className="text-xs px-2 py-1 border rounded hover:bg-accent">
												查看详情
											</Link>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Access Analytics */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						访问分析
					</Title>
					<div className="h-40 border rounded-md p-4 bg-muted/30 flex items-center justify-center mb-4">
						<Text>活跃用户趋势图</Text>
					</div>
					<Title as="h6" className="text-sm mb-2">
						热门资产榜单
					</Title>
					<div className="space-y-2">
						{popularAssets.map((asset, index) => (
							<div key={asset.id} className="flex items-center p-2 border rounded-md">
								<div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full mr-3">
									<Text className="text-xs font-bold">{index + 1}</Text>
								</div>
								<div className="flex-1">
									<Text className="font-medium">{asset.name}</Text>
									<Text variant="caption" className="text-muted-foreground">
										{asset.schema}
									</Text>
								</div>
								<div className="flex items-center gap-1">
									<span className="text-sm">👁️</span>
									<Text variant="caption" className="text-muted-foreground">
										{asset.views}
									</Text>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Notifications/Announcements */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						通知与公告
					</Title>
					<div className="space-y-3">
						{notifications.map((notification) => (
							<div key={notification.id} className="p-3 border rounded-md">
								<div className="flex justify-between">
									<Text className="font-medium">{notification.title}</Text>
									<Text variant="caption" className="text-muted-foreground">
										{notification.time}
									</Text>
								</div>
								<Text variant="caption" className="text-muted-foreground">
									{notification.content}
								</Text>
							</div>
						))}
					</div>
				</Card>

				{/* API/Integration Service Monitoring */}
				<Card className="p-4">
					<Title as="h5" className="mb-4">
						集成服务监控
					</Title>
					<div className="space-y-3">
						{integrationServices.map((service) => (
							<div key={service.id} className="flex justify-between items-center p-3 border rounded-md">
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full ${
											service.status === "healthy"
												? "bg-green-500"
												: service.status === "degraded"
													? "bg-yellow-500"
													: "bg-red-500"
										}`}
									/>
									<Text className="font-medium">{service.name}</Text>
								</div>
								<div className="flex items-center gap-3">
									<Text variant="caption" className="text-muted-foreground">
										{service.latency}
									</Text>
									<Link
										to={`/dashboard/monitoring/service/${service.id}`}
										className="text-xs px-2 py-1 border rounded hover:bg-accent"
									>
										详情
									</Link>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}

function SummaryCard({
	title,
	value,
	change,
	trend,
	icon,
}: { title: string; value: string; change: string; trend: "up" | "down"; icon: string }) {
	const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
	const trendIcon = trend === "up" ? "↑" : "↓";

	return (
		<Card className="p-4">
			<div className="flex justify-between items-start">
				<div>
					<Text variant="caption" className="text-muted-foreground">
						{title}
					</Text>
					<Title as="h3" className="text-xl font-bold mt-1">
						{value}
					</Title>
					<Text variant="caption" className={`${trendColor} mt-1`}>
						{trendIcon} {change}
					</Text>
				</div>
				<span className="text-2xl">{icon}</span>
			</div>
		</Card>
	);
}

function QuickActionButton({
	icon,
	title,
	description,
	to,
}: { icon: string; title: string; description: string; to: string }) {
	return (
		<Link to={to} className="flex items-start gap-3 p-3 border rounded-md hover:bg-accent transition-colors">
			<span className="text-2xl">{icon}</span>
			<div>
				<Text className="font-medium">{title}</Text>
				<Text variant="caption" className="text-muted-foreground">
					{description}
				</Text>
			</div>
		</Link>
	);
}

function getAlertTypeColor(type: string) {
	switch (type) {
		case "error":
			return "bg-red-100 text-red-800";
		case "warning":
			return "bg-yellow-100 text-yellow-800";
		case "info":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function getAlertTypeIcon(type: string) {
	switch (type) {
		case "error":
			return "❌";
		case "warning":
			return "⚠️";
		case "info":
			return "ℹ️";
		default:
			return "📌";
	}
}

// Mock data
const failedTasks = [
	{
		id: "1",
		name: "daily_sales_etl",
		time: "今天 10:23 AM",
		error: "连接超时: 无法连接到数据源",
	},
	{
		id: "2",
		name: "customer_segmentation",
		time: "今天 09:45 AM",
		error: "内存不足: 处理大型数据集时内存溢出",
	},
	{
		id: "3",
		name: "product_inventory_sync",
		time: "昨天 4:12 PM",
		error: "数据验证失败: 主键约束冲突",
	},
];

const alerts = [
	{
		id: "1",
		type: "error",
		title: "数据质量检测失败",
		description: "sales.customer_orders 表中发现 15% 的空值超过阈值",
		time: "1小时前",
		link: "/dashboard/data-quality/issues/1",
	},
	{
		id: "2",
		type: "warning",
		title: "字段类型漂移",
		description: "analytics.user_events 表中 event_properties 字段类型不一致",
		time: "3小时前",
		link: "/dashboard/data-quality/issues/2",
	},
	{
		id: "3",
		type: "info",
		title: "血缘关系变更",
		description: "marketing.customer_segments 表的上游依赖已更新",
		time: "昨天",
		link: "/dashboard/data-lineage/marketing.customer_segments",
	},
];

const popularAssets = [
	{
		id: "1",
		name: "customer_orders",
		schema: "sales",
		views: 1245,
	},
	{
		id: "2",
		name: "user_events",
		schema: "analytics",
		views: 987,
	},
	{
		id: "3",
		name: "product_inventory",
		schema: "inventory",
		views: 756,
	},
	{
		id: "4",
		name: "customer_segments",
		schema: "marketing",
		views: 543,
	},
];

const notifications = [
	{
		id: "1",
		title: "系统更新通知",
		content: "系统将于本周六 22:00-24:00 进行维护升级，期间部分服务可能不可用",
		time: "2小时前",
	},
	{
		id: "2",
		title: "新功能发布",
		content: "数据质量监控模块已上线，支持自定义规则和告警阈值设置",
		time: "昨天",
	},
	{
		id: "3",
		title: "待审批事项",
		content: "您有 3 个数据访问权限申请待审批",
		time: "2天前",
	},
];

const integrationServices = [
	{
		id: "1",
		name: "Kafka 消息队列",
		status: "healthy",
		latency: "5ms",
	},
	{
		id: "2",
		name: "对象存储服务",
		status: "healthy",
		latency: "12ms",
	},
	{
		id: "3",
		name: "实时计算引擎",
		status: "degraded",
		latency: "120ms",
	},
	{
		id: "4",
		name: "外部 API 网关",
		status: "healthy",
		latency: "85ms",
	},
];

export default DataPlatformDashboard;
