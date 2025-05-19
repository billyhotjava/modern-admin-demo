import { getDatabases, getTables, getTags } from "@/api/services/metadata";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TableAsset = {
	id: string;
	name: string;
	type: string;
	database: string;
	tags: string[];
};

type Database = { name: string };
type Tag = { name: string };

const TABLE_TYPES = [
	{ label: "全部类型", value: "" },
	{ label: "原始表", value: "RAW" },
	{ label: "处理表", value: "PROCESSED" },
	{ label: "仓库表", value: "WAREHOUSE" },
];

function DataCatalog() {
	const [tables, setTables] = useState<TableAsset[]>([]);
	const [loading, setLoading] = useState(false);

	const [databases, setDatabases] = useState<Database[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const [selectedDb, setSelectedDb] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedTag, setSelectedTag] = useState("");

	useEffect(() => {
		getDatabases().then((data) => setDatabases(data?.items || []));
		getTags().then((data) => setTags(data?.items || []));
	}, []);

	useEffect(() => {
		setLoading(true);
		getTables({
			database: selectedDb || undefined,
			type: selectedType || undefined,
			tag: selectedTag || undefined,
		})
			.then((data) => {
				setTables(data?.items || []);
			})
			.finally(() => setLoading(false));
	}, [selectedDb, selectedType, selectedTag]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<Title as="h4">数据目录</Title>
			</div>

			<Card className="p-4">
				<div className="flex flex-wrap gap-4 mb-4">
					{/* 数据库筛选 */}
					<select
						className="border rounded px-3 py-1"
						value={selectedDb}
						onChange={(e) => setSelectedDb(e.target.value)}
					>
						<option value="">全部数据库</option>
						{databases.map((db) => (
							<option key={db.name} value={db.name}>
								{db.name}
							</option>
						))}
					</select>
					{/* 类型筛选 */}
					<select
						className="border rounded px-3 py-1"
						value={selectedType}
						onChange={(e) => setSelectedType(e.target.value)}
					>
						{TABLE_TYPES.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
					{/* 标签筛选 */}
					<select
						className="border rounded px-3 py-1"
						value={selectedTag}
						onChange={(e) => setSelectedTag(e.target.value)}
					>
						<option value="">全部标签</option>
						{tags.map((tag) => (
							<option key={tag.name} value={tag.name}>
								{tag.name}
							</option>
						))}
					</select>
				</div>
				<Title as="h5" className="mb-4">
					表资产列表
				</Title>
				{loading ? (
					<div className="h-64 flex items-center justify-center">
						<Text>加载中...</Text>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full border rounded-md">
							<thead>
								<tr className="bg-muted/30">
									<th className="px-4 py-2 text-left">表名</th>
									<th className="px-4 py-2 text-left">类型</th>
									<th className="px-4 py-2 text-left">数据库</th>
									<th className="px-4 py-2 text-left">标签</th>
								</tr>
							</thead>
							<tbody>
								{tables.length === 0 ? (
									<tr>
										<td colSpan={4} className="text-center py-8">
											<Text>暂无数据</Text>
										</td>
									</tr>
								) : (
									tables.map((table) => (
										<tr key={table.id} className="border-t">
											<td className="px-4 py-2">
												<Link
													to={`/dashboard/data-platform/data-catalog/${table.id}`}
													className="text-blue-600 hover:underline"
												>
													{table.name}
												</Link>
											</td>
											<td className="px-4 py-2">{table.type}</td>
											<td className="px-4 py-2">{table.database}</td>
											<td className="px-4 py-2">{table.tags && table.tags.length > 0 ? table.tags.join(", ") : "-"}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
}

export default DataCatalog;
