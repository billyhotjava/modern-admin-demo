import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

function DataCatalog() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<Title as="h4">数据目录</Title>
			</div>

			<Card className="p-4">
				<Title as="h5" className="mb-4">
					数据目录内容
				</Title>
				<div className="h-64 border rounded-md p-4 bg-muted/30 flex items-center justify-center">
					<Text>数据目录页面内容将在这里显示</Text>
				</div>
			</Card>
		</div>
	);
}

export default DataCatalog;
