import { Text } from "@/ui/typography";

function PopularDatasets() {
	return (
		<div className="space-y-2">
			{[1, 2, 3, 4, 5].map((index) => (
				<div key={index} className="p-2 border rounded-md">
					<Text className="font-medium">热门数据集 {index}</Text>
					<Text variant="caption" className="text-muted-foreground">
						访问次数: {Math.floor(Math.random() * 1000)}
					</Text>
				</div>
			))}
		</div>
	);
}

export default PopularDatasets;
