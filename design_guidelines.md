# Design Guidelines: Gamified TypeScript Learning Platform

## Design Approach

**Selected Approach:** Design System with EdTech Inspiration
- Primary influence: Modern educational platforms (Duolingo, Khan Academy, Codecademy)
- Supporting systems: Material Design for cards and elevation, Linear for clean typography
- Principle: Balance playful gamification with focused learning experience

## Typography

**Font Families:**
- Headlines & UI: Inter or DM Sans (Google Fonts) - clean, modern sans-serif
- Body text: Same as headlines for consistency
- Code blocks: JetBrains Mono or Fira Code (Google Fonts) - monospace with ligature support

**Hierarchy:**
- Page titles: text-4xl font-bold
- Section headers: text-2xl font-semibold
- Lesson titles: text-xl font-semibold
- Body text: text-base
- Small UI text (XP, stats): text-sm
- Code snippets: text-sm font-mono

## Layout System

**Spacing Scale:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistency
- Component padding: p-6 or p-8
- Section spacing: space-y-8 or space-y-12
- Card gaps: gap-6
- Tight elements (badges, chips): p-2 or px-4 py-2

**Container Strategy:**
- Max width: max-w-6xl mx-auto for main content
- Sidebar layouts: Two-column grid (1/4 sidebar, 3/4 content) on desktop
- Mobile: Full-width stacked layouts

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed position with subtle shadow/border
- Logo left, navigation center (Dashboard, Levels, Profile), user menu right
- Height: h-16
- Include XP counter in navigation (e.g., "⭐ 450 XP" badge)

### Authentication Pages
**Layout:**
- Centered card on simple background
- max-w-md card with p-8
- Form inputs with clear labels, validation states
- Social proof text below form ("Join 10,000+ learners")

### Dashboard
**Hero Section:**
- Compact welcome banner with user greeting and current level
- No large hero image - focus on data visualization
- Height: Auto-sizing based on content

**Progress Overview Grid:**
- 3-column stat cards on desktop (Total XP, Lessons Complete, Challenges Complete)
- Each card: Rounded, elevated, with large number + label + icon
- Below: Full-width progress bar showing XP to next level

**Badge Showcase:**
- Horizontal scrollable row of earned badges
- Each badge: Circular icon + label underneath
- Locked badges shown in grayscale/muted state

### Levels Page
**Level Cards:**
- Vertical stack of level cards
- Each card shows: Level number, title, description, completion ring/percentage
- Locked levels: Greyed out with lock icon
- Active level: Highlighted with subtle glow/border
- Completed levels: Check mark badge overlay

### Lesson Detail Page
**Two-Column Layout (Desktop):**
- Left sidebar (1/3): Lesson navigation, progress checklist
- Main content (2/3): Lesson content + challenges

**Lesson Content:**
- Generous whitespace with max-w-prose for readability
- Code examples in bordered, monospace blocks with syntax highlighting indicators
- Key concepts in highlighted callout boxes

**Challenge Components:**

*Multiple Choice:*
- Question in text-lg font-semibold
- Radio button options with full-width clickable areas
- Submit button with loading state
- Immediate feedback: Green border + checkmark for correct, red + explanation for incorrect

*Code Challenge:*
- Textarea/code editor with monospace font, line numbers suggestion
- Starter code pre-filled
- Run/Submit button below
- Validation feedback panel showing success/error messages
- Hint button (tracks usage for badge system)

### Profile Page
**Layout:**
- User info card at top (avatar placeholder, name, email, join date)
- Stats grid: Total lessons, challenges, current streak, badges earned
- Recent activity timeline

### Gamification UI Elements

**XP Indicator:**
- Always visible in navigation
- Animated increment on completion (+20 XP animation)

**Progress Bars:**
- Rounded, with smooth fill animation
- Show current/target XP numbers
- Percentage or fraction display

**Badges:**
- Circular icon design, 64x64 or 80x80
- Use icon libraries for achievement symbols (trophy, star, flame, etc.)
- Tooltip on hover explaining how earned

**Level Unlocks:**
- Modal celebration when unlocking new level
- Confetti or success animation (subtle, not distracting)
- "Continue to Level X" CTA button

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Single column, stacked navigation
- Tablet (md): Two columns for grids, hamburger menu
- Desktop (lg+): Full layout with sidebar navigation

**Mobile Optimizations:**
- Bottom navigation bar for main actions
- Collapsible lesson sidebar
- Swipeable challenge cards

## Interaction Patterns

**Loading States:**
- Skeleton screens for lesson/challenge loading
- Spinner for authentication
- Progress indicators for XP calculations

**Success Feedback:**
- Checkmark animations for completed challenges
- Toast notifications for achievements
- Smooth transitions between lesson states

**Focus Management:**
- Clear focus indicators for keyboard navigation
- Auto-focus on challenge inputs
- Accessible modal dialogs

## Images

**Dashboard Background (Optional):**
- Subtle geometric pattern or gradient mesh as page background
- Very light, not distracting from content

**Empty States:**
- Friendly illustrations for "No badges yet" or "No lessons started"
- Simple line art style, centered with encouraging text

**No Large Hero Image** - This is a utility-focused learning app, not a marketing site. Focus on data visualization and learning content rather than imagery.

## Elevation & Depth

- Cards: Subtle shadow (shadow-sm or shadow-md)
- Active elements: shadow-lg on hover
- Modals: shadow-2xl with backdrop
- Floating action buttons: shadow-xl