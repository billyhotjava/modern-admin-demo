import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

function DataProcessing() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<Title as="h4">数据处理</Title>
			</div>

			<Card className="p-4">
				<Title as="h5" className="mb-4">
					数据处理内容
				</Title>
				<div className="h-64 border rounded-md p-4 bg-muted/30 flex items-center justify-center">
					<Text>数据处理页面内容将在这里显示</Text>
				</div>
			</Card>
		</div>
	);
}

export default DataProcessing;
