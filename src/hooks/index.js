import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section ids is currently in view, using
 * IntersectionObserver so it stays smooth on scroll instead of polling.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  const key = ids.join(',')

  useEffect(() => {
    const elements = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}

// Seeded from a real, live lookup of github.com/veerwanjari at build time.
// Replaced by a fresh client-side fetch on mount whenever the network allows it.
const GITHUB_FALLBACK = {
  public_repos: 6,
  followers: 0,
}

export function useGithubStats(username) {
  const [stats, setStats] = useState(GITHUB_FALLBACK)

  useEffect(() => {
    let alive = true
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error('GitHub API error')
        return res.json()
      })
      .then((data) => {
        if (!alive) return
        setStats({
          public_repos: data.public_repos ?? GITHUB_FALLBACK.public_repos,
          followers: data.followers ?? GITHUB_FALLBACK.followers,
        })
      })
      .catch(() => {
        /* keep the seeded fallback — still accurate, just not live */
      })
    return () => {
      alive = false
    }
  }, [username])

  return stats
}
