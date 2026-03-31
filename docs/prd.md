# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Qazyen AI

### 1.2 Application Description
Qazyen AI is an enterprise-grade, cross-platform AI Super Application delivering Perplexity AI and Gemini-level conversational intelligence, advanced AI video generation (powered by nand AI), AI image creation (powered by geminit AI and additional lifetime-free services), document processing, multilingual voice assistant, real-time web intelligence, personal productivity tools, a photorealistic 3D virtual humanoid robot (100% matching the uploaded image.png with shiny metallic aluminium body, professional hand and body movements with strictly upward 100% vertical hand movement and 0% rotation during greeting, and a laboratory background environment) for interviews and voice interaction, Gamma-style AI PPT maker, professional video editor, and secure data management — all within a seamless premium interface where the Home page layout and visual design 100% matches the uploaded home page reference image (file-aig01c6yjitc.png) as the primary and definitive visual blueprint for the Home screen, fused with futuristic robot-themed aesthetics, a flexible menu layout system (Circular Mode with iOS-style notch profile panel and Grid Mode), a full-spectrum gradient color palette flowing Cyan → Light Blue → Pink → White → Dark Blue → White throughout every surface, rotating circular icons with smooth click interaction, a dynamic animated background gradient (Cyan + Light Cyan + Dark Blue + Black + White + Silver in random flowing movement) with user-controllable on/off toggle, customizable background images throughout the entire application, and a freely movable and always-accessible Back to Home button on every feature module screen.

Tagline: Intelligence Beyond Boundaries.

### 1.3 Target Platforms
- Android (APK build)
- iOS
- iPadOS
- macOS
- Windows
- Linux
- Web (PWA-ready, compatible with all modern browsers)
- Chrome OS
- Any platform with modern web browser support

### 1.4 Core Differentiation
Qazyen AI unifies Perplexity AI and Gemini-level conversational intelligence, 100% operational geminit AI-powered image generation with additional lifetime-free image generation services, 100% operational nand AI-powered video generation (5–10 second configurable duration, multi-resolution output), a 100% operational photorealistic 3D humanoid robot assistant (100% matching the uploaded image.png) with strictly upward vertical hand movements and zero rotation during greeting, voice-first multilingual interaction, knowledge search engine, Gamma-style AI PPT maker, professional video editor, encrypted cloud storage with database-backed chat history, cross-device synchronization, dual-mode admin/user management console, AI personalization engine, and smart automation workflows — all wrapped in a Home page that 100% mirrors the uploaded home page reference image (file-aig01c6yjitc.png), enhanced with futuristic Material Design robot-themed aesthetics, flexible Circular and Grid menu layouts, a cohesive gradient visual identity, rotating circular icons, a dynamic animated background gradient with disable option, customizable background images, and a freely movable and always-accessible Back to Home button on every feature module screen.

### 1.5 Pricing Model
All services are lifetime free and unlimited. The integrated AI services (killing AI, nand AI, geminit AI, and all additional image/video generation services) are configured for 100% free, perpetual, lifetime access with no cost to the end-user. No subscription plans, billing, credit top-ups, or paywalls exist anywhere in the application. An automatic API key rotation and upgrade system ensures uninterrupted service at all times. The Sora 2 model/service is removed from all available options as it does not meet the lifetime-free criteria.

---

## 2. User Roles & Access Control

### 2.1 Role Overview
| Role | Access Level | Description |
|------|-------------|-------------|
| User | Standard | Access to all core AI generation features, PPT creator, chat, voice assistant, and productivity tools |
| Administrator | Privileged | Full access including admin dashboard, user management, API key management, role assignment, system monitoring, and AI service health management |

### 2.2 User Mode
- Access to: Conversational AI, Image Generation (geminit AI + additional lifetime-free services), Video Generation (nand AI, 5–10s configurable, multi-resolution), PPT Maker (Gamma-style), Video Editor, 3D Robot Assistant, Voice Assistant, Note Summary, Task Manager, AI Calendar, Productivity Suite, Resume Analyzer, Prompt Generator, History, Advanced Settings
- No access to: Admin Dashboard, user role management, API key configuration, system monitoring, AI service audit controls
- No billing, subscription, or paywall elements are visible to users

### 2.3 Administrator Mode
- Secure hidden admin password: qazyen123 (stored and validated server-side)
- Admin can view a real-time dashboard of all currently active/operating users
- Admin can change a user's role from Administrator to regular User
- Admin cannot be demoted by any User — role demotion is admin-only action
- Admin has full access to API key management: view, update, and rotate API keys for all integrated services (geminit AI, nand AI, killing AI, OpenAI GPT-4, ElevenLabs, Google Cloud TTS, and all additional lifetime-free image/video generation services)
- Admin can view real-time error logs, API health status, service uptime indicators, and system performance metrics
- Admin can trigger manual service audits and view lifetime-free verification status per service
- Admin access points:
  - Radial context menu option (Admin Mode) on any menu button in both Circular and Grid modes
  - Dedicated Admin Mode access button visible on the Home page (gated by admin code qazyen123)
  - Admin login prompt overlay: input field for admin code, submit button, rate-limited failed attempts, success grants full admin dashboard access

---

## 3. Core Features

### 3.1 Intelligent Conversational AI Engine (Perplexity AI & Gemini Level)
- Real-time streaming chat responses with sub-2-second latency
- Context-aware conversation memory across sessions
- Thread-based multi-session history management
- Smart answer refinement and follow-up suggestions
- Deep web search integration with numbered source citations and clickable links
- Advanced research mode with academic paper access
- Code generation in 30+ programming languages with syntax highlighting
- Academic writing, creative writing, debate, and teaching modes
- Multi-modal understanding: text, image, and video input
- Adjustable response styles: Concise, Detailed, Technical, Simple
- Export chat as PDF, DOCX, or Markdown
- Pin important conversations to top of thread list
- Fully interactive AI messages: text selection, copy, right-click context menu, link interaction, code block interaction
- API Integration: Lifetime free unlimited killing AI or OpenAI GPT-4 API with automatic key rotation; 100% operational with zero API key errors

### 3.2 Chat History & Thread Management (Google AI Studio Style)
- Thread-based organization identical to Google AI Studio
- New Thread creation via prominent New Chat button
- Left sidebar displays all threads in chronological order with date grouping: Today, Yesterday, Last 7 Days, Last 30 Days, Older
- Thread preview showing first message or custom title
- Thread search with real-time keyword filtering
- Thread filtering by date, topic, or tags
- Thread pinning, archiving, deletion (with confirmation dialog), renaming, and sharing
- Thread continuation with full context preservation
- Thread metadata: creation date, last modified date, message count
- Thread icons indicating type: chat, research, image generation, video generation, etc.
- Auto-save to database in real-time
- Cross-device synchronization
- Infinite scroll for older threads
- Automatic cloud backup and 30-day recovery for deleted threads
- Instant thread opening: zero-delay loading with smooth Material Design transition animation

### 3.3 Input Area
- Bottom-center rounded rectangle input field with 8px radius and Material Design elevation shadow, styled exactly as shown in the uploaded home page reference image (file-aig01c6yjitc.png)
- Placeholder text: Ask Qazyen AI…
- Attachment icon (left) and voice input icon (right) with subtle gradient animations
- Send button with Material Design ripple effect and gradient styling (Cyan → Light Blue → Pink → White → Dark Blue → White)
- Smart suggestions and auto-complete
- Focus mode with expanded input area
- Sticky position at bottom of viewport

### 3.4 Flexible Menu Layout System

#### Layout Toggle
- Toggle button to switch between Circular Mode and Grid Mode
- Smooth Material Design transition animation on switch (under 300ms)
- System persists user layout preference across sessions
- Accessible from Advanced Settings and via dedicated toggle button

#### Circular Mode (Default)
- All menu buttons arranged in a circular pattern around a center iOS-style notch user profile panel
- Center profile panel features: circular avatar, user name and status, notification indicators, quick profile settings access
- **iOS-Styled Menu Button (Creator Identity Button):**
  - A dedicated iOS-styled circular menu button representing the creator (Muhhamed Yasin, known as Munaf) is present in the Circular Mode layout
  - Clicking this button opens an iOS Control Center-style control panel overlay with the following options:
    1. Home — navigate to main Home screen
    2. Profile — open user profile panel (avatar, name, status, quick settings)
    3. Light/Dark Mode — toggle between Light Mode and Dark Mode with immediate full UI adaptation
  - Control panel overlay: semi-transparent frosted-glass background, rounded module cards, smooth slide-up or expand animation (200ms ease-out)
  - Panel dismisses on tap/click outside or on pressing the button again
  - Button styling: iOS-style circular button with gradient (Cyan → Light Blue → Pink → White → Dark Blue → White), drop shadow, frosted-glass surface
- **Radial Context Menu on Button Click:**
  - When the user clicks any circular menu button, a secondary radial (circular) context menu expands outward from that button
  - The radial context menu contains exactly 7 options arranged in a circular arc or full circle around the clicked button:
    1. Home — returns user to the main Home screen
    2. Back — navigates back one level within the current module, or to Home if at top level
    3. Light/Dark — toggles between Light Mode and Dark Mode with immediate UI adaptation
    4. Settings — opens the Advanced Settings panel
    5. Profile — opens the user profile panel with avatar, name, status, and quick settings
    6. Feedback — opens a feedback submission form (text input, rating, submit button)
    7. Admin Mode — opens the Admin Mode login prompt (admin code: qazyen123)
  - Radial context menu opens with a smooth expand animation (scale from 0 to 1, 200ms ease-out) originating from the clicked button
  - Each option in the radial menu is a circular icon button with gradient styling (Cyan → Light Blue → Pink → White → Dark Blue → White) and a short text label beneath
  - Selecting any option executes the corresponding action and closes the radial menu with a smooth collapse animation (200ms ease-in)
  - Tapping/clicking outside the radial menu dismisses it without action
  - Radial menu options also have icon rotation on click: 360° fast spin, elastic ease-out, 300ms
  - Voice feedback plays on radial menu open and on option selection
- **Icon Rotation Behavior:**
  - All circular menu button icons continuously rotate in a slow, smooth circular motion during idle state (ambient rotation at approximately 2–4 RPM)
  - On click/tap, the icon accelerates into a fast spin animation (360° rotation within 300ms) with a satisfying elastic ease-out effect
  - The entire circular button ring can be manually rotated by the user via drag/swipe gesture — smooth inertial scrolling with momentum and natural deceleration
  - Rotation direction: clockwise by default; reversible by swipe direction
  - Each button icon also has an independent micro-rotation on hover (desktop) for visual feedback
  - All rotation animations run at 60 FPS minimum
- Circular menu buttons (arranged around center):
  - New Thread
  - Image Generation
  - Video Generation
  - PPT Maker
  - Video Editor
  - 3D Virtual Humanoid Robot
  - Dark/Light Mode Toggle
  - Note Summary
  - Voice Assistant
  - History
  - Task Manager
  - AI Calendar
  - Productivity Suite
  - Resume Analyzer
  - Prompt Generator
  - Advanced Settings
  - Reset App Data
- Touch-friendly large circular buttons optimized for all screen sizes
- All circular button icons: gradient Cyan → Light Blue → White → Dark Blue → Red → Silver → White

#### Grid Mode
- Traditional organized grid layout with 3–4 buttons per row depending on screen size
- User profile panel at top in horizontal layout (avatar left, name/status center, quick settings right)
- **iOS-Styled Menu Button (Creator Identity Button) in Grid Mode:**
  - Same iOS-styled creator button present in Grid Mode
  - Clicking opens the same iOS Control Center-style control panel with Home, Profile, and Light/Dark Mode Toggle options
  - Same animation, dismiss, and styling behavior as described in Circular Mode
- **Radial Context Menu on Button Click (Grid Mode):**
  - Same radial context menu behavior as Circular Mode applies in Grid Mode
  - When any grid button is clicked, the 7-option radial context menu expands outward from that button in a circular arc
  - Same 7 options: Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode
  - Same animation, dismiss, voice feedback, and icon rotation behavior as described in Circular Mode
- **Icon Rotation Behavior in Grid Mode:**
  - Icons rotate on click/tap with the same fast spin animation (360° within 300ms, elastic ease-out)
  - Subtle continuous slow rotation on idle (ambient rotation at approximately 2–4 RPM)
  - Hover state triggers gentle rotation acceleration on desktop
- Grid rows:
  - Row 1: New Thread, Image Generation, Video Generation, PPT Maker
  - Row 2: Video Editor, 3D Virtual Humanoid Robot, Dark/Light Mode Toggle, Note Summary
  - Row 3: Voice Assistant, History, Task Manager, AI Calendar
  - Row 4: Productivity Suite, Resume Analyzer, Prompt Generator, Advanced Settings
  - Row 5: Reset App Data
- Consistent button sizing, clear text labels, Material Design hover effects on desktop
- Scrollable grid for overflow content
- All grid button icons: gradient Cyan → Light Blue → White → Dark Blue → Red → Silver → White

#### Quick Access Circular Menu Button (iOS Control Center Style)
- A dedicated circular quick-access menu button is always visible on the Home screen and all feature module screens
- Single click/tap opens a panel styled after the iOS Control Center: semi-transparent frosted-glass blur background, rounded module cards, smooth slide-up or expand animation
- Panel contains at minimum the following options:
  - Home — navigate to main Home screen
  - User Profile — open user profile panel (avatar, name, status, quick settings)
  - Dark/Light Mode Toggle — toggle between Dark and Light Mode with immediate UI adaptation
- Additional quick-access controls may be included: Background Animation Toggle, Volume Slider, Settings shortcut
- Panel dismisses on tap/click outside or on pressing the circular button again
- Panel open/close animation: smooth scale and opacity transition (200ms ease-out / 150ms ease-in)
- Panel surface: semi-transparent frosted-glass over animated background gradient

#### Common Features (Both Modes)
- All buttons: gradient Cyan → Light Blue → Pink → White → Dark Blue → White
- All button icons: gradient Cyan → Light Blue → White → Dark Blue → Red → Silver → White
- **Icon rotation on click: 360° fast spin with elastic ease-out, 300ms duration, 60 FPS**
- **Ambient idle rotation: slow continuous circular spin at 2–4 RPM**
- **User-draggable rotation in Circular Mode: inertial swipe-to-rotate the entire button ring**
- **Radial context menu (7 options: Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode) opens on any button click in both modes**
- Voice feedback on button click
- Material Design smooth animations for all interactions
- Full keyboard navigation and screen reader accessibility
- User-customizable button order and visibility
- No billing, subscription, or paywall UI elements anywhere in the application

### 3.5 Radial Context Menu — Detailed Specification

#### Trigger
- Activated by clicking or tapping any menu button in either Circular Mode or Grid Mode
- The radial menu originates from the center of the clicked button and expands outward

#### Options (7 total, arranged in circular arc or full circle)
| # | Option | Icon | Action |
|---|--------|------|--------|
| 1 | Home | House icon | Navigate to main Home screen immediately |
| 2 | Back | Left-arrow chevron | Navigate back one level within current module; if at top level, return to Home |
| 3 | Light/Dark | Sun/Moon toggle icon | Toggle between Light Mode and Dark Mode with full UI and background gradient adaptation |
| 4 | Settings | Gear icon | Open Advanced Settings panel |
| 5 | Profile | Person/avatar icon | Open user profile panel (avatar, name, status, quick settings) |
| 6 | Feedback | Speech bubble icon | Open feedback form (text input, star rating 1–5, submit button, confirmation message) |
| 7 | Admin Mode | Shield/key icon | Open Admin Mode login prompt (input field for admin code qazyen123, rate-limited attempts) |

#### Visual Design
- Each option: circular button, 48–56dp diameter, gradient styling (Cyan → Light Blue → Pink → White → Dark Blue → White)
- Icon inside each button: gradient (Cyan → Light Blue → White → Dark Blue → Red → Silver → White)
- Short text label beneath each circular option button
- Radial arrangement: options distributed evenly in a 360° circle or upper/lower arc depending on button position on screen (avoids clipping at screen edges)
- Semi-transparent frosted-glass backdrop behind the radial menu to separate it visually from the main UI
- Animated background gradient remains visible through the frosted-glass backdrop

#### Animation
- Open: scale from 0 to 1 with staggered delay per option (each option appears 20ms after the previous), ease-out, total duration 200ms
- Close (on selection): selected option scales up briefly (1.1×, 80ms) then collapses with the rest (scale to 0, 150ms ease-in)
- Close (on dismiss): all options collapse simultaneously (scale to 0, 150ms ease-in)
- All animations run at 60 FPS

#### Interaction Rules
- Only one radial menu open at a time; opening a new one closes any existing open menu
- Keyboard: Tab navigates between options; Enter/Space selects; Escape dismisses
- Screen reader: each option announced with its label and action description
- Voice feedback: subtle audio cue on open and on selection

### 3.6 Animated Background Gradient System

#### Background Design
- The entire application background features a continuously animated, flowing gradient composed of the following colors in random organic movement:
  - Cyan (#00FFFF)
  - Light Cyan (#E0FFFF)
  - Dark Blue (#00008B)
  - Black (#000000)
  - White (#FFFFFF)
  - Silver (#C0C0C0)
- Animation behavior:
  - Colors flow and blend organically across the background surface in a slow, random, non-repeating pattern
  - Movement resembles aurora borealis or fluid ink diffusion — smooth, hypnotic, and non-distracting
  - Animation speed: slow and ambient (full cycle approximately 8–15 seconds per color wave)
  - No hard edges — all color transitions are soft and blended with high feathering
  - The gradient movement is randomized using a noise-based algorithm (e.g., Perlin noise or simplex noise) to ensure no two cycles look identical
  - Animation runs continuously at 60 FPS with GPU acceleration
  - In Dark Mode: darker tones (Dark Blue, Black, Silver) dominate; Cyan and White appear as accent highlights
  - In Light Mode: lighter tones (White, Light Cyan, Silver) dominate; Dark Blue and Black appear as subtle depth accents
- The animated background is rendered as the base layer beneath all UI components
- All UI panels, cards, sidebars, and modals use semi-transparent or frosted-glass surfaces so the animated background remains subtly visible through them
- Background animation does not interfere with readability — sufficient contrast maintained at all times
- Performance: background animation uses CSS/WebGL shader-based rendering for minimal CPU impact; degrades gracefully to a static gradient on low-performance devices

#### Background Animation Toggle (Home Page)
- A dedicated toggle control is available on the Home page (accessible via Advanced Settings and as a quick-access control on the Home screen) to enable or disable the animated background gradient
- When disabled: the background reverts to a static gradient using the same color palette — no animation, no movement
- When re-enabled: the animated gradient resumes from a fresh random state
- Toggle state is persisted across sessions via local storage

#### Background Image Customization
- Users can replace the default animated gradient background with a custom background image throughout the entire application
- Supported image formats: JPG, PNG, WEBP
- Background image customization is accessible via Advanced Settings → Background section
- When a custom background image is set, the animated gradient overlay is rendered on top at reduced opacity (default 30%, user-adjustable from 0% to 100%)
- Users can reset to the default animated gradient background at any time via a Reset to Default button
- Custom background image is stored in the database and synced across devices
- Background image preview is shown in real-time within the settings panel before applying

### 3.7 Back to Home Button — Freely Movable & Always Accessible

#### Core Behavior
- Every feature module screen includes a Back to Home button that is always accessible and freely movable by the user anywhere on the screen
- The Back to Home button is rendered immediately when the user enters any feature module — present from the first frame, never hidden or delayed
- Clicking/tapping the Back to Home button returns the user to the main Home screen

#### Movability
- The Back to Home button is a freely draggable floating button — the user can drag and reposition it to any location on the screen
- The button floats above all content layers (highest z-index) and is always visible regardless of scroll position
- Default placement: top-left corner of the feature module screen on both desktop and mobile
- After the user drags the button to a new position, that position is persisted per session via local storage
- On mobile, the button snaps to the nearest screen edge (left or right) after being released, with a smooth snap animation (150ms ease-out)
- On desktop, the button can be freely placed anywhere within the viewport without edge snapping
- A long-press (500ms) on mobile or right-click on desktop reveals a context option: Reset Position
- While being dragged, the button displays a subtle scale-up (1.1×) and drop-shadow elevation increase
- On release, the button returns to normal scale (1.0×) with a smooth spring animation (200ms)

#### Visual Design
- Left-pointing chevron or arrow icon with gradient styling (Cyan → Light Blue → White)
- Floating button style: circular or pill-shaped, gradient background (Cyan → Light Blue → White), drop shadow for elevation, semi-transparent frosted-glass surface
- Button diameter: 48–56dp (mobile), 40–48px (desktop)
- Material Design ripple effect on click
- Always rendered above all other UI layers

### 3.8 3D Virtual Humanoid Robot Assistant (QAZYEN)

#### Core Design Philosophy
- 100% photorealistic 3D animated humanoid robot appearance matching the uploaded image.png exactly in every detail
- Unity 3D game-engine quality with cinematic rendering, PBR materials, and post-processing effects
- Shiny metallic aluminium body with polished chrome-like reflective finish — 100% matching the uploaded image.png
- Robot background environment: laboratory setting with high-fidelity 3D lab environment
- WebGL-optimized for smooth performance across all browsers and operating systems
- Silent on startup — robot speaks only when user initiates interaction
- 100% operational: the QAZYEN AI API must be correctly and stably integrated with the backend system

#### Robot Hand Movement Constraints (Critical Precision)
- **Greeting Sequence — Strictly Upward Hand Movement:**
  - During the greeting/Hi gesture sequence, the robot's hand(s) must move in a strictly upward direction: 100% vertical movement only
  - Hand(s) must not rotate at all during the greeting sequence: 0% rotation — the hand orientation remains completely fixed throughout the entire greeting motion
  - The greeting gesture combines:
    - Hand-to-Mouth Movement: the hand motion begins near the mouth area of the robot's face
    - Waving Hi Motion: the overall arm/hand movement mimics a human waving Hi, but strictly constrained to upward-only vertical movement with zero rotation
  - The hand rises vertically from the mouth area upward in a smooth, natural arc — no lateral rotation, no wrist twist, no finger rotation during this sequence
  - All other body movements (head tracking, torso, idle breathing) remain natural and professional
- **General Movement Constraints:**
  - All hand movements outside the greeting sequence are 100% professional with smooth, precise, natural motion curves
  - Professional gesture range: waving, pointing, thumbs up, open palm, closed fist, counting, peace sign, stop, beckoning, explanatory gestures
  - All body movements are 100% professional — including walking gait, idle breathing animation, weight shifting, head tracking, torso rotation, and gesture transitions

#### Physical Design
- Body: Humanoid proportions 100% matching the uploaded image.png; shiny metallic aluminium torso with articulated shoulder joints, streamlined mechanical frame, proportionate legs with hydraulic joints
- Head: Expressive humanoid face 100% matching the uploaded image.png with animated eyes (tracking, blinking, pupil dilation), articulated eyebrows, fully lip-synced animated mouth, smooth facial expression transitions
- Facial Expressions: Happy, Surprised, Thoughtful, Concerned, Neutral, Excited, Listening, Speaking, Determined, Powerful
- Torso: Glowing power core visible through metallic aluminium chest panels
- Arms and Hands: Five-finger articulated hands with full professional gesture range
- Legs: Proportionate metallic aluminium legs with smooth hip and knee joints; natural humanoid walking gait

#### QAZYEN AI API Integration
- Powered by killing AI or OpenAI GPT-4 with automatic key rotation
- API integration is stable, correctly configured, and 100% operational at all times
- Automatic retry with exponential backoff (up to 5 retries) on any API call failure
- Seamless fallback to backup API provider on persistent failure
- API key balance monitored in real-time; automatic rotation to backup keys before exhaustion
- Admin dashboard displays QAZYEN API health, usage, and key rotation status
- Service uptime indicator displayed in Admin Dashboard: Online / Offline / Degraded

#### Background Environment: Laboratory
- High-fidelity 3D laboratory environment: clean white and grey surfaces, scientific workbenches, holographic display panels, ambient blue-tinted laboratory lighting, depth-of-field blur on background elements
- Environment renders at 60 FPS minimum with LOD optimization
- User can optionally switch background environment (modern office, futuristic space, home, industrial) via customization settings, with laboratory as the default

#### Color-Changing Animation System
- Gradient Color System: Cyan → Light Blue → Pink → White → Dark Blue → White
- Status-based color states: Cyan (Operational ready), Light Blue (Processing), Pink (Creative mode), White (Standby), Dark Blue (Deep thinking), Red (Alert/Titan), Amber (Caution), Purple (Special operations), Gold (Maximum power)

#### Voice and Audio
- AI-generated robotic male voice with deep powerful bass, resonant tone, and authoritative presence
- Emotion-adaptive voice modulation synchronized with facial expressions and gestures
- 46+ language support including Hindi, Arabic, Urdu, Marathi
- Multiple voice profiles: Professional, Friendly, Calm, Technical, Enthusiastic, Powerful
- Mouth lip-sync perfectly synchronized with voice output in real-time
- Silent on startup; first interaction triggers greeting: Hello! I am Qazyen, your AI assistant. I am here to help you with anything you need. How can I assist you today?
- Creator response: My creator is Muhhamed Yasin and everyone knows him by the name Munaf

#### Interactive Modes
- Interview Mode: Structured professional interviews, advanced NLP, context-aware follow-up, real-time feedback with upward hand gestures (strictly vertical, 0% rotation), detailed session summary, saved to dedicated thread
- Voice Assistant Mode: Always-ready without wake word, JARVIS-like proactive assistance, context retention across multiple interactions
- Customization: Lighting pattern and accessory customization, personality modes, camera angle, zoom, and background environment selection

### 3.9 Advanced AI Image Generation — Multi-Service Panel

#### Panel Overview
- A dedicated, clearly separated Image Generation panel with its own full-screen UI
- The panel lists all available lifetime-free AI image generation services with individual status indicators
- Each service displays a real-time status badge: Online (green) / Offline (red) / Degraded (amber)
- Users can select which service to use for each generation request via a service selector dropdown or tab row
- All listed services are verified lifetime-free and fully operational; any service failing the lifetime-free verification is automatically hidden from the user-facing list
- Back to Home floating button freely draggable and immediately visible on entry
- Animated background visible behind panel surfaces

#### Integrated Image Generation Services
| # | Service | Model/API | Status Indicator | Notes |
|---|---------|-----------|-----------------|-------|
| 1 | geminit AI | geminit image generation API | Online / Offline / Degraded | Primary service; dedicated API stably integrated |
| 2 | Gemini (Google) | Gemini image generation API | Online / Offline / Degraded | Stably integrated; lifetime-free tier |
| 3 | Stable Diffusion (via Hugging Face Inference API) | stabilityai/stable-diffusion-xl-base-1.0 | Online / Offline / Degraded | Lifetime-free via Hugging Face free tier |
| 4 | FLUX.1-schnell (via Hugging Face Inference API) | black-forest-labs/FLUX.1-schnell | Online / Offline / Degraded | Lifetime-free via Hugging Face free tier |
| 5 | Pollinations AI | pollinations.ai image API | Online / Offline / Degraded | Fully free, no API key required, no rate-limit paywall |

- Sora 2 is not listed and is permanently excluded from image generation options as it does not meet the lifetime-free criteria
- Admin can add, remove, or update API keys for any listed service via the Admin Dashboard
- Automatic failover: if the selected service is offline, the system silently retries with the next available online service

#### Core Image Generation Features
- **100% operational AI-powered image generation: all image generation requests are successfully processed and delivered with zero service failures**
- **All API key errors eliminated: automatic key rotation ensures uninterrupted service at all times**
- **Admin can view and update API keys for all image generation services via the Admin Dashboard**
- **100% free, lifetime access — no cost to end-user, no subscription or paywall**
- Text-to-Image, Image-to-Image transformation, style transfer
- Background removal, AI upscaling to 4K, image enhancement
- Batch generation, custom aspect ratios, lighting control, mood selection, camera angle presets
- Modes: Realistic, Anime, 3D, Cinematic
- Face preservation engine, image editing layer
- Upload support: JPG, PNG, WEBP
- Image analysis: content, style, and feature recognition
- Encrypted cloud history, multi-format download
- Integrated chatbox with voice input support
- All previously available advanced features (high-resolution outputs, complex prompt interpretation, varied artistic styles) are fully retained and mapped to all integrated lifetime-free services

#### Lifetime-Free Verification & Monitoring
- A background monitoring service runs periodic health checks (every 5 minutes) against each image generation service endpoint
- Health check verifies: API reachability, response validity, and absence of paywall/billing gate responses
- If a service returns a billing-required or quota-exceeded response, it is automatically marked Offline and hidden from the user-facing service list
- Admin Dashboard displays the last verified timestamp and lifetime-free status for each service
- Admin receives a silent internal alert (logged to admin dashboard only) when any service changes status

### 3.10 Professional AI Video Generation Engine — Multi-Service Panel

#### Panel Overview
- A dedicated, clearly separated Video Generation panel with its own full-screen UI
- The panel lists all available lifetime-free AI video generation services with individual status indicators
- Each service displays a real-time status badge: Online (green) / Offline (red) / Degraded (amber)
- Users can select which service to use for each generation request via a service selector dropdown or tab row
- All listed services are verified lifetime-free and fully operational; any service failing the lifetime-free verification is automatically hidden from the user-facing list
- Sora 2 is permanently removed and excluded from all video generation options as it does not meet the lifetime-free criteria
- Back to Home floating button freely draggable and immediately visible on entry
- Animated background visible behind panel surfaces

#### Video Specifications
- **Duration:** User-configurable between 5 seconds and 10 seconds (slider or input field, integer steps: 5, 6, 7, 8, 9, 10 seconds)
- **Resolution:** User-selectable output resolution:
  - 480p
  - 720p
  - 1080p
  - 2K
  - 4K
- Duration and resolution selectors are prominently displayed in the Video Generation panel UI before generation is initiated
- Selected duration and resolution are passed as parameters to the active video generation service API

#### Integrated Video Generation Services
| # | Service | Model/API | Status Indicator | Notes |
|---|---------|-----------|-----------------|-------|
| 1 | nand AI | nand video generation API | Online / Offline / Degraded | Primary service; dedicated API stably integrated |
| 2 | Pollinations AI Video | pollinations.ai video API | Online / Offline / Degraded | Fully free, no API key required |
| 3 | Hugging Face Video (zeroscope) | zeroscope_v2_576w via Hugging Face Inference API | Online / Offline / Degraded | Lifetime-free via Hugging Face free tier |

- Sora 2 is not listed and is permanently excluded from all video generation options
- Admin can add, remove, or update API keys for any listed service via the Admin Dashboard
- Automatic failover: if the selected service is offline, the system silently retries with the next available online service

#### Core Video Generation Features
- **100% operational AI-powered video generation: all video generation requests are successfully processed and delivered with zero service failures**
- **All API key errors eliminated: automatic key rotation ensures uninterrupted service at all times**
- **Admin can view and update API keys for all video generation services via the Admin Dashboard**
- **100% free, lifetime access — no cost to end-user, no subscription or paywall**
- Text-to-Video, Image-to-Video, Video-to-Video transformation
- Scene expansion, motion control, camera pan simulation, cinematic presets
- Quality output at selected resolution (480p, 720p, 1080p, 2K, 4K) with frame interpolation and AI color grading
- Auto background music, AI subtitles, scene stitching, auto storyboard generation
- GPU acceleration, parallel rendering, cloud distributed processing
- Progressive preview playback during rendering
- All previously available advanced features (video editing capabilities, varied styles, high-quality outputs) are fully retained and mapped to all integrated lifetime-free services

#### Lifetime-Free Verification & Monitoring
- Same background monitoring service as image generation: periodic health checks every 5 minutes per video service endpoint
- Health check verifies: API reachability, response validity, and absence of paywall/billing gate responses
- If a service returns a billing-required or quota-exceeded response, it is automatically marked Offline and hidden from the user-facing service list
- Admin Dashboard displays the last verified timestamp and lifetime-free status for each video service
- Admin receives a silent internal alert (logged to admin dashboard only) when any service changes status

### 3.11 File Upload & Multi-Modal AI Processing
- Users can send, upload, or paste files for AI processing across all applicable modules
- Supported upload methods: file picker dialog, drag-and-drop, clipboard paste
- Supported file types: PDF, DOCX, TXT, JPG, PNG, WEBP, MP4, MOV, AVI, and other common formats
- Multi-modal AI services integrated for file processing:
  - geminit AI: document understanding, image analysis, video analysis
  - killing AI / OpenAI GPT-4 (with vision): image and document analysis
  - Perplexity AI: research and document summarization
  - All integrated AI services for file analysis are 100% operational with zero failures
- File processing capabilities:
  - Document analysis: summarization, key insight extraction, Q&A over document content
  - Image analysis: content recognition, style analysis, feature extraction
  - Video analysis: scene description, content summarization
  - Code file analysis: review, explanation, optimization suggestions
- File upload is available in the main chat interface, Image Generation module, Video Generation module, Note Summary module, Resume Analyzer module, and Video Editor module
- File upload scanning and validation before processing
- Encrypted storage of uploaded files
- Upload progress indicator with non-blocking UI
- File attachment preview in chat thread
- Inline upload error hint (non-blocking): Upload could not complete — please try a different file

### 3.12 PPT Maker (Gamma AI Style)
- AI-powered presentation creation modeled after the Gamma AI platform workflow
- User provides a text prompt or voice input describing the presentation topic and desired content
- AI automatically generates a complete, structured PowerPoint-style presentation:
  - Automatic slide layout generation based on content type
  - Smart content organization across slides
  - Professional template library with theme customization
  - Image and icon integration per slide
  - Chart and graph generation from data prompts
  - Transition effects and animation presets
- Gamma-style generation flow:
  - Step 1: User enters a prompt (e.g., Create a 10-slide presentation on climate change)
  - Step 2: AI generates an outline for user review/edit before full generation
  - Step 3: Full presentation generated with all slides, layouts, and visuals
  - Step 4: User can edit individual slides, regenerate specific slides, or adjust theme
- Export: PPTX, PDF
- Real-time preview, collaborative editing support
- Integrated chatbox with voice input
- Back to Home floating button freely draggable and immediately visible on entry
- Saved to thread history

### 3.13 Video Editor
- Timeline-based multi-track video and audio editing
- Trim, cut, split, merge, transition effects library
- Text and title overlays, filter and color grading, audio mixing and enhancement
- Speed control (slow motion, time-lapse), green screen (chroma key), picture-in-picture
- Export: MP4, MOV, AVI at 720p / 1080p / 2K / 4K
- Real-time preview, undo/redo, project auto-save

### 3.14 Smart Note & Knowledge Engine
- Document upload: PDF, DOCX, TXT
- Smart summarization: bullet summary, academic summary, key insights, keyword extraction
- Mind-map generation, flashcard generator, quiz generator
- Automatic summary generation on upload

### 3.15 Voice Assistant 2.0
- No wake word required — always-on voice detection with optimized battery usage
- Waits for user to finish speaking before processing
- Natural conversation memory with context continuity
- 46+ language support with multilingual greetings and accent adaptation
- Emotion-based tone response, voice speed customization
- Silent on startup; responds only when user initiates
- First engagement greeting: Hello! I am Qazyen, your AI assistant. I am here to help you with anything you need. How can I assist you today?
- Bass-enhanced AI-generated robotic male voice, 100% error-free synthesis
- Voice feedback for all button clicks and user actions
- JARVIS-like proactive assistance, Alexa and Siri-like capabilities
- 3D humanoid robot visual feedback synchronized with speech
- API: Lifetime free ElevenLabs or Google Cloud TTS with auto key rotation
- Service uptime indicator in Admin Dashboard: Online / Offline / Degraded

### 3.16 AI Productivity Suite
- Task Manager with smart reminders
- AI calendar assistant and meeting summarizer
- Email drafting assistant, resume builder, cover letter generator
- LinkedIn post generator, blog creator
- Resume Analyzer: upload PDF/DOCX for AI-powered analysis, feedback, and optimization
- Prompt Generator: create optimized prompts for various AI tasks

### 3.17 Smart History & Memory Management
- All interactions automatically stored in database with thread-based organization
- Full-text search across all threads with AI tagging and date-based filtering
- Media preview grid, folder organization, starred items
- History scope: Q&A, generated images, generated videos, note summaries, interview sessions, PPT projects, video editing projects
- Sidebar display with Material Design styling and instant thread opening
- Export all data, secure backup, thread metadata display

### 3.18 Login System & Admin Access
- No user registration required — open access for all users
- Admin Mode available via admin code: qazyen123 (stored securely server-side)
- Correct code grants access to full admin dashboard with all features activated
- Failed login attempts rate-limited to prevent brute force
- Admin Mode access points:
  - Radial context menu option (Admin Mode) on any menu button in both Circular and Grid modes
  - Dedicated Admin Mode access button/link visible on the Home page — accessible and usable only by authorized administrators (button is visible on the Home screen; access is gated by the admin code qazyen123)
  - Admin login prompt overlay: input field for admin code, submit button, rate-limited failed attempts, success grants full admin dashboard access

### 3.19 Admin Dashboard
- **Active User Monitoring:** Real-time dashboard showing a list of all currently active/operating users — display includes user identifier, active feature module, session start time, and activity status
- **User Role Management:**
  - Admin can view all registered user accounts and their current roles
  - Admin can change a user's role from Administrator to regular User
  - Admin cannot be demoted by any User — only an Admin can demote another Admin
  - Role changes take effect immediately and are logged in the audit trail
- **API Key Management:**
  - Admin can view, update, and rotate API keys for all integrated services:
    - geminit AI (Image Generation)
    - Gemini (Google) (Image Generation)
    - Stable Diffusion via Hugging Face (Image Generation)
    - FLUX.1-schnell via Hugging Face (Image Generation)
    - Pollinations AI (Image Generation)
    - nand AI (Video Generation)
    - Pollinations AI Video (Video Generation)
    - Hugging Face Video / zeroscope (Video Generation)
    - killing AI (Conversational AI / QAZYEN)
    - ElevenLabs / Google Cloud TTS (Voice Synthesis)
    - Perplexity AI (Research)
  - API key input fields are masked by default; admin can reveal/edit
  - Save and rotate buttons per service
  - Real-time API health status indicator per service: Online / Offline / Degraded
  - Last verified timestamp and lifetime-free status displayed per service
  - All documentation, labels, and settings panels within the Admin Dashboard reflect the backend services (killing AI, nand AI, geminit AI, and all additional lifetime-free services)
- **AI Service Comprehensive Audit Panel:**
  - Admin can trigger a manual full-system audit of all AI services at any time
  - Audit checks: API reachability, response validity, lifetime-free status, key validity, and error rate
  - Audit results displayed per service with pass/fail status and last audit timestamp
  - Proactive error detection: system automatically flags any service with error rate above 1% in the last 24 hours
  - Admin can view detailed error logs per service, including error type, timestamp, and auto-recovery action taken
- User analytics, feature activation control, AI usage tracking
- Performance dashboard, server load monitor, abuse detection
- Audit logs, system notifications
- Automatic API key rotation and upgrade system
- API balance monitoring with automatic switching
- Real-time error logs (surfaced to admins only, never to end users)
- Background image customization management
- No billing, subscription, or paywall management panels

### 3.20 Advanced Settings
- App Volume Control: Material Design slider
- Activity Monitor: usage statistics display
- Voice Settings: voice profile and parameter customization
- Notification Settings, Performance Settings, Privacy Controls
- Menu Layout Mode: toggle between Circular Mode and Grid Mode
- Background Settings:
  - Toggle to enable or disable the animated background gradient
  - Background image upload: replace the default animated gradient with a custom background image (JPG, PNG, WEBP)
  - Gradient overlay opacity slider (0%–100%) when a custom background image is set
  - Reset to Default button: restores the default animated gradient background
  - Real-time background preview within the settings panel
- Reset App Data: complete data reset with confirmation dialog
- Real-time preview of all setting changes
- No billing, subscription, or paywall settings

### 3.21 Reset App Data
- Clears all conversation threads and history from database
- Removes all generated images, videos, PPTs, note summaries, interview sessions, video editing projects
- Resets all user preferences and settings to default (including menu layout → Circular Mode, background → default animated gradient)
- Confirmation dialog before execution
- Progress indicator and completion message
- Completes within 5 seconds

### 3.22 Automatic API Key Management
- Real-time monitoring of API key balance and usage for all integrated services
- Automatic detection of insufficient balance errors
- Seamless rotation to backup API keys without service interruption
- Automatic tier upgrade when needed
- Admin dashboard displays API key health and status for all services
- Automatic error recovery, retry mechanisms, and fallback providers
- Zero downtime transitions
- Covers all AI services: Conversational AI (killing AI / GPT-4), Image Generation (geminit AI, Gemini, Stable Diffusion, FLUX.1-schnell, Pollinations AI), Video Generation (nand AI, Pollinations AI Video, Hugging Face zeroscope), QAZYEN AI, Voice Synthesis (ElevenLabs / Google Cloud TTS), File Processing AI

### 3.23 Comprehensive AI Service Reliability & Error Resolution System

#### Proactive Service Monitoring
- A background service health monitor runs continuously, performing health checks every 5 minutes against all AI service endpoints
- Health check protocol per service:
  - Step 1: Send a lightweight ping/test request to the service API endpoint
  - Step 2: Validate response structure and content for correctness
  - Step 3: Verify absence of billing-required, quota-exceeded, or paywall responses
  - Step 4: Update service status (Online / Offline / Degraded) in real-time
  - Step 5: Log result with timestamp to admin dashboard
- If a service transitions from Online to Offline or Degraded:
  - Automatic failover to the next available service in the priority list is triggered immediately
  - Admin dashboard receives a silent internal alert with service name, error type, and timestamp
  - The affected service is hidden from the user-facing service selector until it recovers
- If a service recovers (returns to Online status):
  - It is automatically re-added to the user-facing service selector
  - Admin dashboard logs the recovery event

#### Proactive Error Detection & Auto-Fix
- All API call failures trigger automatic silent retry with exponential backoff (up to 5 retries before switching to fallback provider)
- Error classification system:
  - Class A (Transient): network timeout, temporary server error → auto-retry with backoff
  - Class B (Key/Auth): invalid API key, key exhausted → auto-rotate to backup key
  - Class C (Paywall/Quota): billing required, quota exceeded → mark service Offline, switch to next free service
  - Class D (Structural): API endpoint changed, response format changed → log to admin for manual review; fallback to next service
- All error events are logged to the admin dashboard with: service name, error class, error message, timestamp, auto-recovery action taken, and resolution status
- Admin can view a dedicated Error Resolution Log in the Admin Dashboard with filtering by service, error class, date range, and resolution status

#### Virtual Qazyen (3D Robot) — Service Reliability Fix
- The Virtual Qazyen / 3D Robot Assistant is identified as a previously non-functional service
- Fix implementation:
  - QAZYEN AI API (killing AI) integration is re-validated and re-tested end-to-end
  - API key is verified as valid and active; backup key slot is populated
  - WebGL rendering pipeline is validated across all target browsers (Chrome, Firefox, Safari, Edge)
  - 3D model loading is tested with progressive low-poly placeholder to ensure visible output within 3 seconds
  - Voice synthesis (ElevenLabs / Google Cloud TTS) integration is re-validated
  - Lip-sync pipeline is re-validated against voice output
  - All greeting sequence constraints (strictly upward 100% vertical hand movement, 0% rotation) are re-validated in the animation rig
  - End-to-end interaction test: user initiates → robot greets → user speaks → robot responds with voice + animation → session saved to thread
- Admin Dashboard displays QAZYEN service status: Online / Offline / Degraded with last verified timestamp

### 3.24 Error Handling & Resilience — No Failure Messages
- The application must never display the message: App modification failed. Please try again later or submit feedback. under any circumstances, on any screen, in any state, or for any reason.
- All errors, failures, and exceptions must be handled silently and automatically in the background — the app must always remain functional and visible to the user.
- Error handling strategy:
  - All API call failures trigger automatic silent retry with exponential backoff (up to 5 retries before switching to a fallback provider)
  - All network failures trigger automatic reconnection attempts in the background; the UI continues to display the last known state without any error overlay
  - All rendering failures (3D robot, animated background, video generation, image generation) trigger graceful degradation to a simplified fallback UI
  - All database errors trigger local cache fallback; data is queued for sync when connection is restored
  - All feature module load failures trigger silent reload attempts; if the module cannot load after 3 attempts, a minimal placeholder UI is shown — never a failure message
  - All WebGL/3D rendering errors fall back to a 2D animated avatar placeholder
  - All voice synthesis errors fall back to text-only response
  - All file upload errors display a non-blocking inline hint: Upload could not complete — please try a different file
  - All PPT, video, and image generation timeouts display a non-blocking progress indicator with a silent background retry
- The app must always show content, always remain interactive, and always provide a path forward for the user — zero dead ends, zero blocking error screens.
- Admin dashboard displays real-time error logs and API health status for monitoring — errors are surfaced to admins only, never to end users.

---

## 4. Interface Design

### 4.1 Overall Design Philosophy
- The uploaded home page reference image (file-aig01c6yjitc.png) is the primary and definitive visual reference for the Home screen layout, visual design, color treatment, component styling, spacing, and UI structure. The Home page must 100% match this uploaded image in every detail.
  - File name: home page reference image
  - File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260326/file-aig01c6yjitc.png
  - File usage: Primary and definitive visual reference for the Home screen
- The uploaded file qazyen app design.png continues to serve as the secondary visual reference for all non-Home screens and general component styling guidance.
  - File name: qazyen app design.png
  - File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260324/file-agrwcxmu7oxs.png
  - File usage: Secondary UI design reference for all feature module screens (non-Home screens)
- Material Design elevation, shadows, ripple effects, and easing curves applied consistently
- Gradient color scheme throughout entire app: Cyan → Light Blue → Pink → White → Dark Blue → White
- All buttons: gradient Cyan → Light Blue → Pink → White → Dark Blue → White
- All menu button icons: gradient Cyan → Light Blue → White → Dark Blue → Red → Silver → White
- Google Sans-style typography (Roboto or equivalent), 1.6 line height, 8px border radius
- Distraction-free, productivity-focused, content-first layout
- Adaptive dark and light modes with full UI color adaptation
- 60 FPS smooth animations throughout
- Unity 3D humanoid robot rendering integrated seamlessly with UI
- Flexible Circular and Grid menu layout system
- Animated background gradient: Cyan + Light Cyan + Dark Blue + Black + White + Silver in continuous random flowing movement, with user-controllable on/off toggle
- Background image customization: users can replace the default animated gradient with a custom background image throughout the entire application
- All UI panels and surfaces use semi-transparent or frosted-glass treatment
- All menu button icons rotate continuously (ambient slow spin) and spin on click (fast 360° elastic ease-out)
- Radial context menu (7 options) opens on any menu button click in both layout modes
- iOS Control Center-style quick access circular menu button available on all screens
- iOS-styled creator menu button (Muhhamed Yasin / Munaf) present in both Circular and Grid modes; clicking opens control panel with Home, Profile, and Light/Dark Mode Toggle
- Back to Home button: freely draggable floating button, always visible above all content layers, present and immediately rendered from the first frame upon entering any feature module screen
- No blocking error messages or failure overlays are ever displayed to the user
- No billing, subscription, or paywall UI elements anywhere in the application
- Admin Mode access point visible on the Home page, gated by admin code qazyen123
- Image Generation and Video Generation panels are clearly separated with distinct full-screen UIs, each displaying service status indicators (Online / Offline / Degraded) per service

### 4.2 Dark Mode
- Background: Animated gradient (Dark Blue, Black, Silver dominant tones with Cyan and White as accent highlights)
- Primary text: White (#FFFFFF) throughout entire app
- Secondary text: Light Gray (#E0E0E0)
- Accent: Google Blue (#4285F4) with gradient button and icon colors
- Borders: Soft gray lines; Material Design elevation shadows
- Toggle: Material Design switch with ripple effect and smooth transition animation

### 4.3 Light Mode
- Background: Animated gradient (White, Light Cyan, Silver dominant tones with Dark Blue and Black as subtle depth accents)
- Primary text: Black (#000000) throughout entire app
- Secondary text: Dark Gray (#333333)
- Accent: Google Blue (#4285F4) with gradient button and icon colors
- Toggle: Material Design switch with ripple effect and smooth transition animation

### 4.4 Application Logo and Robot Identity
- Qazyen wordmark in Google Sans-style typography
- Top header: circular humanoid robot avatar (100% matching the uploaded image.png, Unity 3D quality, shiny metallic aluminium body, professional movements)
- Robot style: shiny metallic aluminium, animated facial expressions, lip-synced mouth, upward professional hand gestures (strictly vertical, 0% rotation during greeting), gradient body lighting, laboratory background
- Status indicators around avatar during active operations
- AI name displayed under avatar: Qazyen AI
- Robot silent on startup until user initiates interaction

### 4.5 AI Services Panel UI — Image Generation & Video Generation

#### Image Generation Panel Layout
- Full-screen dedicated panel with frosted-glass surface over animated background
- Top section: panel title (AI Image Generation), service selector row or dropdown
- Service selector row: horizontal scrollable list of available services, each displayed as a pill/chip with:
  - Service name
  - Status badge: Online (green dot) / Offline (red dot) / Degraded (amber dot)
  - Selected state: highlighted with gradient border
- Center section: prompt input area (text field, voice input button, file upload button)
- Generation controls: aspect ratio selector, mode selector (Realistic / Anime / 3D / Cinematic), lighting control, mood selector
- Generate button: full-width gradient button (Cyan → Light Blue → Pink → White → Dark Blue → White) with ripple effect
- Output section: generated image display with download, share, edit, and regenerate options
- History strip: horizontal scroll of recent generations at bottom
- Back to Home floating button: freely draggable, immediately visible on entry

#### Video Generation Panel Layout
- Full-screen dedicated panel with frosted-glass surface over animated background
- Top section: panel title (AI Video Generation), service selector row or dropdown
- Service selector row: same pill/chip format as image generation with Online / Offline / Degraded status badges
- Center section: prompt input area (text field, voice input button, file upload button)
- Generation controls:
  - Duration selector: slider or segmented control (5s / 6s / 7s / 8s / 9s / 10s), clearly labeled
  - Resolution selector: dropdown or segmented control (480p / 720p / 1080p / 2K / 4K), clearly labeled
  - Scene style, motion control, camera preset selectors
- Generate button: full-width gradient button with ripple effect
- Output section: video player with progressive preview during rendering, download, share, and regenerate options
- Rendering progress indicator: non-blocking progress bar with estimated time remaining
- History strip: horizontal scroll of recent generations at bottom
- Back to Home floating button: freely draggable, immediately visible on entry

### 4.6 Visual Details and Micro-Interactions
- 8px border radius on all components
- Material Design elevation shadows and ripple effects
- Smooth transitions 200–300ms with Material Design easing
- AI typing animation: animated dots or waveform
- Smooth page transitions at 60 FPS
- Gradient color flow animations throughout interface
- Menu layout transition animation under 300ms
- Thread opening animation: smooth Material Design slide transition
- All interactive elements respond within 50ms with ripple feedback
- Icon rotation on click: 360° fast spin, 300ms, elastic ease-out, 60 FPS
- Icon ambient idle rotation: slow continuous circular spin at 2–4 RPM
- Circular button ring: user-draggable with inertial swipe-to-rotate
- Animated background gradient: continuous random flowing movement at 60 FPS using noise-based algorithm, with on/off toggle
- Radial context menu: smooth expand/collapse animation, staggered option appearance, frosted-glass backdrop
- iOS Control Center-style quick access panel: smooth slide-up/expand animation, frosted-glass surface
- iOS-styled creator button: smooth expand animation on click, frosted-glass control panel overlay
- Back to Home button: freely draggable floating button, top-left default placement, immediately visible and rendered from first frame upon entering any section, gradient styling, snap-to-edge on mobile, persisted position, slide-out transition on press
- Service status badges: real-time color-coded indicators with subtle pulse animation on Online state
- No error message overlays or failure modals ever rendered in the UI
- No billing, subscription, or paywall UI elements

---

## 5. Layout Structure

### 5.1 Home Screen Layout
- The Home screen layout, visual design, component arrangement, spacing, color treatment, and all UI elements must 100% match the uploaded home page reference image (file-aig01c6yjitc.png) in every detail.
  - File name: home page reference image
  - File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260326/file-aig01c6yjitc.png
- Every visual element visible in the uploaded home page reference image must be faithfully reproduced
- Animated background gradient flows continuously behind all Home screen elements as the base layer (unless disabled by user toggle)
- All Home screen surfaces use semi-transparent or frosted-glass treatment consistent with the uploaded reference
- Admin Mode access point: a dedicated Admin Mode button or link is visible on the Home screen, accessible only to authorized administrators via admin code qazyen123
- Background animation toggle control: accessible on the Home screen as a quick-access control
- iOS Control Center-style quick access circular menu button: visible and accessible on the Home screen
- iOS-styled creator button (Muhhamed Yasin / Munaf): visible on the Home screen in the Circular Mode layout
- No billing, subscription, or paywall elements on the Home screen

### 5.2 Desktop Layout (Non-Home Screens)

#### Left Sidebar
- Top: Qazyen branding area, hamburger menu icon
- New Chat button: prominent, gradient styled
- Navigation: Recent threads, Starred conversations, Settings, Help & Feedback
- Recent section: scrollable thread list with date grouping, search field, thread management options
- Bottom: user profile avatar, settings icon
- Additional: 3D Robot access button, Advanced Settings button, Reset App Data button, Menu Layout Mode toggle
- Sidebar surface: semi-transparent frosted-glass over animated background
- Layout and proportions must reference qazyen app design.png

#### Main Content Area
- Top navigation bar: center user profile panel, settings icon
- Back to Home floating button: freely draggable, default top-left placement, always rendered above all content from the first frame of any feature section
- Flexible Menu Layout System (Circular Mode and Grid Mode as described in Section 3.4)
- iOS Control Center-style quick access circular menu button: always visible
- iOS-styled creator button: always visible in Circular Mode
- Center content area: Qazyen branding centered, message column max-width 720–820px, thread title with edit option, generous white space, streaming AI responses, code blocks with syntax highlighting, source citation cards, related questions section
- Bottom suggestion chips: Material Design chip format with gradient accents
- Main area surface: semi-transparent over animated background
- Overall spatial layout must reference qazyen app design.png

#### Bottom Input Area
- Rounded input field (8px radius), Material Design elevation shadow, sticky position
- Placeholder: Ask Qazyen AI…
- Left: attachment icon with gradient styling
- Right: voice input icon with gradient styling, send button with ripple effect and gradient

### 5.3 Mobile Layout
- Full-screen chat view with slide-in sidebar drawer
- Thread list with swipe gestures for management
- Sticky bottom input with gradient buttons
- Large touch-friendly buttons with adequate spacing
- Smooth keyboard transitions, optimized for one-hand use
- Both Circular and Grid modes optimized for mobile screen sizes
- Radial context menu adapts to screen edges to avoid clipping
- iOS Control Center-style quick access panel adapts to mobile screen
- iOS-styled creator button adapts to mobile screen
- Responsive 3D humanoid robot rendering
- Back to Home floating button: freely draggable, snaps to nearest screen edge (left or right) on release with smooth snap animation (150ms ease-out), immediately visible and accessible in every feature section from the first frame, always rendered above all content layers
- Home screen on mobile must adapt the visual language of the uploaded home page reference image (file-aig01c6yjitc.png) to smaller screens while maintaining 100% visual fidelity to the reference
- Image Generation and Video Generation panels adapt to single-column layout on mobile; service selector scrolls horizontally; duration and resolution selectors stack vertically

---

## 6. Chat Experience

### 6.1 User Messages
- Google Blue rounded bubble with gradient styling
- Smooth fade-in animation, right-aligned
- Google Sans-style font; white text in dark mode, black in light mode

### 6.2 AI Messages
- Light gray bubble, full-width, comfortable line height
- Smooth streaming text animation with waveform indicator
- Copy, regenerate, edit prompt, and rating buttons with gradient styling on hover
- Source citations with numbered references and expandable source cards
- Robot avatar status indicators with animated expressions and gradient lighting
- Fully interactive: text selection, copy, link interaction, code block interaction

### 6.3 Code Blocks
- Dark background, syntax highlighting, horizontal scroll
- Copy button with gradient styling, clean monospace font

### 6.4 Search / Research Mode
- Toggle with gradient styling
- Citation numbers, clickable source links, clean source preview cards
- Real-time web search, academic paper access, news and current events

### 6.5 Smart Features
- Suggestion chips with gradient Material Design styling
- AI Thinking… animation effect
- Thread continuation suggestions and related thread recommendations

---

## 7. Interaction Logic

### 7.1 Application Startup
- Application loads instantly with optimized asset preloading and code splitting for fast initial render
- Robot visible in standby within laboratory background environment, with subtle idle animations — silent until user initiates
- Main interface displays: bottom input, sidebar with thread history, flexible menu layout (user preferred mode), animated background gradient flowing continuously (unless disabled)
- Home screen renders 100% matching the uploaded home page reference image (file-aig01c6yjitc.png) from the first frame
- No registration required; fast loading across all browsers and operating systems
- Thread list loads most recent first
- All buttons display gradient colors on startup; all icons begin ambient slow rotation on startup
- First user interaction with robot triggers greeting with strong bass voice, strictly upward vertical hand movement (0% rotation), and friendly facial expression
- Critical path assets (Home screen layout, background gradient, menu buttons) are prioritized and loaded first
- Non-critical assets (3D robot model, video generation modules) are lazy-loaded after initial render
- Service Worker caches core app shell for instant subsequent loads
- All static assets served via CDN with aggressive caching headers
- WebGL context initialized in background after first paint to avoid blocking UI
- Background service health monitor starts on application startup and begins periodic checks for all AI services

### 7.2 Thread Management
- New Chat button creates fresh thread
- Clicking any sidebar thread opens conversation instantly with zero delay and smooth Material Design transition
- Full conversation history loaded on thread open
- Thread renaming, pinning, archiving, deletion (with confirmation), search, filtering, sharing
- Auto-save and cross-device sync in real-time

### 7.3 Voice Interaction
- Always-ready without wake word
- Robot animates during voice interaction with facial expressions, upward professional hand gestures (strictly vertical, 0% rotation during greeting), gradient body lighting, and lip-synced mouth
- Listens to complete query before processing
- Responds with strong bass AI-generated robotic male voice
- 100% error-free voice output in 46+ languages
- Voice interactions saved to current thread

### 7.4 3D Robot Interaction (QAZYEN)
- Accessible via menu (Circular or Grid) or voice activation
- Appears in dedicated overlay with Material Design styling and animated background visible behind overlay
- Robot rendered within laboratory background environment by default
- Back to Home floating button visible and freely draggable in overlay immediately upon entering the robot section — rendered from the first frame
- Silent until user initiates; first engagement triggers greeting with strictly upward vertical hand movement (0% rotation)
- QAZYEN AI API is 100% operational; all interactions processed reliably with automatic retry and fallback on any failure
- Interview mode: structured interview with advanced NLP, context-aware follow-up, authority, upward professional hand gestures (strictly vertical, 0% rotation), session summary, saved to dedicated thread
- Voice assistant mode: always-ready, context retention, JARVIS-like proactive assistance
- Customizable personality, camera angle, and background environment (laboratory as default)
- 60 FPS minimum rendering

### 7.5 Image Generation Interaction
- User opens Image Generation panel from menu (Circular or Grid mode)
- Service selector displays all available lifetime-free services with real-time Online / Offline / Degraded status badges
- User selects preferred service (or leaves on default: geminit AI)
- User enters text prompt or uses voice input; optionally uploads a reference image
- User selects generation options: aspect ratio, mode (Realistic / Anime / 3D / Cinematic), lighting, mood
- User taps Generate button
- If selected service is Online: request is sent to that service API
- If selected service is Offline or Degraded: system automatically switches to the next available Online service; user sees a non-blocking inline notice: Switched to [service name] — your selected service is temporarily unavailable
- Generation progress: non-blocking animated indicator
- On success: generated image displayed in output section with download, share, edit, and regenerate options
- On failure after all retries: silent fallback to next service; if all services fail, a non-blocking inline message: Generation is taking longer than expected — retrying in background
- Generated image saved to thread history
- Back to Home floating button freely draggable and immediately visible throughout

### 7.6 Video Generation Interaction
- User opens Video Generation panel from menu (Circular or Grid mode)
- Service selector displays all available lifetime-free services with real-time Online / Offline / Degraded status badges
- User selects preferred service (or leaves on default: nand AI)
- User enters text prompt or uses voice input; optionally uploads a reference image or video
- User configures generation parameters:
  - Duration: slider or segmented control (5s / 6s / 7s / 8s / 9s / 10s)
  - Resolution: dropdown or segmented control (480p / 720p / 1080p / 2K / 4K)
  - Scene style, motion control, camera preset
- User taps Generate button
- If selected service is Online: request is sent to that service API with duration and resolution parameters
- If selected service is Offline or Degraded: system automatically switches to the next available Online service; user sees a non-blocking inline notice: Switched to [service name] — your selected service is temporarily unavailable
- Generation progress: non-blocking progress bar with estimated time remaining; progressive preview playback begins as soon as partial output is available
- On success: video displayed in output section with download, share, and regenerate options
- On failure after all retries: silent fallback to next service; if all services fail, a non-blocking inline message: Generation is taking longer than expected — retrying in background
- Generated video saved to thread history
- Back to Home floating button freely draggable and immediately visible throughout

### 7.7 Menu Layout Operations

#### Circular Mode
- Click any circular button → radial context menu expands with 7 options (Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode) in circular arrangement around the clicked button
- Radial menu opens with staggered scale-in animation (200ms ease-out)
- Selecting an option executes the action and closes the menu with collapse animation (150ms ease-in)
- Tapping outside the radial menu dismisses it without action
- Icons spin 360° on click with elastic ease-out (300ms)
- Icons rotate continuously in ambient slow spin during idle
- Entire button ring is user-draggable via swipe/drag with inertial momentum
- Voice feedback on click and on radial menu option selection
- iOS-styled creator button click → opens iOS Control Center-style control panel with Home, Profile, Light/Dark Mode Toggle

#### Grid Mode
- Click any grid button → same 7-option radial context menu expands from the clicked button
- Same animation, dismiss, and voice feedback behavior as Circular Mode
- Icons spin 360° on click with elastic ease-out (300ms)
- Icons rotate continuously in ambient slow spin during idle
- Hover effects on desktop
- iOS-styled creator button click → opens iOS Control Center-style control panel with Home, Profile, Light/Dark Mode Toggle

#### Quick Access Circular Menu Button (iOS Control Center Style)
- Single click/tap opens iOS Control Center-style panel
- Panel contains: Home, User Profile, Dark/Light Mode Toggle (plus optional additional controls)
- Panel dismisses on tap/click outside or on pressing the circular button again
- Smooth open/close animation (200ms ease-out / 150ms ease-in)

#### Layout Switching
- Smooth Material Design transition under 300ms; preference persisted; voice feedback
- Radial context menu behavior consistent across both modes

### 7.8 Radial Context Menu — Option Behaviors
- Home: Immediately navigates to main Home screen; closes radial menu with collapse animation
- Back: Navigates back one level within current module; if at top level, returns to Home; closes radial menu
- Light/Dark: Toggles Light/Dark Mode; animated background gradient shifts tone accordingly; full UI adapts; closes radial menu
- Settings: Opens Advanced Settings panel as an overlay or navigates to Settings screen; closes radial menu
- Profile: Opens user profile panel (avatar, name, status, quick settings access); closes radial menu
- Feedback: Opens feedback form overlay (text input field, 1–5 star rating, submit button, success confirmation message); closes radial menu
- Admin Mode: Opens Admin Mode login prompt overlay (input field for admin code, submit button, rate-limited failed attempts, success grants full admin dashboard access); closes radial menu

### 7.9 iOS-Styled Creator Button — Control Panel Behaviors
- Home: Immediately navigates to main Home screen; closes control panel
- Profile: Opens user profile panel (avatar, name, status, quick settings access); closes control panel
- Light/Dark Mode Toggle: Toggles between Light Mode and Dark Mode with immediate full UI adaptation; animated background gradient shifts tone accordingly; closes control panel

### 7.10 Back to Home Button — Movability & Navigation Behavior
- Back to Home button is a freely draggable floating button present and immediately visible upon entering every feature module screen — rendered from the first frame, never delayed or hidden
- The button floats above all content layers at all times (highest z-index)
- User can drag the button to any position on the screen at any time
- On mobile: button snaps to nearest screen edge (left or right) on release with smooth snap animation (150ms ease-out)
- On desktop: button can be freely placed anywhere within the viewport
- Dragged position is persisted per session via local storage
- Long-press (500ms) on mobile or right-click on desktop reveals Reset Position option
- While dragging: button scales up to 1.1× with elevated drop shadow; on release: springs back to 1.0× with 200ms spring animation
- Clicking Back to Home returns user to main Home screen
- Hardware/browser back button triggers same behavior

### 7.11 Dark / Light Mode Switching
- Accessible via radial context menu (Light/Dark option), iOS Control Center-style quick access panel, iOS-styled creator button control panel, or dedicated toggle button in menu
- Material Design toggle switch with smooth animation and ripple effect
- Light mode: animated background shifts to lighter tone dominance; black text throughout
- Dark mode: animated background shifts to darker tone dominance; white text throughout
- Voice feedback on mode switch

### 7.12 Admin Mode
- Accessible via radial context menu (Admin Mode option) on any menu button, or via dedicated Admin Mode access point on the Home page
- Admin code qazyen123 grants full feature access
- API key management for killing AI, nand AI, geminit AI, Gemini, Stable Diffusion, FLUX.1-schnell, Pollinations AI (image), Pollinations AI Video, Hugging Face zeroscope, ElevenLabs/Google Cloud TTS, Perplexity AI
- Active user monitoring dashboard
- User role management (Admin can demote another Admin to User; Users cannot demote Admins)
- Rate-limited failed login attempts
- Home page Admin Mode access point is visible on the Home screen but access is gated by the admin code
- AI Service Audit Panel: manual audit trigger, per-service health status, lifetime-free verification status, error resolution log
- All internal documentation, error messages, and settings panels within Admin Mode reflect the backend services (killing AI, nand AI, geminit AI, and all additional lifetime-free services)

### 7.13 Background Settings Interaction
- Animated background toggle: user taps/clicks the background animation toggle on the Home screen or in Advanced Settings; toggle state switches immediately; background transitions smoothly between animated and static states; toggle state persisted via local storage
- Background image customization: user opens Advanced Settings → Background section; user uploads a custom background image (JPG, PNG, WEBP) via file picker or drag-and-drop; real-time preview shown in settings panel; user confirms; custom image is applied globally across all screens; gradient overlay opacity slider adjusts the blend; Reset to Default button restores the default animated gradient

### 7.14 Feature Interactions
- Image Generation (multi-service): dedicated full-screen panel, service selector with status badges, prompt input, voice input, file upload, generation controls, gradient Material Design UI, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread; 100% operational AI-powered generation across all listed lifetime-free services; automatic failover between services; 100% free lifetime access
- Video Generation (multi-service): dedicated full-screen panel, service selector with status badges, prompt input, voice input, file upload, duration selector (5–10s), resolution selector (480p / 720p / 1080p / 2K / 4K), progressive preview, gradient UI, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread; 100% operational AI-powered generation across all listed lifetime-free services; automatic failover between services; 100% free lifetime access; Sora 2 permanently excluded
- PPT Maker (Gamma-style): prompt input → AI outline generation → full presentation generation → edit/export flow, voice input, real-time preview, template selection, export PPTX/PDF, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread
- Video Editor: timeline interface, upload, effects, real-time preview, multi-format export, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread
- Resume Analyzer: upload PDF/DOCX, AI analysis, feedback, optimization suggestions, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread
- Prompt Generator: select use case, generate optimized prompts, copy, animated background visible, Back to Home floating button freely draggable and immediately visible on entry, saved to thread
- Advanced Settings: volume slider, activity monitor, voice settings, notification/privacy/performance controls, menu layout toggle, background settings (animation toggle, image upload, opacity slider, reset), reset app data, animated background visible, Back to Home floating button freely draggable and immediately visible on entry; no billing or subscription settings
- Reset App Data: confirmation dialog, clears all data, returns to default Circular Mode and default animated gradient background within 5 seconds
- History Management: searchable/filterable thread list, date grouping, management options, instant thread opening, animated background visible, Back to Home floating button freely draggable and immediately visible on entry
- All feature modules: any internal error, API failure, rendering issue, or unexpected exception is handled silently and automatically — the app remains fully visible, interactive, and functional at all times; no failure messages or error overlays are ever shown to the user

### 7.15 Global Error Handling Behavior
- The message App modification failed. Please try again later or submit feedback. is permanently suppressed and must never appear anywhere in the application under any condition.
- All runtime errors, unhandled promise rejections, network failures, API errors, rendering exceptions, and module load failures are caught by a global error boundary and handled silently.
- Global error boundary behavior:
  - Catches all component-level errors and rendering exceptions
  - On error: the affected component is silently replaced with its last known good state or a minimal placeholder — the rest of the app continues functioning normally
  - No error message, no failure modal, no toast notification referencing a failure is shown to the user
  - Error details are logged silently to the admin dashboard for monitoring purposes only
- Network failure handling:
  - All fetch/API calls wrapped in try-catch with automatic retry logic (exponential backoff, up to 5 retries)
  - On persistent failure: the feature gracefully degrades to offline/cached mode; a subtle non-blocking inline indicator may appear within the specific feature area only (e.g., Reconnecting… in small text)
  - The main app shell, navigation, and all other features remain fully functional
- WebGL/3D rendering failure handling:
  - If WebGL context is lost or 3D rendering fails, the robot section falls back to a 2D animated avatar
  - The fallback is seamless — no error message is shown
- The app must always render something useful — zero blank screens, zero dead ends, zero blocking error states visible to the user.

---

## 8. Security Requirements

- TLS 1.3 for all data in transit; AES-256 for data at rest
- Admin code stored and validated server-side; failed attempts rate-limited; JWT sessions
- **API Key Security:**
  - All API keys (geminit AI, Gemini, Stable Diffusion, FLUX.1-schnell, Pollinations AI, nand AI, Pollinations AI Video, Hugging Face zeroscope, killing AI, ElevenLabs, Google Cloud TTS, Perplexity AI) are stored encrypted server-side
  - API keys are never exposed to the client or end users
  - Only authenticated admins can view (masked), update, or rotate API keys via the Admin Dashboard
  - API key fields in the Admin Dashboard are masked by default; admin must explicitly reveal to view
  - All API key changes are logged in the audit trail with timestamp and admin identifier
- Input validation and sanitization against SQL injection and XSS
- File upload scanning and validation
- Rate limiting on API endpoints against DDoS
- Firewall rules, network monitoring, secure API key rotation policies
- GDPR and CCPA compliance; data anonymization layer; audit logs
- Root/jailbreak detection, certificate pinning, secure on-device storage
- Regular security audits, penetration testing, dependency updates, code obfuscation
- **Admin password (qazyen123) is hidden and stored securely server-side; it is never transmitted in plaintext or exposed in client-side code**

---

## 9. Performance Requirements

### 9.1 Core Metrics
- Application initial load: under 2 seconds on standard broadband; under 4 seconds on 3G
- First Contentful Paint (FCP): under 1 second
- Time to Interactive (TTI): under 2 seconds
- Chat response: under 2 seconds
- 60 FPS animations throughout including animated background gradient
- 3D robot rendering: 60 FPS minimum, loading under 3 seconds
- Database query: under 500ms; thread list load: under 1 second
- Thread switching: under 100ms (zero perceived delay)
- Click response: under 50ms
- PPT generation: under 30 seconds
- Reset app data: within 5 seconds
- Voice synthesis latency: under 500ms
- API response: under 1 second with automatic failover
- Menu layout switch: under 300ms
- Icon rotation animation response on click: under 50ms
- Radial context menu open animation: under 200ms
- iOS Control Center-style quick access panel open animation: under 200ms
- iOS-styled creator button control panel open animation: under 200ms
- Animated background gradient: 60 FPS continuous, GPU-accelerated
- Background animation toggle response: under 100ms
- Background image apply response: under 500ms
- Back to Home button render time: 0ms delay — present from first frame of any module screen
- Back to Home button drag response: under 16ms (60 FPS drag tracking)
- Mobile edge snap animation: 150ms ease-out
- Back navigation transition: under 200ms
- Home screen render time: 0ms delay — Home screen must render 100% matching the uploaded reference from the first frame
- 100% error-free and bug-free operation
- Error boundary response time: under 16ms
- Image generation API response: 100% successful delivery across all integrated lifetime-free services; automatic retry and failover ensure zero failed requests reaching the user
- Video generation API response: 100% successful delivery across all integrated lifetime-free services; automatic retry and failover ensure zero failed requests reaching the user
- QAZYEN AI API response (killing AI): 100% reliable; automatic retry and fallback ensure zero interaction failures
- File processing AI API response: 100% reliable across all integrated services (geminit AI, killing AI, Perplexity AI)
- Service health check cycle: every 5 minutes per service; health check response logged within 1 second
- Service status badge update latency: under 2 seconds after health check result

### 9.2 Optimization Strategies
- Code splitting and lazy loading: only critical path code loaded on initial render; feature modules loaded on demand
- Service Worker with aggressive caching of app shell, static assets, and API responses
- CDN delivery for all static assets with long-lived cache headers
- Image optimization: WebP format, responsive srcset, lazy loading for off-screen images
- GPU-accelerated rendering for animated background gradient (CSS/WebGL shader-based)
- Animated background degrades gracefully to static gradient on low-performance devices
- Icon rotation uses CSS transform for GPU acceleration, minimal CPU impact
- Radial context menu uses CSS transform and opacity for GPU-accelerated animation
- iOS-styled creator button control panel uses CSS transform and opacity for GPU-accelerated animation
- Back to Home floating button drag uses CSS transform for GPU-accelerated repositioning
- 3D robot model uses progressive loading with low-poly placeholder displayed immediately
- WebGL context initialized off main thread using OffscreenCanvas where supported
- Memory optimization: unused module assets released when navigating away
- Progressive video rendering, 3D LOD system
- Database indexing, caching, thread pagination
- Prefetching for likely-accessed threads
- WebSocket real-time updates without polling
- Unity 3D WebGL optimization, adaptive quality settings
- Bundle size minimized via tree-shaking and minification
- Critical CSS inlined in HTML for zero render-blocking
- Global error boundary implemented at the root component level to catch and silently handle all rendering and runtime errors without surfacing any failure message to the user
- All AI service API integrations use connection pooling, request queuing, and automatic failover to maintain 100% reliability
- Service health monitor runs on a dedicated background worker thread to avoid blocking the main UI thread

---

## 10. Data Management

### 10.1 Persistent Storage
- Conversation threads and complete history
- Thread metadata (title, creation date, last modified, message count)
- Generated images, videos, note summaries, interview sessions, PPT projects, video editing projects
- User preferences, menu layout mode preference, robot customization, voice settings, advanced settings configurations
- User profile information and role assignments
- Back to Home button position preference (persisted per session via local storage)
- Background animation toggle state (persisted via local storage)
- Custom background image (stored in database, synced across devices)
- Gradient overlay opacity preference (persisted via local storage)
- API key configurations (encrypted, admin-managed, server-side only) for all integrated services
- Admin audit logs: role changes, API key updates, login attempts, service health events, error resolution events
- Service health check logs: per-service status history, lifetime-free verification timestamps
- User's last selected image generation service preference (persisted per session)
- User's last selected video generation service preference (persisted per session)
- User's last selected video duration and resolution preferences (persisted per session)

### 10.2 Data Security and Backup
- Encrypted storage and transmission
- Thread-based organization with sidebar display
- Regular automated cloud backups
- 30-day recovery for deleted threads
- Complete data reset via Advanced Settings
- Menu layout preference persisted across sessions

---

## 11. Additional Requirements

### 11.1 Multilingual Support
- 46+ languages including Hindi, Arabic, Urdu, Marathi
- Multilingual greetings in user preferred language
- Accent adaptation, regional accent support
- Multiple voice selection options per language
- Robot facial expressions and upward professional hand gestures (strictly vertical, 0% rotation during greeting) support all languages with lip-synced mouth

### 11.2 Enhanced Functionality
- No wake-up voice required; robot silent until user initiates
- Creator response: My creator is Muhhamed Yasin and everyone knows him by the name Munaf
- Seamless dark/light mode switching with full UI adaptation including animated background tone shift
- Text color: white in dark mode, black in light mode throughout entire app
- File upload for image and video generation, document processing, and all applicable modules
- AI personality and theme customization
- Offline basic mode, cross-device sync, smart notifications, cloud auto-backup
- Material Design animations and micro-interactions throughout
- Voice input/output integrated throughout entire application
- All services lifetime free with automatic API key rotation; no billing, subscription, or paywall
- 100% cinematic, gaming-quality, professional, bug-free, error-free operation
- All menu button icons rotate continuously (ambient slow spin 2–4 RPM) and perform 360° fast spin on click (elastic ease-out, 300ms)
- Circular button ring is user-draggable with inertial swipe-to-rotate
- Entire app background features continuously animated flowing gradient with user-controllable on/off toggle
- Background image customization: users can replace the default animated gradient with a custom background image throughout the entire application
- Radial context menu with 7 options (Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode) opens on any menu button click in both layout modes
- iOS Control Center-style quick access circular menu button available on all screens with at minimum Home, User Profile, and Dark/Light Mode Toggle options
- iOS-styled creator menu button (Muhhamed Yasin / Munaf) present in both Circular and Grid modes; clicking opens iOS Control Center-style control panel with Home, Profile, and Light/Dark Mode Toggle options
- Back to Home button is a freely draggable floating button — user can move it anywhere on the screen at any time; it is always rendered above all content layers from the first frame of any module screen with zero delay; position is persisted per session; mobile snaps to nearest edge on release
- Robot appearance 100% matches uploaded image.png with shiny metallic aluminium body
- Robot greeting hand movement: strictly upward 100% vertical direction, 0% rotation — hand does not rotate at all during greeting sequence; greeting combines hand-to-mouth movement and waving Hi motion within these strict constraints
- All other robot hand movements and body movements are 100% professional
- Robot default background environment is a high-fidelity 3D laboratory setting
- The message App modification failed. Please try again later or submit feedback. must never appear anywhere in the application under any circumstances — all errors are handled silently, automatically, and invisibly to the user
- Image generation: dedicated multi-service panel with geminit AI, Gemini, Stable Diffusion (Hugging Face), FLUX.1-schnell (Hugging Face), and Pollinations AI; all services 100% operational, lifetime-free, with real-time status indicators; automatic failover between services; admin can manage all API keys; Sora 2 permanently excluded
- Video generation: dedicated multi-service panel with nand AI, Pollinations AI Video, and Hugging Face zeroscope; all services 100% operational, lifetime-free, with real-time status indicators; user-configurable duration (5–10 seconds) and resolution (480p / 720p / 1080p / 2K / 4K); automatic failover between services; admin can manage all API keys; Sora 2 permanently excluded
- Comprehensive AI service reliability system: background health monitor (every 5 minutes), proactive error detection and auto-fix, error classification (Transient / Key-Auth / Paywall-Quota / Structural), admin error resolution log, Virtual Qazyen service re-validated and fixed end-to-end
- Lifetime-free verification mechanism: automated checks per service to detect and suppress any service that introduces billing requirements or paywalls; admin dashboard displays verification status and last check timestamp per service
- All internal documentation, error messages, and settings panels updated to reflect all backend services
- Admin Mode access point visible on the Home page, gated by admin code qazyen123
- Admin can view active users in real-time and manage user roles
- Admin password is hidden and stored securely server-side

### 11.3 User Experience Goals
The application must feel: Premium, Fast, Intelligent, Responsive, Professional, Calm, Trustworthy, Extremely satisfying, Zero-friction, Smart-defaulted, Home screen visually identical to the uploaded home page reference image (file-aig01c6yjitc.png) at 100% fidelity, enhanced with Material Design robot aesthetics, Ultra-clean and futuristic, Friendly yet powerful, Minimal distractions, Cinematic and gaming-quality, 100% error-free, Instantly responsive, Fully interactive, Flexible and customizable with gradient aesthetics, Immersive with animated background gradient (user-controllable), Effortlessly navigable with Back to Home freely movable and immediately visible on every screen upon entry, Satisfyingly tactile with rotating icon interactions, Intuitively contextual with radial menu quick-access options, Empowering with a draggable Back to Home button the user can place wherever is most comfortable, Always functional and always showing content with zero dead ends or blocking error states, Reliably powerful with 100% operational AI services matching Perplexity AI-level performance, Intuitively accessible with iOS Control Center-style quick access panel, Personally connected with iOS-styled creator button (Muhhamed Yasin / Munaf) opening a friendly control panel, Completely free with no billing friction or paywalls anywhere, Transparently reliable with real-time service status indicators showing which AI services are Online and available.

---

## 12. Security Plan Summary

### 12.1 Admin Password Security
- Admin password (qazyen123) is stored exclusively server-side in an encrypted format
- Password is never included in client-side code, configuration files, or transmitted in plaintext
- Admin login prompt validates the code via a secure server-side API call
- Failed login attempts are rate-limited (e.g., maximum 5 attempts per 15 minutes per IP) to prevent brute force
- All admin login attempts (successful and failed) are logged in the audit trail

### 12.2 API Key Security Plan
- All API keys stored encrypted server-side (AES-256)
- Keys are never exposed to end users or in client-side bundles
- Admin Dashboard provides masked key display with explicit reveal action
- Key rotation: admin can manually rotate any key; system also auto-rotates on balance exhaustion
- All key changes logged with timestamp and admin identifier
- Separate key slots per service: geminit AI, Gemini, Stable Diffusion (Hugging Face), FLUX.1-schnell (Hugging Face), Pollinations AI (image), nand AI, Pollinations AI Video, Hugging Face zeroscope (video), killing AI, ElevenLabs, Google Cloud TTS, Perplexity AI
- Primary and backup key slots per service for seamless automatic failover

---

## 13. Future Expansion Roadmap
- Phase 1: Stable release with all core features, Unity 3D humanoid robot (strictly upward greeting movement, 0% rotation), flexible menu layout, gradient color system, animated background gradient with toggle, background image customization, rotating icons, radial context menu, iOS Control Center-style quick access panel, iOS-styled creator button (Muhhamed Yasin / Munaf) with Home/Profile/Light-Dark control panel, freely movable Back to Home button, multi-service image generation panel (geminit AI, Gemini, Stable Diffusion, FLUX.1-schnell, Pollinations AI) with status indicators, multi-service video generation panel (nand AI, Pollinations AI Video, Hugging Face zeroscope) with status indicators and configurable duration/resolution, comprehensive AI service reliability system with background health monitor and lifetime-free verification, lifetime free APIs, global silent error handling, 100% operational AI services, dual-mode admin/user system with active user monitoring and role management, zero billing or paywall elements
- Phase 2: AI Automation Workflows
- Phase 3: Enterprise SaaS Version
- Phase 4: API Marketplace
- Phase 5: AI Agents and Autonomous Execution
- Phase 6: Advanced 3D Robot Capabilities (AR/VR, enhanced power modes)
- Phase 7: Enhanced Material Design animations
- Phase 8: Custom voice training with bass enhancement
- Phase 9: Advanced collaboration and shared threads
- Phase 10: AI-powered content creation suite expansion
- Phase 11: Advanced thread analytics and insights
- Phase 12: Thread templates and automation
- Phase 13: Additional menu layout modes and customization
- Phase 14: Advanced gradient color customization and themes
- Phase 15: Advanced animated background themes and customization
- Phase 16: Expanded lifetime-free AI service integrations for image and video generation

---

## 14. Product Summary
Qazyen AI is a Perplexity AI and Gemini-level conversational engine powered by killing AI, a 100% operational AI-powered media generation powerhouse featuring a multi-service image generation panel (geminit AI, Gemini, Stable Diffusion via Hugging Face, FLUX.1-schnell via Hugging Face, and Pollinations AI — all lifetime-free, all with real-time Online/Offline/Degraded status indicators, automatic failover, and admin-manageable API keys) and a multi-service video generation panel (nand AI, Pollinations AI Video, and Hugging Face zeroscope — all lifetime-free, all with real-time status indicators, user-configurable duration from 5 to 10 seconds, user-selectable resolution from 480p to 4K, automatic failover, and admin-manageable API keys; Sora 2 permanently excluded), a photorealistic 3D virtual humanoid robot companion (QAZYEN — 100% matching the uploaded image.png with shiny metallic aluminium body, strictly upward 100% vertical hand movement with 0% rotation during greeting combining hand-to-mouth and waving Hi motion, 100% professional hand and body movements in all other interactions, and a high-fidelity laboratory background environment, powered by a 100% operational killing AI API) featuring animated facial expressions with lip-synced mouth, expressive upward professional hand gestures, gradient color-changing body lighting, and a deep bass AI-generated robotic male voice — combined with a Gamma-style AI PPT maker, professional video editor, productivity assistant, research partner, multilingual voice companion (46+ languages), creative studio, secure knowledge vault, multi-modal file upload and AI processing, and cross-platform AI ecosystem. The Home screen is built to 100% match the visual design shown in the uploaded home page reference image (file-aig01c6yjitc.png) at pixel-perfect fidelity, with all other screens referencing qazyen app design.png for visual guidance, enhanced with Material Design robot-themed aesthetics, a flexible menu layout system (Circular Mode and Grid Mode), a full-spectrum gradient color scheme, a continuously animated flowing background gradient with user-controllable on/off toggle, customizable background images throughout the entire application, rotating circular icons with ambient slow spin and satisfying click-spin interaction, a 7-option radial context menu (Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode) that opens in a circular arrangement on any menu button click in both layout modes, an iOS Control Center-style quick access circular menu button available on all screens, an iOS-styled creator menu button (Muhhamed Yasin / Munaf) present in both layout modes, a freely draggable floating Back to Home button that is immediately visible and accessible upon entering every feature section with zero delay, voice input/output throughout without wake word, JARVIS-like features, resume analyzer, prompt generator, image analysis, advanced settings, reset app data, automatic API key rotation, database-backed thread history with instant zero-delay opening, fully interactive and clickable AI messages, a comprehensive AI service reliability system with background health monitoring every 5 minutes, proactive error detection and auto-fix, lifetime-free verification per service, and a detailed admin error resolution log, a global silent error handling system that permanently suppresses all failure messages and ensures the app always remains visible, functional, and seamlessly operational under any condition, a dedicated Admin Mode access point on the Home page (gated by admin code qazyen123) with real-time active user monitoring, user role management, and secure encrypted API key management for all integrated services. Admin password: qazyen123. All services lifetime free and unlimited with zero billing, subscription, or paywall. No registration required. 100% cinematic, gaming-quality, professional, bug-free, error-free, instantly responsive, and gradient-styled throughout.

---

## 15. Reference Files
1. Home Page Design Reference: home page reference image — File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260326/file-aig01c6yjitc.png — Primary and definitive reference for the Home screen layout, visual design, component arrangement, color treatment, spacing, and all UI elements. The Home page must 100% match this uploaded image in every detail across all supported platforms.
2. Humanoid Robot Design Reference: image.png — File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260325/file-ahl49m59yygw.png — Primary and definitive reference for the 3D humanoid robot appearance (100% matching), shiny metallic aluminium body material, professional hand movements (strictly upward 100% vertical with 0% rotation during greeting), professional body movements, facial expressions, lip-synced mouth, upward hand gestures, gradient body lighting, and Unity 3D game-quality rendering
3. App UI Design Reference: qazyen app design.png — File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-8sl3xec2ksn4/conv-8sm6282ej0n4/20260324/file-agrwcxmu7oxs.png — Secondary visual reference for all non-Home screens — overall app appearance, layout structure, color palette application, component styling, spacing system, and visual hierarchy across all feature module screens
4. Button Color Gradient Reference: gradient scheme (Cyan → Light Blue → Pink → White → Dark Blue → White) applied to all buttons in both layout modes
5. Icon Color Gradient Reference: gradient scheme (Cyan → Light Blue → White → Dark Blue → Red → Silver → White) applied to all menu button icons in both Circular and Grid modes
6. Circular Button Layout Reference: smartwatch interface design patterns for circular button arrangement around center profile panel
7. iOS Notch Design Reference: iOS device notch design for user profile panel styling in Circular Mode
8. Grid Layout Reference: traditional application menu design patterns for organized grid layout with rows and columns in Grid Mode
9. Radial Context Menu Reference: circular radial menu design pattern with 7 options (Home, Back, Light/Dark, Settings, Profile, Feedback, Admin Mode) expanding from clicked button in both Circular and Grid layout modes
10. iOS Control Center Reference: iOS Control Center design pattern for the quick access circular menu button panel (semi-transparent blur, rounded modules, Home / User Profile / Dark/Light Mode Toggle options)
11. iOS-Styled Creator Button Reference: iOS Control Center design pattern applied to the creator identity button (Muhhamed Yasin / Munaf) — clicking opens a control panel with Home, Profile, and Light/Dark Mode Toggle options
12. Gamma AI PPT Reference: Gamma AI platform workflow for AI-powered presentation generation (prompt → outline → full presentation → edit/export)
13. Error Handling Reference: global silent error boundary — the message App modification failed. Please try again later or submit feedback. is permanently suppressed; all errors handled silently and automatically; app always remains visible and functional
14. AI Service Reliability Reference: all AI services must achieve 100% operational reliability; background health monitor runs every 5 minutes per service; lifetime-free verification enforced per service; Sora 2 permanently excluded; all services are 100% free with lifetime access and no billing or paywall; admin can manage all API keys securely via Admin Dashboard
15. Image Generation Services Reference: geminit AI, Gemini (Google), Stable Diffusion via Hugging Face Inference API (stabilityai/stable-diffusion-xl-base-1.0), FLUX.1-schnell via Hugging Face Inference API (black-forest-labs/FLUX.1-schnell), Pollinations AI (pollinations.ai image API) — all lifetime-free, all with real-time status indicators
16. Video Generation Services Reference: nand AI, Pollinations AI Video (pollinations.ai video API), Hugging Face Video zeroscope (zeroscope_v2_576w via Hugging Face Inference API) — all lifetime-free, all with real-time status indicators, user-configurable duration (5–10 seconds) and resolution (480p / 720p / 1080p / 2K / 4K); Sora 2 permanently excluded