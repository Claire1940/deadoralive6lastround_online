import {
	Rocket,
	Gamepad2,
	BookOpen,
	Users,
	Package,
	Key,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置（主题重构 Part 8：依据 tools/keywords.json 的 6 个文章分类重建）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: Gamepad2, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'dlc', path: '/dlc', icon: Package, isContentType: true },
	{ key: 'unlockables', path: '/unlockables', icon: Key, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'build', 'combat', 'guides']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
