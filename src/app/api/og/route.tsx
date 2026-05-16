import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'

type Theme = {
  name: string
  bgGradient: [string, string]
  accent: string
  icon: string
  textColor: string
  subColor: string
  brandColor: string
}

const themes: Record<string, Theme> = {
  tech: {
    name: 'tech',
    bgGradient: ['#0a0e27', '#1a1f4a'],
    accent: '#3b82f6',
    icon: '🚀',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.7)',
    brandColor: 'rgba(255,255,255,0.4)',
  },
  minimal: {
    name: 'minimal',
    bgGradient: ['#1a1a1a', '#2d2d2d'],
    accent: '#f5f5f5',
    icon: '◆',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.6)',
    brandColor: 'rgba(255,255,255,0.35)',
  },
  scholar: {
    name: 'scholar',
    bgGradient: ['#1a0e0e', '#3d1a1a'],
    accent: '#c9a96e',
    icon: '⚖',
    textColor: '#f5f0e8',
    subColor: 'rgba(245,240,232,0.7)',
    brandColor: 'rgba(201,169,110,0.5)',
  },
  bold: {
    name: 'bold',
    bgGradient: ['#1a0505', '#4a1010'],
    accent: '#f59e0b',
    icon: '📚',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.7)',
    brandColor: 'rgba(245,158,11,0.5)',
  },
  classic: {
    name: 'classic',
    bgGradient: ['#1a2414', '#2d3d1f'],
    accent: '#a3c98f',
    icon: '⚛',
    textColor: '#f5f8f2',
    subColor: 'rgba(245,248,242,0.7)',
    brandColor: 'rgba(163,201,143,0.5)',
  },
  artistic: {
    name: 'artistic',
    bgGradient: ['#1a0a20', '#3d1040'],
    accent: '#e8a0bf',
    icon: '🎵',
    textColor: '#fdf5f9',
    subColor: 'rgba(253,245,249,0.7)',
    brandColor: 'rgba(232,160,191,0.5)',
  },
  ancient: {
    name: 'ancient',
    bgGradient: ['#0d0d0d', '#1a1210'],
    accent: '#c24141',
    icon: '☯',
    textColor: '#f5f0e8',
    subColor: 'rgba(245,240,232,0.7)',
    brandColor: 'rgba(194,65,65,0.5)',
  },
  nature: {
    name: 'nature',
    bgGradient: ['#0e1a0e', '#1a2d1a'],
    accent: '#7ab87a',
    icon: '🌿',
    textColor: '#f2f7f2',
    subColor: 'rgba(242,247,242,0.7)',
    brandColor: 'rgba(122,184,122,0.5)',
  },
  poet: {
    name: 'poet',
    bgGradient: ['#0a0e1a', '#1a1530'],
    accent: '#c0c8e8',
    icon: '🌙',
    textColor: '#f0f0f8',
    subColor: 'rgba(240,240,248,0.7)',
    brandColor: 'rgba(192,200,232,0.5)',
  },
  mythic: {
    name: 'mythic',
    bgGradient: ['#1a0800', '#3d1200'],
    accent: '#f0a030',
    icon: '🔥',
    textColor: '#fff5e8',
    subColor: 'rgba(255,245,232,0.7)',
    brandColor: 'rgba(240,160,48,0.5)',
  },
}

const defaultTheme: Theme = {
  name: 'default',
  bgGradient: ['#0f1117', '#1c2333'],
  accent: '#6080c0',
  icon: '✦',
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.65)',
  brandColor: 'rgba(255,255,255,0.4)',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || '炼化自己'
  const bio = searchParams.get('bio') || 'AI 数字分身'
  const themeKey = searchParams.get('theme') || 'default'

  const theme = themes[themeKey] || defaultTheme

  // Truncate bio for display
  const displayBio = bio.length > 64 ? bio.slice(0, 64) + '...' : bio

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Serif SC", serif',
          backgroundImage: `linear-gradient(145deg, ${theme.bgGradient[0]}, ${theme.bgGradient[1]})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: `2px solid ${theme.subColor.replace('0.7', '0.08').replace('0.6', '0.08').replace('0.65', '0.08')}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: `2px solid ${theme.subColor.replace('0.7', '0.06').replace('0.6', '0.06').replace('0.65', '0.06')}`,
          }}
        />

        {/* Accent line top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 180,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 100px',
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: 56,
              marginBottom: 28,
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme.icon}
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: theme.textColor,
              textAlign: 'center',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            {name}
          </div>

          {/* Bio */}
          <div
            style={{
              fontSize: 26,
              color: theme.subColor,
              textAlign: 'center',
              lineHeight: 1.45,
              maxWidth: 800,
              marginBottom: 52,
            }}
          >
            {displayBio}
          </div>

          {/* Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 20,
              color: theme.brandColor,
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ color: theme.accent, fontSize: 16 }}>✦</span>
            <span>炼化自己 · 你的数字分身</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
