import { createClient } from "@/libs/supabase/server";
export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("random_facts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {" "}
      {posts.map((p) => (
        <li key={p.id}>
          {p.title}: {p.content}
        </li>
      ))}{" "}
    </ul>
  );
}
