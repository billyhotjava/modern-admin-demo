import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { Link } from "react-router";

export default function DataAssetsIndex() {
	const pages = [{ title: "热门数据集", icon: "📚", to: "/dashboard/data-assets/popular-datasets" }];

	return (
		<div className="p-6">
			<Title as="h4" className="mb-4">
				数据资产模块
			</Title>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{pages.map((page) => (
					<Card key={page.to} className="p-4 hover:shadow-lg transition-shadow">
						<Link to={page.to} className="flex flex-col items-center justify-center gap-2">
							<span className="text-3xl">{page.icon}</span>
							<Text className="font-medium">{page.title}</Text>
						</Link>
					</Card>
				))}
			</div>
		</div>
	);
}
