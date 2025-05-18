import { LineLoading } from "@/components/loading";
import DashboardLayout from "@/layouts/dashboard";
import AuthGuard from "@/routes/components/auth-guard";
import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router";
import { Navigate } from "react-router";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

// dashboard
const WorkbenchPage = lazy(() => import("@/pages/dashboard/workbench"));
const AnalysisPage = lazy(() => import("@/pages/dashboard/analysis"));
const DataPlatformPage = lazy(() => import("@/pages/dashboard/data-platform"));
const DataCatalogPage = lazy(() => import("@/pages/dashboard/data-platform/data-catalog"));
const DataCatalogDetailPage = lazy(() => import("@/pages/dashboard/data-platform/data-catalog-detail"));
const DataIngestionPage = lazy(() => import("@/pages/dashboard/data-platform/data-ingestion"));
const DataProcessingPage = lazy(() => import("@/pages/dashboard/data-platform/data-processing"));
const DataGovernancePage = lazy(() => import("@/pages/dashboard/data-platform/data-governance"));
const SystemMonitoringPage = lazy(() => import("@/pages/dashboard/data-platform/system-monitoring"));

// error
const Page403 = lazy(() => import("@/pages/sys/error/Page403"));
const Page404 = lazy(() => import("@/pages/sys/error/Page404"));
const Page500 = lazy(() => import("@/pages/sys/error/Page500"));

// management
const ProfilePage = lazy(() => import("@/pages/management/user/profile"));
const AccountPage = lazy(() => import("@/pages/management/user/account"));
const OrganizationPage = lazy(() => import("@/pages/management/system/organization"));
const PermissioPage = lazy(() => import("@/pages/management/system/permission"));
const RolePage = lazy(() => import("@/pages/management/system/role"));
const UserPage = lazy(() => import("@/pages/management/system/user"));

export const dashboardRoutes: RouteObject[] = [
	{
		path: "/",
		element: (
			<AuthGuard>
				<Suspense fallback={<LineLoading />}>
					{/* outlet inside DashboardLayout */}
					<DashboardLayout />
				</Suspense>
			</AuthGuard>
		),
		children: [
			{ index: true, element: <Navigate to={HOMEPAGE} replace /> },
			{
				path: "dashboard",
				children: [
					{ index: true, element: <WorkbenchPage /> },
					{ path: "workbench", element: <WorkbenchPage /> },
					{ path: "analysis", element: <AnalysisPage /> },
					{ path: "data-platform", element: <DataPlatformPage /> },
					{ path: "data-platform/data-catalog", element: <DataCatalogPage /> },
					{ path: "data-platform/data-catalog/:tableId", element: <DataCatalogDetailPage /> },
					{ path: "data-platform/data-ingestion", element: <DataIngestionPage /> },
					{ path: "data-platform/data-ingestion/:connectionId", element: <DataIngestionPage /> },
					{ path: "data-platform/data-processing", element: <DataProcessingPage /> },
					{ path: "data-platform/data-governance", element: <DataGovernancePage /> },
					{ path: "data-platform/system-monitoring", element: <SystemMonitoringPage /> },
				],
			},
			{
				path: "management",
				children: [
					{ index: true, element: <Navigate to="user" replace /> },
					{
						path: "user",
						children: [
							{ index: true, element: <Navigate to="profile" replace /> },
							{ path: "profile", element: <ProfilePage /> },
							{ path: "account", element: <AccountPage /> },
						],
					},
					{
						path: "system",
						children: [
							{ index: true, element: <Navigate to="organization" replace /> },
							{ path: "organization", element: <OrganizationPage /> },
							{ path: "permission", element: <PermissioPage /> },
							{ path: "role", element: <RolePage /> },
							{ path: "user", element: <UserPage /> },
						],
					},
				],
			},
			{
				path: "error",
				children: [
					{ index: true, element: <Navigate to="403" replace /> },
					{ path: "403", element: <Page403 /> },
					{ path: "404", element: <Page404 /> },
					{ path: "500", element: <Page500 /> },
				],
			},
		],
	},
];
