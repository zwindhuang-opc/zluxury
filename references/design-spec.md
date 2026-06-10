# ZLuxury Platform - Design Specifications

## 1. UI/UX Design System

### 1.1 Design Language

#### ZLuxury Design Philosophy
- **极简奢华** (Minimalist Luxury): Clean, spacious layouts with premium feel
- **东西方融合** (East-West Fusion): Modern design with Chinese cultural sensitivity
- **科技感** (Tech-forward): AI-powered interactions with futuristic elements

#### Color Palette

| Color Name | Hex Code | Usage | Chinese Name |
|------------|----------|-------|-------------|
| Primary Dark | `#050505` | Background, primary surfaces | 主背景 |
| Dark 2 | `#0f0f0f` | Cards, secondary backgrounds | 卡片背景 |
| Dark 3 | `#1a1a1a` | Elevated surfaces, modals | 浮层背景 |
| Gray | `#2a2a2a` | Borders, dividers | 边框线 |
| Text | `#f5f5f5` | Primary text | 主文字 |
| Text Muted | `#8a8a8a` | Secondary text | 次要文字 |
| Accent | `#00B4D8` | Primary actions, highlights | 主色调 |
| Accent Light | `#00D4F4` | Hover states | 悬停色 |
| Accent Dark | `#0096C7` | Active states | 激活色 |
| Gold | `#D4AF37` | VIP elements, premium | 金色 |
| Gold Light | `#E5C158` | Gold highlights | 亮金色 |
| Success | `#00D26A` | Success states | 成功色 |
| Warning | `#F57C00` | Warning states | 警告色 |
| Error | `#C62828` | Error states | 错误色 |

#### Typography

**Primary Fonts:**
- **Montserrat**: Headings, navigation, UI elements
- **Playfair Display**: Brand names, hero text
- **Inter**: Body text, descriptions

**Font Sizes:**
```
Hero: 64px / 4rem (line-height: 1.1)
H1: 48px / 3rem (line-height: 1.2)
H2: 36px / 2.25rem (line-height: 1.3)
H3: 24px / 1.5rem (line-height: 1.4)
H4: 20px / 1.25rem (line-height: 1.4)
Body Large: 18px / 1.125rem (line-height: 1.6)
Body: 16px / 1rem (line-height: 1.6)
Body Small: 14px / 0.875rem (line-height: 1.5)
Caption: 12px / 0.75rem (line-height: 1.4)
```

**Chinese Typography:**
- 使用苹方 (PingFang) 字体
- 宋体用于长文阅读
- 楷体用于引用和强调

#### Spacing System

**Base Unit**: 4px

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
32: 128px
```

**Component Spacing:**
- Card padding: 24px
- Section padding: 64px vertical
- Grid gap: 24px
- Button padding: 12px 24px

#### Border Radius

```
none: 0px
sm: 4px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

#### Shadows

```
sm: 0 1px 2px rgba(0, 0, 0, 0.05)
md: 0 4px 6px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px rgba(0, 0, 0, 0.15)
2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
glow: 0 0 20px rgba(0, 180, 216, 0.3)
gold-glow: 0 0 20px rgba(212, 175, 55, 0.3)
```

### 1.2 Component Library

#### Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
transition: all 0.3s ease;
```
Hover: Scale 1.02, shadow-lg  
Active: Scale 0.98, darker shade  
Disabled: Opacity 0.5, cursor not-allowed

**Secondary Button:**
```css
background: transparent;
border: 1px solid #2a2a2a;
color: #f5f5f5;
padding: 12px 24px;
border-radius: 8px;
```
Hover: Border color #00B4D8, text #00B4D8

**Premium Button (VIP):**
```css
background: linear-gradient(135deg, #D4AF37 0%, #B8962E 100%);
color: #050505;
padding: 12px 24px;
border-radius: 8px;
font-weight: 700;
```
Glow effect on hover

**Icon Button:**
```css
width: 40px;
height: 40px;
border-radius: 50%;
background: #1a1a1a;
icon-color: #f5f5f5;
```
Hover: Background #2a2a2a

#### Cards

**Product Card:**
```css
background: #0f0f0f;
border: 1px solid #2a2a2a;
border-radius: 12px;
overflow: hidden;
transition: all 0.3s ease;
```
Hover: Border #00B4D8, translateY(-4px), shadow-lg

**Glass Card:**
```css
background: rgba(15, 15, 15, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(42, 42, 42, 0.5);
border-radius: 16px;
```

#### Input Fields

**Text Input:**
```css
background: #1a1a1a;
border: 1px solid #2a2a2a;
border-radius: 8px;
padding: 12px 16px;
color: #f5f5f5;
font-size: 14px;
```
Focus: Border #00B4D8, box-shadow glow

**Search Input:**
```css
background: #0f0f0f;
border: 2px solid transparent;
border-radius: 24px;
padding: 12px 24px;
icon: magnifying glass on left
```

#### Chat Components

**Chat Bubble (User):**
```css
background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
color: white;
border-radius: 16px 16px 4px 16px;
max-width: 70%;
padding: 12px 16px;
```

**Chat Bubble (AI):**
```css
background: #1a1a1a;
border: 1px solid #2a2a2a;
color: #f5f5f5;
border-radius: 16px 16px 16px 4px;
max-width: 80%;
padding: 12px 16px;
```

**Typing Indicator:**
```css
Three dots animation
Dot size: 8px
Animation: bounce 0.6s infinite
Colors: gradient from accent
```

### 1.3 Animations

**Standard Transitions:**
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Page Transitions:**
- Fade in: opacity 0 → 1, duration 400ms
- Slide up: translateY(20px) → 0, duration 400ms

**Hover Effects:**
- Scale: 1 → 1.02, duration 200ms
- Color change: duration 200ms
- Shadow elevation: duration 300ms

**Loading States:**
- Skeleton pulse: opacity 0.5 → 1, 1.5s infinite
- Spinner: rotate 360deg, 1s linear infinite

**Micro-interactions:**
- Button press: scale 0.98
- Card hover: translateY(-4px)
- Icon hover: rotate(15deg)
- Notification badge: pulse animation

### 1.4 Responsive Design

**Breakpoints:**
```
Mobile: < 640px (sm)
Tablet: 640px - 1024px (md)
Desktop: 1024px - 1280px (lg)
Large Desktop: > 1280px (xl)
```

**Grid System:**
```
Mobile: 1 column
Tablet: 2 columns
Desktop: 3-4 columns
Large: 4-6 columns
```

**Spacing Adjustments:**
```
Mobile: 16px padding
Tablet: 24px padding
Desktop: 32px+ padding
```

## 2. Layout System

### 2.1 Page Structure

#### Header
- **Height**: 64px (desktop), 56px (mobile)
- **Components**: Logo, Navigation, Search, User Menu, Cart, Language
- **Sticky**: Yes, with blur backdrop
- **Mobile**: Hamburger menu

#### Hero Section
- **Full viewport height** on homepage
- **Gradient overlay** for text readability
- **Animated elements** on scroll

#### Content Sections
- **Max width**: 1280px
- **Padding**: 64px vertical
- **Background alternation**: Dark/Medium Dark

#### Footer
- **4-column layout** (desktop)
- **Newsletter signup**
- **Social links**
- **Payment icons**

### 2.2 Navigation

#### Desktop Navigation
```
Logo | Products | Auctions | Services | About | [Search] | [Lang] | [User] | [Cart]
```

#### Mobile Navigation
- Bottom navigation bar
- 5 main icons: Home, Products, AI Chat, Cart, Profile
- Floating action button for AI chat

### 2.3 Page Templates

#### Homepage
1. Hero with video/image background
2. Featured products carousel
3. AI Assistant introduction
4. Category showcase
5. VIP membership benefits
6. Testimonials
7. Newsletter signup
8. Footer

#### Product Listing Page
1. Breadcrumb navigation
2. Filter sidebar (collapsible on mobile)
3. Product grid with infinite scroll
4. Sort options
5. Pagination

#### Product Detail Page
1. Image gallery with zoom
2. Product info (name, price, specs)
3. Size/variant selector
4. Add to cart button
5. AI recommendation widget
6. Tabs: Description, Reviews, Authentication
7. Related products

#### AI Chat Interface
1. Persistent floating widget
2. Agent selector
3. Chat history
4. Quick action buttons
5. Language toggle
6. Rating system

## 3. User Experience Design

### 3.1 User Flows

#### Browsing Flow
```
Landing → Categories → Product List → Product Detail → [Add to Cart] / [Chat with AI]
```

#### Purchase Flow
```
Add to Cart → Review Cart → Checkout → Payment → Order Confirmation → Tracking
```

#### AI Interaction Flow
```
Click Chat → Select Agent → Type Message → AI Response → Rate Response → Continue / End
```

#### VIP Upgrade Flow
```
View Benefits → Check Eligibility → Upgrade → Enjoy VIP Perks
```

### 3.2 Interaction Patterns

#### Hover States
- All interactive elements must have hover feedback
- Subtle scale or color changes
- Tooltips for icon buttons

#### Loading States
- Skeleton screens for content
- Spinners for actions
- Progress bars for uploads

#### Empty States
- Friendly illustrations
- Helpful suggestions
- Call to action buttons

#### Error States
- Clear error messages
- Recovery suggestions
- Contact support option

### 3.3 Accessibility

#### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators visible
- Escape to close modals
- Arrow keys for carousels

#### Screen Reader Support
- Semantic HTML
- ARIA labels
- Alt text for images
- Role attributes

#### Color Contrast
- Minimum 4.5:1 for text
- 3:1 for large text
- Focus indicators visible

### 3.4 Internationalization (i18n)

#### Supported Languages
1. 简体中文 (Simplified Chinese) - Primary
2. 繁體中文 (Traditional Chinese)
3. English (US)
4. 粤语 (Cantonese) - Voice only

#### Implementation
- react-i18next for translations
- Separate translation files
- RTL support ready
- Date/time localization
- Currency formatting

## 4. Visual Design

### 4.1 Imagery

#### Photography Style
- High contrast
- Dramatic lighting
- Product-focused
- Lifestyle context
- Authentic, not staged

#### Image Sizes
```
Hero: 1920x1080 (16:9)
Product Large: 800x800 (1:1)
Product Thumb: 400x400 (1:1)
Category: 600x400 (3:2)
Avatar: 128x128 (1:1)
OG Image: 1200x630 (1.91:1)
```

#### Icons
- Lucide React library
- Consistent 24px size
- Stroke width: 2px
- Color: Current color (inherits)

### 4.2 Illustration Style

#### Custom Illustrations
- Minimalist line art
- Gradient accents
- Animated for key moments
- Branded color palette

#### 3D Elements
- Product renders
- Animated mascots
- Loading animations

### 4.3 Video

#### Hero Videos
- Autoplay muted
- Loop enabled
- Quality: 1080p minimum
- Mobile: Fallback to image

#### Product Videos
- 360° views
- Detail close-ups
- Lifestyle shots
- Behind the scenes

### 4.4 Motion Design

#### Page Load
1. Fade in content (400ms)
2. Staggered reveals (100ms delay each)
3. Skeleton to content transition

#### Scroll Animations
- Fade in on viewport entry
- Parallax for hero
- Reveal on scroll for sections
- Sticky elements for navigation

#### Interaction Feedback
- Ripple effect on buttons
- Scale bounce on success
- Shake on error
- Smooth transitions

## 5. Brand Guidelines

### 5.1 Logo Usage

#### Primary Logo
- Full color version for light backgrounds
- White version for dark backgrounds
- Minimum size: 120px width
- Clear space: 1x logo height

#### Icon Logo
- Square format for favicons
- Social media profile images
- App icons

### 5.2 Voice & Tone

#### Writing Style
- Professional yet approachable
- Confident, not arrogant
- Helpful and informative
- Cultural sensitivity

#### Vocabulary
- Premium vocabulary: 奢华, 精致, 尊享, 专属
- Action words: 探索, 发现, 体验, 享受
- Avoid: 便宜, 打折, 甩卖

#### Chinese Copywriting
- 使用尊称：您
- 正式语气但亲切
- 传统节日问候
- 避免网络流行语

### 5.3 Imagery Guidelines

#### Do's
- Authentic photography
- Diverse representation
- Lifestyle integration
- Quality focus

#### Don'ts
- Stock photo look
- Overly edited images
- Stereotypical representations
- Low-quality assets

## 6. Component Specifications

### 6.1 Navigation Components

#### Navbar
- **States**: Default, Scrolled (compact), Mobile
- **Behavior**: Sticky on scroll, blur background
- **Mobile**: Hamburger menu, slide-in drawer

#### Breadcrumbs
- **Separator**: Chevron icon
- **Truncation**: Ellipsis for long paths
- **Link**: All except current page

#### Tabs
- **Style**: Underline indicator
- **Animation**: Slide indicator on change
- **Overflow**: Horizontal scroll with fade edges

### 6.2 Content Components

#### Product Card
- **Image**: Aspect ratio 1:1, lazy load
- **Badges**: New, Sale, VIP Exclusive
- **Actions**: Quick view, Wishlist, Compare
- **Hover**: Image zoom, quick add

#### Modal
- **Overlay**: Semi-transparent black
- **Animation**: Scale + fade in
- **Close**: X button, Escape key, click outside
- **Sizes**: sm (400px), md (600px), lg (800px), full

#### Toast Notifications
- **Position**: Bottom right
- **Duration**: 5 seconds
- **Types**: Success, Error, Warning, Info
- **Action**: Optional dismiss button

### 6.3 Form Components

#### Input Fields
- **States**: Default, Focus, Error, Disabled, Success
- **Validation**: Real-time with debounce
- **Help text**: Below input
- **Error message**: Red text with icon

#### Select/Dropdown
- **Search**: Filterable option
- **Multi-select**: Chip display
- **Grouped**: Category headers
- **Empty**: "No results" message

#### Checkbox/Radio
- **Custom styled**: Replace native
- **Animation**: Checkmark draw
- **Group**: Vertical or horizontal layout

### 6.4 Data Display

#### Tables
- **Responsive**: Horizontal scroll or card view
- **Sorting**: Click header to sort
- **Pagination**: Bottom with page numbers
- **Empty**: Illustration + message

#### Charts
- **Style**: Dark theme compatible
- **Colors**: Brand palette
- **Tooltips**: On hover
- **Responsive**: Resize with container

## 7. Technical Design

### 7.1 Frontend Architecture

#### Framework: Next.js 14.2
- App Router for routing
- Server Components for initial render
- Client Components for interactivity
- API Routes for backend

#### State Management
```
Global State (Zustand):
├── Auth State
│   ├── User info
│   ├── Token
│   └── VIP level
├── Cart State
│   ├── Items
│   ├── Total
│   └── VIP discount
├── AI Chat State
│   ├── Messages
│   ├── Selected agent
│   └── Language preference
└── UI State
    ├── Theme
    ├── Sidebar open
    └── Modal state
```

#### Data Fetching
- Server Components: Direct DB/API calls
- Client: React Query for caching
- Optimistic updates for better UX

### 7.2 Component Architecture

#### Atomic Design
```
Atoms: Button, Input, Icon, Badge, Avatar
Molecules: SearchBar, ProductCard, ChatBubble
Organisms: Header, ProductGrid, AIChatWidget
Templates: PageLayout, ProductPage, CheckoutPage
Pages: Homepage, ProductDetail, Cart, Profile
```

#### Composition Pattern
```typescript
<Card>
  <Card.Header>
    <ProductBadge type="new" />
    <ProductTitle />
  </Card.Header>
  <Card.Image>
    <ProductImage />
    <ProductQuickActions />
  </Card.Image>
  <Card.Body>
    <ProductPrice />
    <ProductRating />
  </Card.Body>
  <Card.Footer>
    <AddToCartButton />
    <WishlistButton />
  </Card.Footer>
</Card>
```

### 7.3 Performance Optimization

#### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports for modals

#### Asset Optimization
- Next.js Image component
- WebP/AVIF formats
- Responsive images
- Font subsetting

#### Caching Strategy
- SWR for client data
- ISR for product pages
- Edge caching for static

## 8. Quality Checklist

### 8.1 Design QA

- [ ] All hover states implemented
- [ ] All click actions have feedback
- [ ] Loading states for all async actions
- [ ] Error states handled gracefully
- [ ] Empty states designed
- [ ] Responsive breakpoints tested
- [ ] Dark mode (if applicable)
- [ ] Accessibility check completed
- [ ] Cross-browser testing
- [ ] Performance metrics met

### 8.2 Content QA

- [ ] All copy proofread
- [ ] No placeholder text
- [ ] Images optimized
- [ ] Translations complete
- [ ] SEO meta tags set
- [ ] Open Graph images
- [ ] Favicon/icon set
- [ ] 404 page designed

### 8.3 Technical QA

- [ ] No console errors
- [ ] All forms functional
- [ ] API integrations tested
- [ ] Authentication flow works
- [ ] Payment flow tested
- [ ] Error boundaries set
- [ ] Analytics events fired
- [ ] Error logging enabled
- [ ] Security headers set

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-08  
**Author**: ZLuxury Design Team  
**Status**: Complete