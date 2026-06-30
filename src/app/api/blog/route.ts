import { NextResponse } from "next/server";
import { getServiceSupabase, getServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, blog_categories(*)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, featured_image_url, category_id, status, seo_title, seo_description, seo_keywords } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }
    if (typeof title !== "string" || title.length > 200) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const postData: any = {
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      category_id,
      status: status || "draft",
      seo_title,
      seo_description,
      seo_keywords,
    };

    if (status === "published") {
      postData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const supabase = getServiceSupabase();

    if (updateData.status === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
