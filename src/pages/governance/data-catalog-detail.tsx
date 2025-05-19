import { getTableDetail } from "@/api/services/metadata";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Field = {
	name: string;
	type: string;
	description?: string;
};

type TableDetail = {
	id: string;
	name: string;
	type: string;
	database: string;
	tags: string[];
	fields: Field[];
	createdAt?: string;
	createdBy?: string;
	lineage?: string[];
	lastAccessedAt?: string;
	rowCount?: number;
};

function DataCatalogDetail() {
	const { tableId } = useParams<{ tableId: string }>();
	const [detail, setDetail] = useState<TableDetail | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!tableId) return;
		setLoading(true);
		getTableDetail(tableId)
			.then((data) => setDetail(data))
			.finally(() => setLoading(false));
	}, [tableId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Text>加载中...</Text>
			</div>
		);
	}

	if (!detail) {
		return (
			<div className="flex items-center justify-center h-64">
				<Text>未找到表详情</Text>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<Link to="/dashboard/data-platform/data-catalog" className="text-blue-600 hover:underline">
					数据目录
				</Link>
				<span>/</span>
				<Text className="font-bold">{detail.name}</Text>
			</div>
			<Card className="p-4">
				<Title as="h4" className="mb-2">
					{detail.name}
				</Title>
				<div className="mb-2 flex flex-wrap gap-4">
					<Text>类型: {detail.type}</Text>
					<Text>数据库: {detail.database}</Text>
					<Text>标签: {detail.tags && detail.tags.length > 0 ? detail.tags.join(", ") : "-"}</Text>
					{detail.rowCount !== undefined && <Text>数据量: {detail.rowCount}</Text>}
				</div>
				<div className="mb-2 flex flex-wrap gap-4">
					{detail.createdAt && <Text>采集时间: {detail.createdAt}</Text>}
					{detail.createdBy && <Text>采集人: {detail.createdBy}</Text>}
					{detail.lastAccessedAt && <Text>最近访问: {detail.lastAccessedAt}</Text>}
				</div>
				{detail.lineage && detail.lineage.length > 0 && (
					<div className="mb-4">
						<Title as="h6" className="mb-1">
							血缘关系
						</Title>
						<Text>{detail.lineage.join(" → ")}</Text>
					</div>
				)}
				<Title as="h5" className="mt-4 mb-2">
					字段信息
				</Title>
				<div className="overflow-x-auto">
					<table className="min-w-full border rounded-md">
						<thead>
							<tr className="bg-muted/30">
								<th className="px-4 py-2 text-left">字段名</th>
								<th className="px-4 py-2 text-left">类型</th>
								<th className="px-4 py-2 text-left">描述</th>
							</tr>
						</thead>
						<tbody>
							{detail.fields && detail.fields.length > 0 ? (
								detail.fields.map((field) => (
									<tr key={field.name} className="border-t">
										<td className="px-4 py-2">{field.name}</td>
										<td className="px-4 py-2">{field.type}</td>
										<td className="px-4 py-2">{field.description || "-"}</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={3} className="text-center py-8">
										<Text>暂无字段信息</Text>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}

export default DataCatalogDetail;
