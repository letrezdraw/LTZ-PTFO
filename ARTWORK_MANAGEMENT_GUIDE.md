# 🎨 Artwork Management Guide

Complete guide to adding and managing artworks in your portfolio using the new optimized workflow.

---

## **Quick Start** ⚡

### **Option 1: Simple Workflow (Manual)**

```bash
# 1. Add your artwork folder and images
# Example: public/artwork/11 Solar_Eyes Character_Art/
# Include: 1.jpg, 2.jpg (or any numbered images)

# 2. Auto-generate manifest with metadata
npm run scan:artwork

# 3. Optimize images automatically (creates -thumb, -web, -hd variants)
npm run optimize:artwork

# 4. Verify on website
npm run dev
```

### **Option 2: Dashboard Workflow (Easy Metadata Editing)**

```bash
# 1. Open your website in browser
npm run dev

# 2. Press Alt+Q (or Cmd+Q on Mac) to open dashboard
# ✅ Dashboard appears with all artworks

# 3. Select artwork from left panel
# Edit metadata on the right (title, tags, description, etc.)

# 4. Export JSON
# Click "📤 Export JSON" button

# 5. Replace manifest file
# Copy exported JSON to: public/artwork-manifest.json

# 6. Refresh page to see changes
```

---

## **Complete Workflow Step-by-Step**

### **Step 1: Prepare Your Artwork Folder**

Create a folder in `public/artwork/` with this exact format:

```
public/artwork/
├── 1 Orangescape Character_Art/
├── 2 Crimson_Fan Character_Art/
├── 11 Solar_Eyes Character_Art/          ← Your new artwork
│   ├── 1.jpg                            ← Primary image (required)
│   ├── 1-thumb.jpg                      ← Optional (auto-generated)
│   ├── 1-web.jpg                        ← Optional (auto-generated)
│   ├── 1-hd.jpg                         ← Optional (auto-generated)
│   ├── 2.jpg                            ← Secondary image (optional)
│   ├── 2-thumb.jpg                      ← Optional variants
│   └── ...
```

**Folder Naming Rules:**
- Format: `<ORDER_NUMBER> <TITLE_WITH_UNDERSCORES> <CATEGORY>`
- Order: Always start with number (e.g., `11`, `12`, `100`)
- Title: Use underscores for spaces
- Category: Final term (e.g., `Character_Art`, `Concept_Art`, `Fan_Art`, `Splash_Art`)

**Example names:**
- ✅ `11 Solar_Eyes Character_Art`
- ✅ `12 Neon_Dragon Splash_Art`
- ✅ `13 Forest_Environment Concept_Art`
- ❌ `Solar Eyes` (missing order & category)
- ❌ `11 Solar Eyes Concept` (spaces in title)

---

### **Step 2: Optimize Images** 🖼️

Run the image optimizer to create responsive variants:

```bash
npm run optimize:artwork
```

**What it does:**
- Scans all artwork folders
- Creates `-thumb.jpg` (1080px, 90% quality)
- Creates `-web.jpg` (1080px, 90% quality)
- Creates `-hd.jpg` (full quality)
- Uses JPEG compression for performance

**Result:**
```
11 Solar_Eyes Character_Art/
├── 1.jpg           ← Original
├── 1-thumb.jpg     ← 1080px, 90% quality ✨ NEW
├── 1-web.jpg       ← 1080px, 90% quality ✨ NEW
└── 1-hd.jpg        ← Full quality ✨ NEW
```

---

### **Step 3: Generate Manifest**

Run the scanner to auto-generate artwork manifest:

```bash
npm run scan:artwork
```

**Output:** `public/artwork-manifest.json`

```json
[
  {
    "id": "ART-011",
    "folder": "11 Solar_Eyes Character_Art",
    "order": 11,
    "title": "Solar Eyes",
    "category": "Character Design",
    "year": "",
    "medium": "Digital",
    "tags": [],
    "tools": [],
    "description": "",
    "commissionStatus": "OPEN",
    "image": "artwork/11 Solar_Eyes Character_Art/1.jpg",
    "imageThumb": "artwork/11 Solar_Eyes Character_Art/1-thumb.jpg",
    "imageWeb": "artwork/11 Solar_Eyes Character_Art/1-web.jpg",
    "imageHd": "artwork/11 Solar_Eyes Character_Art/1-hd.jpg"
  }
]
```

---

### **Step 4: Edit Metadata in Dashboard** 📊

Open the dashboard to add rich metadata:

```bash
npm run dev
```

**In browser:** Press **Alt+Q** (or **Cmd+Q** on Mac)

**Edit these fields:**
- **Title** - Artwork name
- **Category** - Type of art
- **Year** - Creation year
- **Medium** - Software/technique used
- **Tags** - Keywords (comma-separated)
  - Examples: `character, digital, anime-style, fantasy`
- **Tools** - Software/hardware used (comma-separated)
  - Examples: `Photoshop, Wacom, Procreate`
- **Commission Status** - Open / Closed / Available
- **Description** - Detailed description of the artwork

**Features:**
- ✅ Browse all artworks in left panel
- ✅ Filter by category
- ✅ Reorder artworks with ↑↓ buttons
- ✅ Edit metadata in real-time
- ✅ See live changes highlighted

---

### **Step 5: Export & Save**

**In Dashboard:**

1. Click **📤 Export JSON**
2. Browser downloads `artwork-manifest.json`

**Replace the manifest file:**

```bash
# Option A: Drag-and-drop in file explorer
# From: Downloads/artwork-manifest.json
# To:   public/artwork-manifest.json

# Option B: Copy-paste via terminal
cp ~/Downloads/artwork-manifest.json public/artwork-manifest.json
```

---

### **Step 6: Verify Changes**

```bash
npm run dev
```

- Gallery displays your new artwork
- Metadata appears on hover/in lightbox
- Responsive images load correctly
- Desktop network rotates artworks
- Mobile grid scrolls smoothly

---

## **Advanced: Multiple Images per Artwork**

Your dashboard supports multiple images:

```
11 Solar_Eyes Character_Art/
├── 1.jpg           ← Primary (large display)
├── 1-thumb.jpg
├── 1-web.jpg
├── 1-hd.jpg
├── 2.jpg           ← Secondary (detail view)
├── 2-thumb.jpg
├── 2-web.jpg
├── 2-hd.jpg
├── 3.jpg           ← Tertiary (gallery slider)
└── ...
```

Scanner auto-detects and includes in manifest as `extraImages` array.

---

## **Complete Example: Adding from Scratch**

### **Scenario:** Add "Cyberpunk Design" artwork

**Step 1: Create folder**
```bash
cd public/artwork
mkdir "12 Cyberpunk_Design Character_Art"
cd "12 Cyberpunk_Design Character_Art"
```

**Step 2: Add images**
```bash
# Copy your artwork files
cp ~/Pictures/cyberpunk_main.jpg 1.jpg
cp ~/Pictures/cyberpunk_detail.jpg 2.jpg
```

**Step 3: Run optimization**
```bash
npm run optimize:artwork
```

**Step 4: Generate manifest**
```bash
npm run scan:artwork
```

**Step 5: Open dashboard**
```bash
npm run dev
# Press Alt+Q in browser
```

**Step 6: Edit metadata in dashboard**
- Title: "Cyberpunk Design"
- Category: "Character Design"
- Year: "2025"
- Medium: "Digital / Photoshop / Procreate"
- Tags: "cyberpunk, character, futuristic, neon"
- Tools: "Photoshop, Wacom DTX220"
- Commission: "OPEN"
- Description: "A futuristic cyberpunk character design with neon accents and..."

**Step 7: Export & Save**
- Click "📤 Export JSON"
- Replace `public/artwork-manifest.json`
- Refresh browser → See artwork live!

---

## **Dashboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| Alt+Q or Cmd+Q | Toggle dashboard |
| Click artwork | Select for editing |
| ↑ / ↓ buttons | Reorder artworks |
| Category dropdown | Filter by type |
| 📤 Export JSON | Download manifest |
| 📥 Import JSON | Load saved manifest |

---

## **File Organization**

```
LETREZDRAW-PORTFOLIO/
├── public/
│   ├── artwork-manifest.json       ← Generated (edit via dashboard)
│   └── artwork/
│       ├── 1 Orangescape Character_Art/
│       ├── 2 Crimson_Fan Character_Art/
│       ├── ...
│       └── 11 Solar_Eyes Character_Art/  ← Your new artwork
├── src/
│   ├── components/
│   │   ├── ArtworkDashboard.jsx    ← NEW: Metadata editor
│   │   ├── Gallery.jsx             ← Fetches manifest
│   │   ├── GalleryCard.jsx
│   │   └── ...
│   ├── styles/
│   │   └── ArtworkDashboard.css    ← NEW: Dashboard styling
│   └── data/
│       └── artworks.js             ← Fallback data
├── scripts/
│   ├── scan-artwork.mjs            ← Generates manifest
│   └── optimize-artwork.mjs        ← Creates image variants
├── package.json                    ← Updated npm scripts
├── vite.config.js
└── ...
```

---

## **Troubleshooting**

### **Dashboard not opening?**
- Make sure you're running `npm run dev`
- Try Alt+Q (Windows/Linux) or Cmd+Q (Mac)
- Check browser console for errors

### **Images not optimizing?**
```bash
# Install Sharp if missing
npm install sharp

# Try again
npm run optimize:artwork
```

### **Manifest not updating?**
```bash
# Clear browser cache
# Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

# Re-run scanner
npm run scan:artwork

# Refresh website
```

### **Wrong folder format error?**
- Folder must have: `<NUMBER> <TITLE> <CATEGORY>`
- Number required (e.g., `11`)
- Underscores in title (e.g., `Solar_Eyes`)
- Category in last position (e.g., `Character_Art`)

### **Images look pixelated?**
- Original images must be high quality
- Use RGB color mode (not CMYK)
- At least 1080px width recommended
- PNG or JPG format works best

---

## **Quick Reference Commands**

```bash
# View current artworks
npm run scan:artwork

# Optimize all images (responsive variants)
npm run optimize:artwork

# Build for deployment
npm run build

# Preview production build
npm run preview

# Start development server
npm run dev

# Lint code
npm lint
```

---

## **File Locations**

| File | Purpose | Editable? |
|------|---------|-----------|
| `public/artwork-manifest.json` | Generated artwork metadata | Via Dashboard |
| `public/artwork/` | Artwork folders & images | Manual |
| `src/components/ArtworkDashboard.jsx` | Dashboard UI | Developer only |
| `src/styles/ArtworkDashboard.css` | Dashboard styling | Developer only |
| `scripts/optimize-artwork.mjs` | Image optimization | Developer only |
| `scripts/scan-artwork.mjs` | Manifest generation | Developer only |

---

## **Performance Tips**

1. **Image Quality**: Original 1080px+ recommended
2. **File Size**: Optimize before uploading
3. **Naming**: Consistent ordering helps sorting
4. **Metadata**: Tags improve searchability
5. **Regular Cleanup**: Remove duplicate images

---

**Happy creating! 🎨✨**

Need help? Check your browser console for error messages or review the component source code.
