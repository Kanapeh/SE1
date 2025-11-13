import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  const baseUrl = 'https://www.se1a.org'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic blog posts
  let blogPosts: any[] = []
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts for sitemap:', error)
    } else {
      blogPosts = data || []
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Dynamic teachers
  let teachers: any[] = []
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, updated_at, created_at')
      .eq('status', 'Approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching teachers for sitemap:', error)
    } else {
      teachers = data || []
    }
  } catch (error) {
    console.error('Error fetching teachers for sitemap:', error)
  }

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const teacherPages = teachers.map((teacher) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: new Date(teacher.updated_at || teacher.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...teacherPages]
}
