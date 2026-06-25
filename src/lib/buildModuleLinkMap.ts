import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
// field = 子项数组字段名；nameKey = 子项里的名称字段（用于子项级别的文章匹配）
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  doa6ReleaseDatePlatforms: { field: 'items', nameKey: 'label' },
  doa6CharactersTierList: { field: 'tiers', nameKey: 'label' },
  doa6BeginnerGuideControls: { field: 'steps', nameKey: 'title' },
  doa6CombatSystemMechanics: { field: 'mechanics', nameKey: 'title' },
  doa6StoryModeDoaQuest: { field: 'modes', nameKey: 'mode' },
  doa6CostumesDlcSeasonPasses: { field: 'packs', nameKey: 'name' },
  doa6CoreFightersFreeVersion: { field: 'rows', nameKey: 'feature' },
  doa6PcRequirementsOnlineCrossplay: { field: 'groups', nameKey: 'group' },
}

// Extra semantic keywords per module to boost matching for h2 titles.
// DOA6 专有名词 + 模块核心术语，确保模块大标题匹配到 content/ 下最相关的文章。
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  doa6ReleaseDatePlatforms: ['release date', 'platforms', 'editions', 'last round release', 'launch'],
  doa6CharactersTierList: ['character roster', 'tier list', 'roster', 'fighters', 'tier rankings'],
  doa6BeginnerGuideControls: ['beginner guide', 'controls', 'triangle system', 'beginner', 'practice'],
  doa6CombatSystemMechanics: ['combat system', 'break gauge', 'fatal rush', 'break blow', 'holds', 'combat mechanics'],
  doa6StoryModeDoaQuest: ['story mode', 'doa quest', 'missions', 'story', 'cinematics'],
  doa6CostumesDlcSeasonPasses: ['costumes dlc', 'season pass', 'dlc costumes', 'costume sets', 'premium tickets', 'carry over'],
  doa6CoreFightersFreeVersion: ['core fighters', 'free version', 'free characters', 'f2p', 'free to play'],
  doa6PcRequirementsOnlineCrossplay: ['pc requirements', 'cross play', 'online modes', 'crossplay', 'system requirements', 'online'],
}

// Filler words: 游戏名拆词 + 通用停用词（参与 token 计分前会被剔除，让有区分度的词主导匹配）
const FILLER_WORDS = [
  'dead', 'or', 'alive', 'doa', 'doa6', 'last', 'round',
  '2026', '2025', 'complete', 'the', 'and', 'for', 'how', 'with',
  'our', 'this', 'your', 'all', 'from', 'learn', 'master',
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 剥离游戏名变体（Dead or Alive 6 / Dead or Alive / DOA6 / Last Round），
// 让模块标题与文章标题在核心语义上对齐后再做精确短语匹配
function stripGameName(text: string): string {
  return text
    .replace(/dead or alive 6\s*/g, '')
    .replace(/dead or alive\s*/g, '')
    .replace(/doa 6\s*/g, '')
    .replace(/doa6\s*/g, '')
    .replace(/last round\s*/g, '')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (strip game-name tokens for better fuzzy matching)
  const strippedQuery = stripGameName(normalizedQuery)
  const strippedTitle = stripGameName(normalizedTitle)
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 15)
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[]
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`
          linkMap[key] = findBestMatch(itemName, allArticles)
        }
      }
    }
  }

  return linkMap
}
