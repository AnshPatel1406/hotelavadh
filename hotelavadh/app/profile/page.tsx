import { getServerSession } from "next-auth";

export default async function ProfilePage() {
  const session = await getServerSession();

  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}