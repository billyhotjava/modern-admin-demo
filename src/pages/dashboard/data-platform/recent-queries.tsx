import { Text } from "@/ui/typography";

function RecentQueries() {
	return (
		<div className="space-y-2">
			{[1, 2, 3, 4, 5].map((index) => (
				<div key={index} className="p-2 border rounded-md">
					<Text className="font-medium">最近查询 {index}</Text>
					<Text variant="caption" className="text-muted-foreground">
						执行时间: {Math.floor(Math.random() * 60)} 秒前
					</Text>
				</div>
			))}
		</div>
	);
}

export default RecentQueries;
