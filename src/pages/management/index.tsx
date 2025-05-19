import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { Link } from "react-router";

export default function ManagementIndex() {
	const modules = [
		{ title: "系统管理", icon: "⚙️", to: "/dashboard/management/system" },
		{ title: "用户管理", icon: "👤", to: "/dashboard/management/user" },
	];

	return (
		<div className="p-6">
			<Title as="h4" className="mb-4">
				管理模块
			</Title>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{modules.map((mod) => (
					<Card key={mod.to} className="p-4 hover:shadow-lg transition-shadow">
						<Link to={mod.to} className="flex flex-col items-center justify-center gap-2">
							<span className="text-3xl">{mod.icon}</span>
							<Text className="font-medium">{mod.title}</Text>
						</Link>
					</Card>
				))}
			</div>
		</div>
	);
}
