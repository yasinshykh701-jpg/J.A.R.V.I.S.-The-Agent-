# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Qazyen AI

### 1.2 Application Description
Qazyen AI is an enterprise-grade, cross-platform AI Super Application delivering Perplexity AI and Gemini-level conversational intelligence, advanced AI video generation (powered by nand AI), AI image creation (powered by geminit AI and additional lifetime-free services), document processing, multilingual voice assistant, real-time web intelligence, personal productivity tools, a photorealistic 3D virtual humanoid robot (100% matching the uploaded image.png with shiny metallic aluminium body, professional hand and body movements with strictly upward 100% vertical hand movement and 0% rotation during greeting, and a laboratory background environment) for interviews and voice interaction, a fully operational Gamma-identical AI PPT maker (100% matching all Gamma tool features and workflows), a fully operational AI-powered Resume Analyzer, professional video editor, and secure data management — all within a seamless premium interface where the Home page layout and visual design 100% matches the uploaded home page reference image (file-aig01c6yjitc.png) as the primary and definitive visual blueprint for the Home screen, fused with futuristic robot-themed aesthetics, a flexible menu layout system (Circular Mode with iOS-style notch profile panel and Grid Mode), a full-spectrum gradient color palette flowing Cyan → Light Blue → Pink → White → Dark Blue → White throughout every surface, rotating circular icons with smooth click interaction, a dynamic animated background gradient (Cyan + Light Cyan + Dark Blue + Black + White + Silver in random flowing movement) with user-controllable on/off toggle, customizable background images throughout the entire application, and a freely movable and always-accessible Back to Home button on every feature module screen.

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
Qazyen AI unifies Perplexity AI and Gemini-level conversational intelligence, 100% operational geminit AI-powered image generation with additional lifetime-free image generation services, 100% operational nand AI-powered video generation (5–10 second configurable duration, multi-resolution output, image-to-video generation with file upload support), a 100% operational photorealistic 3D humanoid robot assistant (100% matching the uploaded image.png) with strictly upward vertical hand movements and zero rotation during greeting, voice-first multilingual interaction, knowledge search engine, a 100% Gamma-identical AI PPT maker with every Gamma tool feature fully operational, a 100% operational AI-powered Resume Analyzer, professional video editor, encrypted cloud storage with database-backed chat history, cross-device synchronization, dual-mode admin/user management console, AI personalization engine, and smart automation workflows — all wrapped in a Home page that 100% mirrors the uploaded home page reference image (file-aig01c6yjitc.png), enhanced with futuristic Material Design robot-themed aesthetics, flexible Circular and Grid menu layouts, a cohesive gradient visual identity, rotating circular icons, a dynamic animated background gradient with disable option, customizable background images, and a freely movable and always-accessible Back to Home button on every feature module screen.

### 1.5 Pricing Model
All services are lifetime free and unlimited. The integrated AI services (killing AI, nand AI, geminit AI, and all additional image/video generation services) are configured for 100% free, perpetual, lifetime access with no cost to the end-user. No subscription plans, billing, credit top-ups, or paywalls exist anywhere in the application. An automatic API key rotation and upgrade system ensures uninterrupted service at all times. The Sora 2 model/service is removed from all available options as it does not meet the lifetime-free criteria.

---

## 2. User Roles & Access Control

### 2.1 Role Overview
| Role | Access Level | Description |
|------|-------------|-------------|
| User | Standard | Access to all core AI generation features, PPT creator, Resume Analyzer, chat, voice assistant, and productivity tools |
| Administrator | Privileged | Full access including admin dashboard, user management, API key management, role assignment, system monitoring, and AI service health management |

### 2.2 User Mode
- Access to: Conversational AI, Image Generation (geminit AI + additional lifetime-free services), Video Generation (nand AI, 5–10s configurable, multi-resolution, image-to-video with file upload), PPT Maker (100% Gamma-identical), Video Editor, 3D Robot Assistant, Voice Assistant, Note Summary, Task Manager, AI Calendar, Productivity Suite, Resume Analyzer (AI-powered, 100% operational), Prompt Generator, History, Advanced Settings
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
- Text-to-Video generation
- Image-to-Video generation with file upload support (JPG, PNG, WEBP)
- Video-to-Video transformation (MP4, MOV, AVI)
- Scene expansion, motion control, camera pan simulation, cinematic presets
- Quality output at selected resolution with frame interpolation and AI color grading
- Auto background music, AI subtitles, scene stitching, auto storyboard generation
- GPU acceleration, parallel rendering, cloud distributed processing
- Progressive preview playback during rendering

#### Input Mode Selector
- Text-to-Video, Image-to-Video, Video-to-Video modes with adaptive input area
- Mode selector styled as a segmented control or tab row with gradient styling
- Selected mode is persisted per session

#### Lifetime-Free Verification & Monitoring
- Same background monitoring service as image generation: periodic health checks every 5 minutes per video service endpoint
- Health check verifies: API reachability, response validity, and absence of paywall/billing gate responses
- Admin Dashboard displays the last verified timestamp and lifetime-free status for each video service

### 3.11 File Upload & Multi-Modal AI Processing
- Users can send, upload, or paste files for AI processing across all applicable modules
- Supported upload methods: file picker dialog, drag-and-drop, clipboard paste
- Supported file types: PDF, DOCX, TXT, JPG, PNG, WEBP, MP4, MOV, AVI, and other common formats
- Multi-modal AI services integrated for file processing: geminit AI, killing AI / OpenAI GPT-4 (with vision), Perplexity AI
- File processing capabilities: document analysis, image analysis, video analysis, code file analysis
- File upload available in main chat interface, Image Generation module, Video Generation module, Note Summary module, Resume Analyzer module, and Video Editor module
- File upload scanning and validation before processing
- Encrypted storage of uploaded files
- Upload progress indicator with non-blocking UI
- File attachment preview in chat thread
- Inline upload error hint (non-blocking): Upload could not complete — please try a different file

### 3.12 PPT Maker — 100% Gamma AI Feature Parity

#### Overview
- The PPT Maker module is a 100% functional replica of the Gamma AI tool, implementing every feature, workflow, and capability that Gamma provides
- All features listed below are 100% working, 100% responsive, and deliver real AI-generated presentation output on every request
- The module is powered by the integrated AI backend (killing AI / OpenAI GPT-4) with automatic key rotation ensuring zero failures

#### Gamma-Identical Generation Workflow
- **Step 1 — Prompt Input:**
  - User enters a natural language prompt describing the desired presentation (e.g., Create a 10-slide presentation on climate change with charts and images)
  - Voice input supported: user can speak the prompt instead of typing
  - Prompt field supports multi-line input with character count indicator
  - AI suggests prompt improvements inline before generation begins
- **Step 2 — AI Outline Generation:**
  - AI instantly generates a structured outline of all slides based on the prompt
  - Outline is displayed in an editable list view: each slide shown as a numbered item with its title and key bullet points
  - User can edit, reorder, add, or remove slides in the outline before proceeding
  - User can regenerate the outline with a single click if unsatisfied
  - Outline generation completes within 5 seconds
- **Step 3 — Full Presentation Generation:**
  - User confirms the outline and triggers full presentation generation
  - AI generates all slides simultaneously with complete content, layouts, visuals, and styling
  - Real-time progress indicator shows generation status per slide
  - Full generation completes within 30 seconds for a standard 10-slide deck
- **Step 4 — Edit & Refine:**
  - User can edit any individual slide after generation
  - Per-slide regeneration: user can regenerate a single slide without affecting others
  - Theme adjustment: user can change the visual theme globally or per slide
  - AI-assisted editing: user can type a natural language instruction to modify a slide (e.g., Make slide 3 more concise or Add a chart to slide 5)

#### Full Gamma Feature Set (All 100% Operational)
- **Slide Layout Engine:**
  - Automatic layout selection based on content type (title slide, content slide, image-heavy slide, data slide, quote slide, comparison slide, timeline slide)
  - Smart content distribution across slides — AI decides optimal text-to-visual ratio per slide
  - Multiple layout variants per slide type; user can cycle through layout options
  - Full-bleed image layouts, split layouts, grid layouts, centered layouts
- **Template Library:**
  - 20+ professional templates covering: Business, Education, Marketing, Technology, Creative, Minimal, Bold, Corporate, Startup, Academic
  - Each template includes a complete color scheme, typography pairing, and icon set
  - User can preview and apply any template before or after generation
  - Custom theme creation: user can define primary color, secondary color, font family, and background style
- **AI Content Generation per Slide:**
  - Headline generation: AI writes concise, impactful slide titles
  - Body content generation: AI writes bullet points, paragraphs, or speaker notes per slide
  - Speaker notes: AI generates detailed speaker notes for every slide automatically
  - AI rewrites: user can select any text block and request AI to rewrite it (shorter, longer, more formal, more casual, translate to another language)
  - Content suggestions: AI suggests additional content, statistics, or examples relevant to the slide topic
- **Visual & Media Integration:**
  - AI-selected stock images: AI automatically selects and places relevant stock images per slide from a built-in image library
  - User can replace any AI-selected image by uploading their own (JPG, PNG, WEBP) or searching the built-in library
  - Icon integration: AI places relevant icons per slide from a built-in icon library (1000+ icons)
  - Chart and graph generation: user can request a chart (bar, line, pie, area, scatter, donut) by describing the data in natural language; AI generates the chart and embeds it in the slide
  - Data table generation: AI generates formatted data tables from natural language descriptions
  - GIF and animation support: user can add animated GIFs to slides
  - Video embed support: user can embed a video URL into a slide
- **Slide Editing Tools (Gamma-Level):**
  - Drag-and-drop element repositioning within slides
  - Resize handles for all elements (text boxes, images, charts, icons)
  - Text formatting toolbar: font family, font size, bold, italic, underline, strikethrough, text color, background color, alignment, bullet list, numbered list, link insertion
  - Element layering: bring to front, send to back, layer order control
  - Duplicate slide, delete slide, move slide (drag in slide panel or arrow buttons)
  - Add new blank slide or AI-generated slide at any position
  - Undo/redo with full history (minimum 50 steps)
  - Slide notes panel: expandable notes area below each slide in edit view
  - Zoom in/out on slide canvas
  - Grid and alignment guides for precise element placement
- **Presentation Modes:**
  - Present Mode: full-screen presentation view with slide navigation (arrow keys, click, swipe on mobile)
  - Presenter View: slide on main screen, notes and next-slide preview on secondary display or split view
  - Slideshow autoplay with configurable slide duration
  - Laser pointer simulation in Present Mode
- **Collaboration Features:**
  - Real-time collaborative editing: multiple users can edit the same presentation simultaneously
  - Presence indicators: avatars of active collaborators shown on the slide they are editing
  - Comment system: users can add comments to any slide element; comments are threaded and resolvable
  - Share link generation: user can generate a view-only or edit link for the presentation
  - Version history: full version history with named snapshots; user can restore any previous version
- **Export Options:**
  - Export as PPTX (Microsoft PowerPoint format, fully editable)
  - Export as PDF (print-ready, high resolution)
  - Export as PNG (individual slide images)
  - Export as MP4 (animated video of the presentation with transitions)
  - Export as interactive web link (shareable URL that renders the presentation in-browser)
- **Import & Integration:**
  - Import existing PPTX file: AI analyzes and redesigns the imported presentation using the selected template
  - Import from Google Slides URL: AI fetches and redesigns the presentation
  - Import from PDF: AI extracts content and generates a new presentation
- **AI Chat Assistant within PPT Maker:**
  - A persistent AI chat panel is available within the PPT Maker module
  - User can type or speak natural language instructions to modify the entire presentation or specific slides
  - Examples: Add a slide about market trends after slide 4, Change the color scheme to blue and white, Summarize the entire presentation in 3 slides
  - AI executes the instruction and updates the presentation in real-time
  - Chat history within the PPT session is preserved
- **Transition & Animation Effects:**
  - Slide transition effects: Fade, Slide, Zoom, Flip, Cube, Push (matching Gamma's transition library)
  - Element entrance animations: Fade In, Slide In (from left/right/top/bottom), Zoom In, Bounce
  - Animation timing control: delay and duration per element
  - Global transition apply: apply one transition to all slides with a single click
- **Accessibility:**
  - Alt text generation for all images (AI-generated)
  - Slide reading order configuration for screen readers
  - High-contrast mode support
- **Auto-Save & History:**
  - Presentation auto-saved to database every 30 seconds
  - Saved to thread history with thumbnail preview
  - User can resume editing any saved presentation from History
- **Back to Home floating button:** freely draggable and immediately visible on entry
- **Animated background visible behind panel surfaces**
- **Voice input supported throughout the PPT Maker module**
- **100% operational: all AI generation requests within PPT Maker are successfully processed and delivered with zero failures; automatic retry and fallback ensure uninterrupted service**

### 3.13 Resume Analyzer — 100% Operational AI-Powered Analysis

#### Overview
- The Resume Analyzer module provides fully operational, AI-powered resume analysis, scoring, feedback, and optimization
- All analysis features are 100% working and 100% responsive — every uploaded resume receives a complete AI-generated analysis report with zero failures
- Powered by the integrated AI backend (killing AI / OpenAI GPT-4 with vision + document understanding, geminit AI, Perplexity AI) with automatic key rotation ensuring zero failures

#### File Upload
- Supported formats: PDF, DOCX, TXT
- Upload methods: file picker dialog, drag-and-drop, clipboard paste
- Upload progress indicator shown inline; non-blocking UI during upload
- Uploaded file preview displayed in the panel before analysis is initiated
- File size limit: up to 10 MB per file
- File validation: format check and content scan before processing
- Inline upload error hint (non-blocking) if upload fails: Upload could not complete — please try a different file

#### AI Analysis Engine (100% Operational)
- Upon upload, the AI immediately begins analyzing the resume content end-to-end
- Analysis is performed by the integrated AI backend with automatic retry (up to 5 retries with exponential backoff) and fallback to the next available AI service on failure
- Analysis completes within 15 seconds for a standard single-page resume; within 30 seconds for multi-page resumes
- All analysis results are displayed in a structured, visually rich report within the panel

#### Analysis Report — Full Feature Set
- **Overall Resume Score:**
  - AI assigns an overall score from 0 to 100 with a visual score ring/gauge
  - Score breakdown by category: Content Quality, Formatting & Structure, ATS Compatibility, Keyword Optimization, Impact & Achievements, Readability
  - Each category displays an individual score (0–100) with a color-coded indicator (green ≥ 75, amber 50–74, red < 50)
- **Section-by-Section Analysis:**
  - AI analyzes every section of the resume individually: Contact Information, Summary/Objective, Work Experience, Education, Skills, Certifications, Projects, Awards, Languages, References
  - For each section: completeness rating, quality rating, specific feedback, and actionable improvement suggestions
  - Missing sections are flagged with a recommendation to add them
- **ATS (Applicant Tracking System) Compatibility Check:**
  - AI evaluates the resume for ATS compatibility: font readability, use of standard section headings, absence of tables/graphics that confuse ATS parsers, keyword density
  - ATS compatibility score displayed prominently
  - Specific ATS issues listed with fix instructions
- **Keyword Analysis & Job Match:**
  - AI extracts all keywords from the resume and categorizes them: hard skills, soft skills, industry terms, tools/technologies, certifications
  - User can optionally paste a job description into a text field; AI performs a keyword gap analysis comparing the resume keywords against the job description
  - Missing keywords highlighted with suggestions to incorporate them naturally
  - Keyword match percentage displayed when a job description is provided
- **Impact & Achievement Analysis:**
  - AI identifies bullet points that lack quantifiable achievements and flags them
  - AI suggests rewrites for weak bullet points, transforming them into achievement-oriented statements with metrics
  - Example: Changed Managed a team to Led a cross-functional team of 8 engineers, delivering a 30% reduction in deployment time
- **Grammar, Spelling & Tone Check:**
  - AI performs a full grammar and spelling check across the entire resume
  - Tone analysis: AI evaluates whether the language is professional, confident, and active-voice dominant
  - All grammar/spelling issues listed with corrections
  - Passive voice instances flagged with active voice rewrites suggested
- **Formatting & Visual Structure Analysis:**
  - AI evaluates visual hierarchy, use of white space, font consistency, bullet point consistency, section spacing, and overall readability
  - Specific formatting issues listed with fix instructions
  - Recommended formatting improvements displayed with before/after examples
- **AI-Powered Rewrite Suggestions:**
  - For every weak section or bullet point identified, AI provides a ready-to-use rewrite suggestion
  - User can accept a suggestion with a single click, which copies the rewritten text to clipboard
  - User can request an alternative rewrite if the first suggestion is not satisfactory
- **Tailored Improvement Roadmap:**
  - AI generates a prioritized, step-by-step improvement roadmap specific to the uploaded resume
  - Roadmap items are ranked by impact: High Impact, Medium Impact, Low Impact
  - Each roadmap item includes: issue description, why it matters, and specific action to take
- **Industry & Role Benchmarking:**
  - User can optionally specify their target industry and role level (Entry, Mid, Senior, Executive)
  - AI benchmarks the resume against industry standards for that role level
  - Benchmark comparison displayed: how the resume compares to top-performing resumes in the same category
- **AI Chat Assistant within Resume Analyzer:**
  - A persistent AI chat panel is available within the Resume Analyzer module
  - User can ask follow-up questions about their resume analysis (e.g., How do I improve my skills section? or What keywords should I add for a software engineer role?)
  - AI responds with specific, actionable advice based on the uploaded resume content
  - Voice input supported in the chat panel
- **Export Analysis Report:**
  - User can export the full analysis report as PDF or DOCX
  - Export includes all scores, section feedback, keyword analysis, and improvement roadmap
- **Re-Analysis:**
  - User can upload a revised resume at any time to run a new analysis and compare scores against the previous version
  - Score delta displayed: improvement or regression per category since last analysis
- **Auto-Save & History:**
  - All analysis sessions saved to thread history with resume filename and overall score as preview
  - User can revisit any past analysis session from History
- **Back to Home floating button:** freely draggable and immediately visible on entry
- **Animated background visible behind panel surfaces**
- **100% operational: all resume analysis requests are successfully processed and delivered with zero failures; automatic retry and fallback ensure uninterrupted service**

### 3.14 Video Editor
- Timeline-based multi-track video and audio editing
- Trim, cut, split, merge, transition effects library
- Text and title overlays, filter and color grading, audio mixing and enhancement
- Speed control (slow motion, time-lapse), green screen (chroma key), picture-in-picture
- Export: MP4, MOV, AVI at 720p / 1080p / 2K / 4K
- Real-time preview, undo/redo, project auto-save

### 3.15 Smart Note & Knowledge Engine
- Document upload: PDF, DOCX, TXT
- Smart summarization: bullet summary, academic summary, key insights, keyword extraction
- Mind-map generation, flashcard generator, quiz generator
- Automatic summary generation on upload

### 3.16 Voice Assistant 2.0
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

### 3.17 AI Productivity Suite
- Task Manager with smart reminders
- AI calendar assistant and meeting summarizer
- Email drafting assistant, resume builder, cover letter generator
- LinkedIn post generator, blog creator
- Prompt Generator: create optimized prompts for various AI tasks

### 3.18 Smart History & Memory Management
- All interactions automatically stored in database with thread-based organization
- Full-text search across all threads with AI tagging and date-based filtering
- Media preview grid, folder organization, starred items
- History scope: Q&A, generated images, generated videos, note summaries, interview sessions, PPT projects, video editing projects, resume analysis sessions
- Sidebar display with Material Design styling and instant thread opening
- Export all data, secure backup, thread metadata display

### 3.19 Login System & Admin Access
- No user registration required — open access for all users
- Admin Mode available via admin code: qazyen123 (stored securely server-side)
- Correct code grants access to full admin dashboard with all features activated
- Failed login attempts rate-limited to prevent brute force
- Admin Mode access points:
  - Radial context menu option (Admin Mode) on any menu button in both Circular and Grid modes
  - Dedicated Admin Mode access button/link visible on the Home page — accessible and usable only by authorized administrators (button is visible on the Home screen; access is gated by the admin code qazyen123)
  - Admin login prompt overlay: input field for admin code, submit button, rate-limited failed attempts, success grants full admin dashboard access

### 3.20 Admin Dashboard
- **Active User Monitoring:** Real-time dashboard showing a list of all currently active/operating users — display includes user identifier, active feature module, session start time, and activity status
- **User Role Management:**
  - Admin can view all registered user accounts and their current roles
  - Admin can change a user's role from Administrator to regular User
  - Admin cannot be demoted by any User — only an Admin can demote another Admin
  - Role changes take effect immediately and are logged in the audit trail
- **API Key Management:**
  - Admin can view, update, and rotate API keys for all integrated services
  - API key input fields are masked by default; admin can reveal/edit
  - Save and rotate buttons per service
  - Real-time API health status indicator per service: Online / Offline / Degraded
  - Last verified timestamp and lifetime-free status displayed per service
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

### 3.21 Advanced Settings
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

### 3.22 Reset App Data
- Clears all conversation threads and history from database
- Removes all generated images, videos, PPTs, note summaries, interview sessions, video editing projects, resume analysis sessions
- Resets all user preferences and settings to default (including menu layout → Circular Mode, background → default animated gradient)
- Confirmation dialog before execution
- Progress indicator and completion message
- Completes within 5 seconds

### 3.23 Automatic API Key Management
- Real-time monitoring of API key balance and usage for all integrated services
- Automatic detection of insufficient balance errors
- Seamless rotation to backup API keys without service interruption
- Automatic tier upgrade when needed
- Admin dashboard displays API key health and status for all services
- Automatic error recovery, retry mechanisms, and fallback providers
- Zero downtime transitions
- Covers all AI services: Conversational AI (killing AI / GPT-4), Image Generation (geminit AI, Gemini, Stable Diffusion, FLUX.1-schnell, Pollinations AI), Video Generation (nand AI, Pollinations AI Video, Hugging Face zeroscope), QAZYEN AI, Voice Synthesis (ElevenLabs / Google Cloud TTS), File Processing AI, PPT Maker AI, Resume Analyzer AI

### 3.24 Comprehensive AI Service Reliability & Error Resolution System

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

### 3.25 Error Handling & Resilience — No Failure Messages
- The application must never display the message: App modification failed. Please try again later or submit feedback. under any circumstances
- All errors, failures, and exceptions must be handled silently and automatically in the background
- Error handling strategy:
  - All API call failures trigger automatic silent retry with exponential backoff (up to 5 retries before switching to a fallback provider)
  - All network failures trigger automatic reconnection attempts in the background
  - All rendering failures trigger graceful degradation to a simplified fallback UI
  - All database errors trigger local cache fallback
  - All feature module load failures trigger silent reload attempts
  - All WebGL/3D rendering errors fall back to a 2D animated avatar placeholder
  - All voice synthesis errors fall back to text-only response
  - All file upload errors display a non-blocking inline hint: Upload could not complete — please try a different file
  - All PPT, video, image generation, and resume analysis timeouts display a non-blocking progress indicator with a silent background retry
- The app must always show content, always remain interactive, and always provide a path forward for the user
- Admin dashboard displays real-time error logs and API health status for monitoring — errors are surfaced to admins only, never to end users

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
- Animated background gradient with user-controllable on/off toggle
- Background image customization throughout the entire application
- All UI panels and surfaces use semi-transparent or frosted-glass treatment
- All menu button icons rotate continuously (ambient slow spin) and spin on click (fast 360° elastic ease-out)
- Radial context menu (7 options) opens on any menu button click in both layout modes
- iOS Control Center-style quick access circular menu button available on all screens
- iOS-styled creator menu button (Muhhamed Yasin / Munaf) present in both Circular and Grid modes
- Back to Home button: freely draggable floating button, always visible above all content layers, present and immediately rendered from the first frame upon entering any feature module screen
- No blocking error messages or failure overlays are ever displayed to the user
- No billing, subscription, or paywall UI elements anywhere in the application
- Admin Mode access point visible on the Home page, gated by admin code qazyen123
- Image Generation and Video Generation panels are clearly separated with distinct full-screen UIs

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
- Service selector row: horizontal scrollable list of available services, each displayed as a pill/chip with service name, status badge, and selected state
- Center section: prompt input area (text field, voice input button, file upload button)
- Generation controls: aspect ratio selector, mode selector (Realistic / Anime / 3D / Cinematic), lighting control, mood selector
- Generate button: full-width gradient button with ripple effect
- Output section: generated image display with download, share, edit, and regenerate options
- History strip: horizontal scroll of recent generations at bottom
- Back to Home floating button: freely draggable, immediately visible on entry

#### Video Generation Panel Layout
- Full-screen dedicated panel with frosted-glass surface over animated background
- Top section: panel title (AI Video Generation), service selector row or dropdown
- Input mode selector: segmented control or tab row (Text-to-Video / Image-to-Video / Video-to-Video)
- Center section: adaptive input area based on selected mode
- Generation controls: duration selector (5s–10s), resolution selector (480p / 720p / 1080p / 2K / 4K), scene style, motion control, camera preset
- Generate button: full-width gradient button with ripple effect
- Output section: video player with progressive preview, download, share, and regenerate options
- Rendering progress indicator: non-blocking progress bar with estimated time remaining
- History strip: horizontal scroll of recent generations at bottom
- Back to Home floating button: freely draggable, immediately visible on entry

### 4.6 PPT Maker Panel UI
- Full-screen dedicated panel with frosted-glass surface over animated background
- Left panel: slide thumbnail strip (scrollable, drag-to-reorder, add/delete slide controls)
- Center canvas: active slide editing area with drag-and-drop element support, resize handles, alignment guides
- Right panel: properties panel (element formatting, layout options, animation settings, speaker notes)
- Top toolbar: template selector, theme controls, export button, share button, present button, undo/redo
- Bottom bar: AI chat assistant input field with voice input button
- Outline view toggle: switch between slide canvas view and outline list view
- Real-time preview of all edits
- Back to Home floating button: freely draggable, immediately visible on entry

### 4.7 Resume Analyzer Panel UI
- Full-screen dedicated panel with frosted-glass surface over animated background
- Upload zone: prominent drag-and-drop area with file picker button; displays uploaded file name and preview after upload
- Analysis trigger: Analyze Resume button (full-width gradient, ripple effect) activated after upload
- Analysis progress: animated progress indicator during AI processing
- Results area: structured report with overall score ring, category score cards, section-by-section feedback accordion, keyword analysis panel, improvement roadmap list
- Job description input: optional collapsible text area for job description paste (for keyword gap analysis)
- AI chat panel: persistent side panel or bottom drawer for follow-up questions
- Export button: export full report as PDF or DOCX
- Re-analyze button: upload a new version for comparison
- Back to Home floating button: freely draggable, immediately visible on entry

### 4.8 Visual Details and Micro-Interactions
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
- Animated background gradient: continuous random flowing movement at 60 FPS
- Radial context menu: smooth expand/collapse animation, staggered option appearance, frosted-glass backdrop
- iOS Control Center-style quick access panel: smooth slide-up/expand animation, frosted-glass surface
- Back to Home button: freely draggable floating button, top-left default placement, immediately visible from first frame, gradient styling, snap-to-edge on mobile
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
- Animated background gradient flows continuously behind all Home screen elements as the base layer
- All Home screen surfaces use semi-transparent or frosted-glass treatment
- Admin Mode access point: a dedicated Admin Mode button or link is visible on the Home screen
- Background animation toggle control: accessible on the Home screen
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
- Back to Home floating button: freely draggable, default top-left placement, always rendered above all content from the first frame
- Flexible Menu Layout System (Circular Mode and Grid Mode)
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
- Responsive 3D humanoid robot rendering
- Back to Home floating button: freely draggable, snaps to nearest screen edge on release, immediately visible in every feature section from the first frame
- Home screen on mobile must adapt the visual language of the uploaded home page reference image to smaller screens while maintaining 100% visual fidelity
- Image Generation, Video Generation, PPT Maker, and Resume Analyzer panels adapt to single-column layout on mobile

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
- Application loads instantly with optimized asset preloading and code splitting
- Robot visible in standby within laboratory background environment, with subtle idle animations — silent until user initiates
- Main interface displays: bottom input, sidebar with thread history, flexible menu layout, animated background gradient flowing continuously
- Home screen renders 100% matching the uploaded home page reference image from the first frame
- No registration required; fast loading across all browsers and operating systems
- Thread list loads most recent first
- All buttons display gradient colors on startup; all icons begin ambient slow rotation on startup
- First user interaction with robot triggers greeting with strong bass voice, strictly upward vertical hand movement (0% rotation), and friendly facial expression
- Critical path assets prioritized and loaded first
- Non-critical assets lazy-loaded after initial render
- Service Worker caches core app shell for instant subsequent loads
- Background service health monitor starts on application startup

### 7.2 Thread Management
- New Chat button creates fresh thread
- Clicking any sidebar thread opens conversation instantly with zero delay
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
- Back to Home floating button visible and freely draggable in overlay immediately upon entering the robot section
- Silent until user initiates; first engagement triggers greeting with strictly upward vertical hand movement (0% rotation)
- QAZYEN AI API is 100% operational; all interactions processed reliably with automatic retry and fallback
- Interview mode and Voice assistant mode as described in Section 3.8
- 60 FPS minimum rendering

### 7.5 Image Generation Interaction
- User opens Image Generation panel from menu
- Service selector displays all available lifetime-free services with real-time status badges
- User selects preferred service, enters prompt, configures options, taps Generate
- Automatic failover to next available service if selected service is offline
- Generation progress: non-blocking animated indicator
- On success: generated image displayed with download, share, edit, and regenerate options
- Generated image saved to thread history
- Back to Home floating button freely draggable and immediately visible throughout

### 7.6 Video Generation Interaction
- User opens Video Generation panel from menu
- Service selector displays all available lifetime-free services with real-time status badges
- User selects input mode (Text-to-Video / Image-to-Video / Video-to-Video), configures duration and resolution, taps Generate
- Automatic failover including mode-aware failover for Image-to-Video
- Generation progress: non-blocking progress bar with estimated time remaining
- On success: video displayed with download, share, and regenerate options
- Generated video saved to thread history
- Back to Home floating button freely draggable and immediately visible throughout

### 7.7 PPT Maker Interaction
- User opens PPT Maker panel from menu
- User enters a prompt (text or voice) describing the desired presentation
- AI generates an outline within 5 seconds; user reviews and edits the outline
- User confirms outline; AI generates full presentation within 30 seconds
- User edits individual slides, regenerates specific slides, adjusts theme, or uses AI chat assistant for modifications
- User exports as PPTX, PDF, PNG, MP4, or interactive web link
- Presentation auto-saved to thread history every 30 seconds
- All PPT Maker AI requests are 100% operational with automatic retry and fallback
- Back to Home floating button freely draggable and immediately visible throughout

### 7.8 Resume Analyzer Interaction
- User opens Resume Analyzer panel from menu
- User uploads resume file (PDF, DOCX, TXT) via file picker, drag-and-drop, or clipboard paste
- Uploaded file preview displayed in panel
- User taps Analyze Resume button
- AI processes the resume and generates a complete analysis report within 15–30 seconds
- Analysis report displayed with overall score, category scores, section feedback, keyword analysis, and improvement roadmap
- User can optionally paste a job description for keyword gap analysis
- User can interact with the AI chat assistant for follow-up questions
- User can export the report as PDF or DOCX
- User can upload a revised resume for re-analysis and score comparison
- All Resume Analyzer AI requests are 100% operational with automatic retry and fallback
- Analysis session saved to thread history
- Back to Home floating button freely draggable and immediately visible throughout

### 7.9 Menu Layout Operations

#### Circular Mode
- Click any circular button → radial context menu expands with 7 options in circular arrangement
- Icons spin 360° on click with elastic ease-out (300ms)
- Icons rotate continuously in ambient slow spin during idle
- Entire button ring is user-draggable via swipe/drag with inertial momentum
- Voice feedback on click and on radial menu option selection
- iOS-styled creator button click → opens iOS Control Center-style control panel

#### Grid Mode
- Click any grid button → same 7-option radial context menu expands from the clicked button
- Same animation, dismiss, and voice feedback behavior as Circular Mode
- Icons spin 360° on click with elastic ease-out (300ms)
- Icons rotate continuously in ambient slow spin during idle
- Hover effects on desktop
- iOS-styled creator button click → opens iOS Control Center-style control panel

#### Quick Access Circular Menu Button (iOS Control Center Style)
- Single click/tap opens iOS Control Center-style panel
- Panel contains: Home, User Profile, Dark/Light Mode Toggle
- Panel dismisses on tap/click outside or on pressing the circular button again

#### Layout Switching
- Smooth Material Design transition under 300ms; preference persisted; voice feedback

### 7.10 Radial Context Menu — Option Behaviors
- Home: Immediately navigates to main Home screen
- Back: Navigates back one level within current module; if at top level, returns to Home
- Light/Dark: Toggles Light/Dark Mode; animated background gradient shifts tone accordingly
- Settings: Opens Advanced Settings panel
- Profile: Opens user profile panel
- Feedback: Opens feedback form overlay (text input field, 1–5 star rating, submit button, success confirmation message)
- Admin Mode: Opens Admin Mode login prompt overlay

### 7.11 Back to Home Button — Movability & Navigation Behavior
- Back to Home button is a freely draggable floating button present and immediately visible upon entering every feature module screen — rendered from the first frame, never delayed or hidden
- The button floats above all content layers at all times (highest z-index)
- User can drag the button to any position on the screen at any time
- On mobile: button snaps to nearest screen edge on release with smooth snap animation (150ms ease-out)
- On desktop: button can be freely placed anywhere within the viewport
- Dragged position is persisted per session via local storage
- Long-press (500ms) on mobile or right-click on desktop reveals Reset Position option
- Clicking Back to Home returns user to main Home screen

### 7.12 Dark / Light Mode Switching
- Accessible via radial context menu, iOS Control Center-style quick access panel, iOS-styled creator button control panel, or dedicated toggle button
- Material Design toggle switch with smooth animation and ripple effect
- Light mode: animated background shifts to lighter tone dominance; black text throughout
- Dark mode: animated background shifts to darker tone dominance; white text throughout
- Voice feedback on mode switch

### 7.13 Admin Mode
- Accessible via radial context menu (Admin Mode option) on any menu button, or via dedicated Admin Mode access point on the Home page
- Admin code qazyen123 grants full feature access
- API key management for all integrated services
- Active user monitoring dashboard
- User role management
- Rate-limited failed login attempts
- AI Service Audit Panel: manual audit trigger, per-service health status, lifetime-free verification status, error resolution log

### 7.14 Background Settings Interaction
- Animated background toggle: toggle state switches immediately; background transitions smoothly between animated and static states; toggle state persisted via local storage
- Background image customization: user uploads custom background image; real-time preview shown; custom image applied globally; gradient overlay opacity slider adjusts the blend; Reset to Default button restores the default animated gradient

### 7.15 Global Error Handling Behavior
- The message App modification failed. Please try again later or submit feedback. is permanently suppressed and must never appear anywhere in the application under any condition
- All runtime errors, unhandled promise rejections, network failures, API errors, rendering exceptions, and module load failures are caught by a global error boundary and handled silently
- Global error boundary behavior:
  - Catches all component-level errors and rendering exceptions
  - On error: the affected component is silently replaced with its last known good state or a minimal placeholder
  - No error message, no failure modal, no toast notification referencing a failure is shown to the user
  - Error details are logged silently to the admin dashboard for monitoring purposes only
- Network failure handling: all fetch/API calls wrapped in try-catch with automatic retry logic
- WebGL/3D rendering failure handling: falls back to a 2D animated avatar seamlessly
- The app must always render something useful — zero blank screens, zero dead ends, zero blocking error states visible to the user

---

## 8. Security Requirements

- TLS 1.3 for all data in transit; AES-256 for data at rest
- Admin code stored and validated server-side; failed attempts rate-limited; JWT sessions
- **API Key Security:**
  - All API keys stored encrypted server-side
  - API keys are never exposed to the client or end users
  - Only authenticated admins can view (masked), update, or rotate API keys via the Admin Dashboard
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
- Thread switching: under 100ms
- Click response: under 50ms
- PPT outline generation: within 5 seconds; full presentation generation: within 30 seconds
- Resume analysis: within 15 seconds for single-page resume; within 30 seconds for multi-page resume
- Reset app data: within 5 seconds
- Voice synthesis latency: under 500ms
- API response: under 1 second with automatic failover
- Menu layout switch: under 300ms
- Icon rotation animation response on click: under 50ms
- Radial context menu open animation: under 200ms
- Animated background gradient: 60 FPS continuous, GPU-accelerated
- Back to Home button render time: 0ms delay — present from first frame of any module screen
- Back to Home button drag response: under 16ms (60 FPS drag tracking)
- Mobile edge snap animation: 150ms ease-out
- Home screen render time: 0ms delay
- 100% error-free and bug-free operation
- Image generation API response: 100% successful delivery across all integrated lifetime-free services
- Video generation API response: 100% successful delivery across all integrated lifetime-free services
- PPT Maker AI response: 100% successful delivery; automatic retry and failover ensure zero failed requests reaching the user
- Resume Analyzer AI response: 100% successful delivery; automatic retry and failover ensure zero failed requests reaching the user
- Service health check cycle: every 5 minutes per service

### 9.2 Optimization Strategies
- Code splitting and lazy loading
- Service Worker with aggressive caching
- CDN delivery for all static assets
- Image optimization: WebP format, responsive srcset, lazy loading
- GPU-accelerated rendering for animated background gradient
- Icon rotation uses CSS transform for GPU acceleration
- Radial context menu uses CSS transform and opacity for GPU-accelerated animation
- Back to Home floating button drag uses CSS transform for GPU-accelerated repositioning
- 3D robot model uses progressive loading with low-poly placeholder
- Memory optimization: unused module assets released when navigating away
- Progressive video rendering, 3D LOD system
- Database indexing, caching, thread pagination
- WebSocket real-time updates without polling
- Bundle size minimized via tree-shaking and minification
- Critical CSS inlined in HTML for zero render-blocking
- Global error boundary implemented at the root component level
- All AI service API integrations use connection pooling, request queuing, and automatic failover
- Service health monitor runs on a dedicated background worker thread
- PPT Maker and Resume Analyzer AI requests use connection pooling and request queuing with automatic failover to maintain 100% reliability

---

## 10. Data Management

### 10.1 Persistent Storage
- Conversation threads and complete history
- Thread metadata (title, creation date, last modified, message count)
- Generated images, videos, note summaries, interview sessions, PPT projects, video editing projects, resume analysis sessions
- User preferences, menu layout mode preference, robot customization, voice settings, advanced settings configurations
- User profile information and role assignments
- Back to Home button position preference (persisted per session via local storage)
- Background animation toggle state (persisted via local storage)
- Custom background image (stored in database, synced across devices)
- Gradient overlay opacity preference (persisted via local storage)
- API key configurations (encrypted, admin-managed, server-side only)
- Admin audit logs
- Service health check logs
- User's last selected service preferences for image and video generation
- User's last selected video duration, resolution, and input mode preferences
- PPT Maker project auto-save state (every 30 seconds)
- Resume Analyzer session history with score snapshots for comparison

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
- Seamless dark/light mode switching with full UI adaptation
- Text color: white in dark mode, black in light mode throughout entire app
- File upload for image and video generation, document processing, PPT Maker, Resume Analyzer, and all applicable modules
- AI personality and theme customization
- Offline basic mode, cross-device sync, smart notifications, cloud auto-backup
- Material Design animations and micro-interactions throughout
- Voice input/output integrated throughout entire application
- All services lifetime free with automatic API key rotation; no billing, subscription, or paywall
- 100% cinematic, gaming-quality, professional, bug-free, error-free operation
- All menu button icons rotate continuously (ambient slow spin 2–4 RPM) and perform 360° fast spin on click
- Circular button ring is user-draggable with inertial swipe-to-rotate
- Entire app background features continuously animated flowing gradient with user-controllable on/off toggle
- Background image customization throughout the entire application
- Radial context menu with 7 options opens on any menu button click in both layout modes
- iOS Control Center-style quick access circular menu button available on all screens
- iOS-styled creator menu button (Muhhamed Yasin / Munaf) present in both Circular and Grid modes
- Back to Home button is a freely draggable floating button — always rendered above all content layers from the first frame of any module screen with zero delay
- Robot appearance 100% matches uploaded image.png with shiny metallic aluminium body
- Robot greeting hand movement: strictly upward 100% vertical direction, 0% rotation
- The message App modification failed. Please try again later or submit feedback. must never appear anywhere in the application
- PPT Maker: 100% Gamma AI feature parity — all Gamma tool features fully operational including outline generation, full presentation generation, per-slide editing, AI chat assistant, template library, chart generation, collaboration, version history, and all export formats
- Resume Analyzer: 100% operational AI-powered analysis — all analysis features fully working including overall score, section-by-section feedback, ATS compatibility check, keyword analysis, job description matching, grammar check, AI rewrite suggestions, improvement roadmap, industry benchmarking, AI chat assistant, and export
- Image generation: dedicated multi-service panel with all services 100% operational, lifetime-free, with real-time status indicators; automatic failover; Sora 2 permanently excluded
- Video generation: dedicated multi-service panel with all services 100% operational, lifetime-free, with real-time status indicators; user-configurable duration and resolution; input mode selector supporting Text-to-Video, Image-to-Video, and Video-to-Video; Sora 2 permanently excluded
- Comprehensive AI service reliability system: background health monitor (every 5 minutes), proactive error detection and auto-fix, error classification, admin error resolution log
- Lifetime-free verification mechanism per service
- Admin Mode access point visible on the Home page, gated by admin code qazyen123
- Admin can view active users in real-time and manage user roles
- Admin password is hidden and stored securely server-side

### 11.3 User Experience Goals
The application must feel: Premium, Fast, Intelligent, Responsive, Professional, Calm, Trustworthy, Extremely satisfying, Zero-friction, Smart-defaulted, Home screen visually identical to the uploaded home page reference image at 100% fidelity, Ultra-clean and futuristic, Friendly yet powerful, Minimal distractions, Cinematic and gaming-quality, 100% error-free, Instantly responsive, Fully interactive, Flexible and customizable with gradient aesthetics, Immersive with animated background gradient (user-controllable), Effortlessly navigable with Back to Home freely movable and immediately visible on every screen upon entry, Satisfyingly tactile with rotating icon interactions, Intuitively contextual with radial menu quick-access options, Empowering with a draggable Back to Home button, Always functional and always showing content with zero dead ends or blocking error states, Reliably powerful with 100% operational AI services, Intuitively accessible with iOS Control Center-style quick access panel, Personally connected with iOS-styled creator button opening a friendly control panel, Completely free with no billing friction or paywalls anywhere, Transparently reliable with real-time service status indicators, Creatively versatile with Image-to-Video generation, Productively powerful with a 100% Gamma-identical PPT Maker that generates professional presentations from a single prompt, Analytically insightful with a 100% operational AI Resume Analyzer that delivers comprehensive, actionable feedback on every uploaded resume.

---

## 12. Security Plan Summary

### 12.1 Admin Password Security
- Admin password (qazyen123) is stored exclusively server-side in an encrypted format
- Password is never included in client-side code, configuration files, or transmitted in plaintext
- Admin login prompt validates the code via a secure server-side API call
- Failed login attempts are rate-limited (maximum 5 attempts per 15 minutes per IP)
- All admin login attempts (successful and failed) are logged in the audit trail

### 12.2 API Key Security Plan
- All API keys stored encrypted server-side (AES-256)
- Keys are never exposed to end users or in client-side bundles
- Admin Dashboard provides masked key display with explicit reveal action
- Key rotation: admin can manually rotate any key; system also auto-rotates on balance exhaustion
- All key changes logged with timestamp and admin identifier
- Separate key slots per service with primary and backup key slots for seamless automatic failover

---

## 13. Future Expansion Roadmap
- Phase 1: Stable release with all core features, Unity 3D humanoid robot, flexible menu layout, gradient color system, animated background gradient with toggle, background image customization, rotating icons, radial context menu, iOS Control Center-style quick access panel, iOS-styled creator button, freely movable Back to Home button, multi-service image generation panel, multi-service video generation panel with full input mode support, 100% Gamma-identical PPT Maker, 100% operational AI Resume Analyzer, comprehensive AI service reliability system, lifetime free APIs, global silent error handling, 100% operational AI services, dual-mode admin/user system, zero billing or paywall elements
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
Qazyen AI is a Perplexity AI and Gemini-level conversational engine powered by killing AI, a 100% operational AI-powered media generation powerhouse featuring a multi-service image generation panel (geminit AI, Gemini, Stable Diffusion via Hugging Face, FLUX.1-schnell via Hugging Face, and Pollinations AI — all lifetime-free, all with real-time Online/Offline/Degraded status indicators, automatic failover, and admin-manageable API keys) and a multi-service video generation panel (nand AI, Pollinations AI Video, and Hugging Face zeroscope — all lifetime-free, all with real-time status indicators, user-configurable duration from 5 to 10 seconds, user-selectable resolution from 480p to 4K, a dedicated input mode selector supporting Text-to-Video, Image-to-Video with image file upload and optional text prompt, and Video-to-Video with video file upload and optional text prompt, automatic failover including mode-aware failover, and admin-manageable API keys; Sora 2 permanently excluded), a photorealistic 3D virtual humanoid robot companion (QAZYEN — 100% matching the uploaded image.png with shiny metallic aluminium body, strictly upward 100% vertical hand movement with 0% rotation during greeting, 100% professional hand and body movements in all other interactions, and a high-fidelity laboratory background environment, powered by a 100% operational killing AI API), a 100% Gamma-identical AI PPT Maker (implementing every Gamma tool feature including prompt-to-outline-to-full-presentation workflow, per-slide editing, AI chat assistant, template library with 20+ templates, chart and graph generation, collaboration with real-time presence, version history, and export as PPTX/PDF/PNG/MP4/web link — all 100% working and 100% responsive), a 100% operational AI-powered Resume Analyzer (delivering comprehensive analysis including overall score, section-by-section feedback, ATS compatibility check, keyword analysis with job description matching, grammar and tone check, AI rewrite suggestions, improvement roadmap, industry benchmarking, AI chat assistant, and export as PDF/DOCX — all 100% working and 100% responsive), a professional video editor, productivity assistant, research partner, multilingual voice companion (46+ languages), creative studio, secure knowledge vault, multi-modal file upload and AI processing, and cross-platform AI ecosystem. The Home screen is built to 100% match the visual design shown in the uploaded home page reference image (file-aig01c6yjitc.png) at pixel-perfect fidelity, with all other screens referencing qazyen app design.png for visual guidance, enhanced with Material Design robot-themed aesthetics, a flexible menu layout system (Circular Mode and Grid Mode), a full-spectrum gradient color scheme, a continuously animated flowing background gradient with user-controllable on/off toggle, customizable background images throughout the entire application, rotating circular icons, a 7-option radial context menu, an iOS Control Center-style quick access circular menu button, an iOS-styled creator menu button (Muhhamed Yasin / Munaf), a freely draggable floating Back to Home button, voice input/output throughout without wake word, JARVIS-like features, automatic API key rotation, database-backed thread history, a comprehensive AI service reliability system, a global silent error handling system, a dedicated Admin Mode access point on the Home page (gated by admin code qazyen123) with real-time active user monitoring, user role management, and secure encrypted API key management for all integrated services. Admin password: qazyen123. All services lifetime free and unlimited with zero billing, subscription, or paywall. No registration required. 100% cinematic, gaming-quality, professional, bug-free, error-free, instantly responsive, and gradient-styled throughout.

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
10. iOS Control Center Reference: iOS Control Center design pattern for the quick access circular menu button panel
11. iOS-Styled Creator Button Reference: iOS Control Center design pattern applied to the creator identity button (Muhhamed Yasin / Munaf)
12. Gamma AI PPT Reference: Gamma AI platform — 100% feature parity implementation including every Gamma tool feature: prompt input, AI outline generation, full presentation generation, per-slide editing, AI chat assistant, template library (20+ templates), smart layout engine, AI content generation per slide, visual and media integration (stock images, icons, charts, tables, GIFs, video embeds), drag-and-drop editing, text formatting toolbar, element layering, undo/redo (50+ steps), transition and animation effects, present mode, presenter view, real-time collaboration with presence indicators, comment system, version history, share link generation, export as PPTX/PDF/PNG/MP4/web link, import from PPTX/Google Slides/PDF, and accessibility features — all 100% working and 100% responsive
13. Resume Analyzer AI Reference: 100% operational AI-powered resume analysis — all features fully working including overall score (0–100) with category breakdown, section-by-section analysis, ATS compatibility check, keyword analysis with job description matching, impact and achievement analysis, grammar and tone check, AI rewrite suggestions, tailored improvement roadmap, industry and role benchmarking, AI chat assistant, export as PDF/DOCX, re-analysis with score comparison, and auto-save to thread history — all 100% working and 100% responsive
14. Error Handling Reference: global silent error boundary — the message App modification failed. Please try again later or submit feedback. is permanently suppressed; all errors handled silently and automatically; app always remains visible and functional
15. AI Service Reliability Reference: all AI services must achieve 100% operational reliability; background health monitor runs every 5 minutes per service; lifetime-free verification enforced per service; Sora 2 permanently excluded; all services are 100% free with lifetime access and no billing or paywall; admin can manage all API keys securely via Admin Dashboard
16. Image Generation Services Reference: geminit AI, Gemini (Google), Stable Diffusion via Hugging Face Inference API (stabilityai/stable-diffusion-xl-base-1.0), FLUX.1-schnell via Hugging Face Inference API (black-forest-labs/FLUX.1-schnell), Pollinations AI (pollinations.ai image API) — all lifetime-free, all with real-time status indicators
17. Video Generation Services Reference: nand AI, Pollinations AI Video (pollinations.ai video API), Hugging Face Video zeroscope (zeroscope_v2_576w via Hugging Face Inference API) — all lifetime-free, all with real-time status indicators, user-configurable duration (5–10 seconds) and resolution (480p / 720p / 1080p / 2K / 4K), input mode selector supporting Text-to-Video, Image-to-Video (image file upload: JPG/PNG/WEBP, with optional text prompt), and Video-to-Video (video file upload: MP4/MOV/AVI, with optional text prompt); Sora 2 permanently excluded