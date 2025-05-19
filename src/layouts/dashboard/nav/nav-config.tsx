import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const navData: NavProps["data"] = [
	{
		items: [
			{
				title: "Workspace",
				path: "/dashboard/workspace",
				icon: <Icon icon="local:ic-workbench" size="24" />,
			},
			{
				title: "Recents",
				path: "/dashboard/recents",
				icon: <Icon icon="local:ic-history" size="24" />,
			},
		],
	},
	{
		name: "Data Platform",
		items: [
			{ title: "平台首页", path: "/dashboard/data-platform", icon: <Icon icon="local:ic-dashboard" size="24" /> },
			{
				title: "数据处理",
				path: "/dashboard/data-platform/data-processing",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
			{
				title: "最近查询",
				path: "/dashboard/data-platform/recent-queries",
				icon: <Icon icon="local:ic-history" size="24" />,
			},
			{
				title: "数据目录",
				path: "/dashboard/data-platform/data-catalog",
				icon: <Icon icon="local:ic-menu" size="24" />,
			},
			{
				title: "数据治理",
				path: "/dashboard/data-platform/data-governance",
				icon: <Icon icon="local:ic-management" size="24" />,
			},
		],
	},
	{
		name: "Data Assets",
		items: [
			{
				title: "热门数据集",
				path: "/dashboard/data-assets/popular-datasets",
				icon: <Icon icon="local:ic-blank" size="24" />,
			},
		],
	},
	{
		name: "Pipelines",
		items: [
			{
				title: "数据接入",
				path: "/dashboard/pipelines/data-ingestion",
				icon: <Icon icon="local:ic-menulevel" size="24" />,
			},
		],
	},
	{
		name: "系统管理",
		items: [
			{ title: "管理首页", path: "/dashboard/management", icon: <Icon icon="local:ic-management" size="24" /> },
			{ title: "用户管理", path: "/dashboard/management/user", icon: <Icon icon="local:ic-user" size="24" /> },
		],
	},
];
