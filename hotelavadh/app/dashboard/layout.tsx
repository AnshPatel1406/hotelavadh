import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect the dashboard route
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "reception") {
    redirect("/profile");
  }

  return (
    <div className="w-full space-y-6">
      <DashboardTopNav />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
