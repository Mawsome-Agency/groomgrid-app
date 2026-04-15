import prisma from '@/lib/prisma'

export async function createContentBrief(data: {
  title: string
  slug: string
  summary?: string
  keywords?: any
  body: string
  createdBy: string
}) {
  return await prisma.contentBrief.create({
    data,
  })
}

export async function getContentBrief(id: string) {
  return await prisma.contentBrief.findUnique({
    where: { id },
  })
}

export async function getContentBriefBySlug(slug: string) {
  return await prisma.contentBrief.findUnique({
    where: { slug },
  })
}

export async function listContentBriefs({ skip = 0, take = 10 }: { skip?: number; take?: number }) {
  const [items, total] = await Promise.all([
    prisma.contentBrief.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.contentBrief.count(),
  ])
  return { items, total }
}

export async function updateContentBrief(id: string, data: Partial<{
  title: string
  slug: string
  summary: string
  keywords: any
  body: string
}>) {
  return await prisma.contentBrief.update({
    where: { id },
    data,
  })
}

export async function deleteContentBrief(id: string) {
  return await prisma.contentBrief.delete({
    where: { id },
  })
}
