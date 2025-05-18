import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const navData: NavProps["data"] = [
	{
		name: "sys.menu.dashboard",
		items: [
			{
				title: "sys.menu.workbench",
				path: "/dashboard/workbench",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
			{
				title: "sys.menu.analysis",
				path: "/dashboard/analysis",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
			{
				title: "数据湖仓一体化平台",
				path: "/dashboard/data-platform",
				icon: <Icon icon="local:ic-dashboard" size="24" />,
				children: [
					{
						title: "平台概览",
						path: "/dashboard/data-platform",
					},
					{
						title: "数据目录",
						path: "/dashboard/data-platform/data-catalog",
					},
					{
						title: "数据接入",
						path: "/dashboard/data-platform/data-ingestion",
					},
					{
						title: "数据处理",
						path: "/dashboard/data-platform/data-processing",
					},
					{
						title: "数据治理",
						path: "/dashboard/data-platform/data-governance",
					},
					{
						title: "系统监控",
						path: "/dashboard/data-platform/system-monitoring",
					},
				],
			},
		],
	},
	{
		name: "sys.menu.pages",
		items: [
			// management
			{
				title: "sys.menu.management",
				path: "/management",
				icon: <Icon icon="local:ic-management" size="24" />,
				children: [
					{
						title: "sys.menu.user.index",
						path: "/management/user",
						children: [
							{
								title: "sys.menu.user.profile",
								path: "/management/user/profile",
							},
							{
								title: "sys.menu.user.account",
								path: "/management/user/account",
							},
						],
					},
					{
						title: "sys.menu.system.index",
						path: "/management/system",
						children: [
							{
								title: "sys.menu.system.organization",
								path: "/management/system/organization",
							},
							{
								title: "sys.menu.system.permission",
								path: "/management/system/permission",
							},
							{
								title: "sys.menu.system.role",
								path: "/management/system/role",
							},
							{
								title: "sys.menu.system.user",
								path: "/management/system/user",
							},
						],
					},
				],
			},
		],
	},
	{
		name: "sys.menu.ui",
		items: [],
	},
];
