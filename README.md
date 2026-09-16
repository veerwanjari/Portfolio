# Veer Wanjari — Portfolio

A dark, motion-forward personal portfolio built with Vite, React, Tailwind CSS v4, and Motion.

Live data note: the "Public repos" / "Followers" numbers in the hero fetch live from
`api.github.com/users/veerwanjari` on every page load, with a static fallback baked in
so the numbers are never blank if the API is rate-limited or offline.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  data/            Edit these to update content — no component code needed
    profile.js     Name, roles, bio, links, résumé path, hero stats
    skills.js      Skill categories + chips (from the résumé's technical skills section)
    projects.js    Project cards (title, tagline, tech, repo/demo links)
    timeline.js    Journey entries (experience / education / achievements)

  components/
    ui/            Reusable primitives: MagneticButton, CustomCursor, ParticleField,
                   PillTabs, SectionHeading, AmbientBackground, BrandIcons
    layout/        Navbar, Footer, Preloader
    sections/      Hero, About, Skills, Projects, ProjectCard, Experience, Contact

  index.css        Design tokens (colors, fonts) live in the @theme block here,
                   plus the .frame corner-bracket motif used across the site.

public/
  resume/          The actual résumé PDF, linked from the "Download Résumé" buttons
  favicon.svg
```

## Design notes

- **Signature motif**: instead of generic rounded cards, most panels use a `.frame`
  class — four small corner brackets drawn with one pseudo-element, no extra markup.
  It's a nod to the object-detection work in Parivahan Vision (a "viewfinder" locking
  onto content) rather than a decorative flourish. Add `.frame` to any element; add
  `.frame-accent` for the brighter indigo variant.
- **Cursor & particles**: `CustomCursor.jsx` and `ParticleField.jsx` both render as
  small crosshairs rather than plain dots/circles, for the same reason. Both are
  automatically disabled on touch devices and when `prefers-reduced-motion` is set.
- **Colors, fonts, and easing curves** are defined once as CSS variables in the
  `@theme` block at the top of `src/index.css` — change them there and they propagate
  everywhere (including as real Tailwind utility classes, e.g. `bg-accent`, `text-ink-dim`).
- **Reduced motion** is handled at three levels: `MotionConfig reducedMotion="user"` in
  `App.jsx` for anything built with Motion, a blanket CSS rule at the bottom of
  `index.css` for plain CSS transitions/animations, and an explicit check inside
  `ParticleField` and `Preloader` since those use the Canvas API / real timers.

## Updating content

Everything text-based lives in `src/data/*.js` — swap in new projects, roles, or
timeline entries there without touching any component. To swap the résumé file,
replace `public/resume/Veer-Wanjari-Resume.pdf` and update `resumeUrl` in
`src/data/profile.js` if you rename it.

## Deploying

It's a static Vite build — `npm run build` produces a `dist/` folder that can be
deployed as-is to Vercel, Netlify, GitHub Pages, or any static host. On Vercel/Netlify,
the default "Vite" framework preset (build command `npm run build`, output directory
`dist`) works with no extra configuration.
