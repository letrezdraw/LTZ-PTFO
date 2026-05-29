# Site Manager - Complete Guide

## Overview

The **Site Manager** is a comprehensive administrative panel for managing your entire portfolio. Access it by pressing **Alt+W** on your keyboard (or **Cmd+W** on Mac).

## Accessing the Site Manager

1. **Keyboard Shortcut**: Press `Alt+W` (or `Cmd+W` on Mac)
2. **Password Required**: Enter `G311soham@`
3. **Admin Panel Opens**: Full-screen modal with editing capabilities

## Main Features

### 📌 Tab 1: ARTWORKS (Category & Metadata Management)

This tab lets you assign categories and subcategories to your artworks, plus edit detailed metadata.

#### Left Panel - Artwork List
- **List View**: Shows all artworks as thumbnails with titles and current categories
- **Click to Select**: Click any artwork to edit its properties in the right panel
- **Active Highlight**: Selected artwork highlighted with red border and glow
- **Searchable List**: Scroll through all artworks in your portfolio

#### Right Panel - Artwork Editor

When you select an artwork, these fields become editable:

1. **Category (Dropdown)**
   - Select from all available categories in your portfolio
   - Categories are auto-detected from existing artworks
   - Each artwork assigned to exactly one category
   - Used to organize artworks in Operations gallery

2. **Subcategory (Dropdown)**
   - Sub-organize within the selected category
   - Only shows subcategories for the selected category
   - Leave blank for general category items
   - Hierarchical browsing in Operations gallery

3. **Title (Text)**
   - Artwork name displayed in gallery
   - Appears in lightbox when viewing full image

4. **Year (Text)**
   - Creation/publication year
   - Optional field

5. **Medium (Text)**
   - Art medium used (e.g., "Digital Painting", "Oil on Canvas", "Photoshop & Pen")
   - Displayed in artwork details

6. **Tags (Comma-Separated)**
   - Searchable keywords: `character, anime, fan-art, redraw`
   - Separate with commas
   - Auto-trimmed of whitespace

7. **Description (Textarea)**
   - Full artwork description/story
   - Displayed in lightbox details
   - Supports longer text

#### Editing Workflow

```
1. Click artwork in left panel
2. Edit fields in right panel
3. Changes saved immediately to state
4. Indicators show "● Changes made" in footer
5. Export data to save changes permanently
```

---

### 📋 Tab 2: CATEGORIES (Category & Subcategory Management)

This tab lets you create, edit, delete, and organize your portfolio categories.

#### Category Cards

Each category is shown as a card displaying:

- **Icon Input**: Single emoji or symbol (e.g., 🎨, 🖼️, 📐)
- **Name Input**: Category display name (e.g., "Character Art", "Concept Design")
- **Delete Button**: Red "DELETE" button to remove entire category

#### Subcategory Management

Within each category card:

1. **Subcategory List**: Shows all subcategories for that category
2. **Add Subcategory**: "+ ADD" button to create new subcategory
3. **Inline Editing**: Edit subcategory names directly in the list
4. **Delete Subcategory**: Red "✕" button to remove subcategory

#### Category Operations

| Operation | How | Result |
|-----------|-----|--------|
| **Add Category** | Click "+ ADD CATEGORY" header button | New "New Category" added to list |
| **Edit Category** | Click name input field, type new name | Updates category name in real-time |
| **Change Icon** | Click icon input (emoji picker), select new emoji | Updates category icon |
| **Delete Category** | Click "DELETE" button, confirm dialog | Removes category (linked artworks unaffected) |
| **Add Subcategory** | Click "+ ADD" in subcategories section | New "New Sub" added to that category |
| **Edit Subcategory** | Click subcategory name input, type new name | Updates subcategory name immediately |
| **Delete Subcategory** | Click red "✕" next to subcategory | Removes subcategory from category |

#### Category Structure Example

```
🎨 Character Art
  ├─ General
  ├─ Full Character
  ├─ Headshot
  └─ Commission

📐 Concept Design
  ├─ General
  ├─ Mechanical
  └─ Environmental

🖌️ Digital Painting
  ├─ General
  ├─ Landscape
  └─ Portrait
```

---

## Change Management

### Tracking Changes

- **Changed Indicator**: Footer shows "● Changes made (export to save)" when modification happens
- **Real-Time Updates**: All changes reflected immediately in state
- **No Auto-Save**: Changes stay in memory until explicitly exported

### Persisting Changes

#### Export to JSON (Current Method)

1. Click **"📥 EXPORT DATA"** button in footer
2. Browser downloads `portfolio-data.json`
3. Contains current artworks + operations structure
4. Includes all edits made in this session

#### Portfolio Data JSON Structure

```json
{
  "artworks": [
    {
      "id": "ART-001",
      "title": "Solar Eyes",
      "category": "Character Art",
      "subcategory": "Full Character",
      "year": "2024",
      "medium": "Digital Painting",
      "tags": ["character", "anime", "original"],
      "description": "A cyberpunk character design..."
    }
  ],
  "operations": [
    {
      "id": "character-art",
      "name": "Character Art",
      "icon": "🎨",
      "order": 1,
      "subcategories": [
        { "id": "sub-1", "name": "General", "order": 1 },
        { "id": "sub-2", "name": "Full Character", "order": 2 }
      ]
    }
  ]
}
```

#### Next Step: Backend Integration

To permanently save changes to your website:

1. **Import exported JSON** to your backend/CMS
2. **Update `public/artwork-manifest.json`** with new artwork data
3. **Sync categories** to operations configuration
4. **Deploy website** with updated files

---

## Full CRUD Reference

### CREATE

| Resource | How |
|----------|-----|
| Artwork | *Not available in UI* (manually add to manifest.json) |
| Category | Click "+ ADD CATEGORY" in Categories tab |
| Subcategory | Click "+ ADD" within a category card |

### READ

| Resource | How |
|----------|-----|
| Artworks | All shown in left panel of Artworks tab |
| Categories | All shown as cards in Categories tab |
| Artwork Details | Click artwork → see fields in right editor |

### UPDATE

| Resource | How |
|----------|-----|
| Artwork Category | Select from "Category" dropdown |
| Artwork Subcategory | Select from "Subcategory" dropdown |
| Artwork Metadata | Edit Title, Year, Medium, Tags, Description fields |
| Category Name | Click name input in category card |
| Category Icon | Click icon input in category card |
| Subcategory Name | Click inline text input in subcategory row |

### DELETE

| Resource | How |
|----------|-----|
| Category | Click "DELETE" button in category card |
| Subcategory | Click red "✕" next to subcategory name |
| Artwork | *Not available in UI* (remove from manifest.json manually) |

---

## Integration with Operations Gallery

The **Operations** component (visible in Files section) displays categories created here:

1. **Category Display**: Each category becomes a browsable section
2. **Icon Usage**: Category emoji displayed next to name in gallery
3. **Artwork Filtering**: Artworks shown based on `category` field
4. **Subcategory Filtering**: Optional nested browsing by subcategory
5. **Dynamic Structure**: Categories auto-generated from artwork array

### Data Flow

```
SiteManager (Create/Edit Categories)
    ↓
Operations Component (Display Categories)
    ↓
Artwork Gallery (Filter by Category)
    ↓
Lightbox (Full Image View)
```

---

## Tips & Best Practices

### Organizing Your Portfolio

1. **Create 3-5 main categories** (Character Art, Concept Design, Fan Art, etc.)
2. **Use 2-3 subcategories** per category for drill-down browsing
3. **Standardize category names** (keep naming consistent)
4. **Use emojis wisely** (single emoji per category for clarity)

### Workflow Optimization

1. **Batch edits**: Work through all artwork metadata at once
2. **Category first**: Set up categories before assigning artworks
3. **Export regularly**: Save JSON backups of portfolio structure
4. **Test gallery**: Check Operations gallery after major changes

### Common Tasks

**Add new artwork:**
1. Add to manifest.json with base fields
2. Open Site Manager (Alt+W)
3. Select new artwork in Artworks tab
4. Assign Category + Subcategory
5. Fill in metadata
6. Export to save

**Reorganize categories:**
1. Open Categories tab
2. Add/delete/rename categories and subcategories as needed
3. Go back to Artworks tab
4. Re-assign artworks to new category structure
5. Export to save all changes

**Change category icon:**
1. Open Categories tab
2. Click icon input in category card
3. Replace emoji (copy & paste from emoji picker)
4. Icon updates immediately
5. Export to save

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+W` or `Cmd+W` | Toggle Site Manager open/close |
| `Enter` | Submit password during authentication |
| `Tab` | Move between form fields |
| `Shift+Tab` | Move to previous field |

---

## Troubleshooting

### Password Issues

- **Incorrect Password**: Error message shows "❌ Incorrect password"
- **Forgotten Password**: Password is `G311soham@`
- **Browser Remember**: Browser will offer to save password (recommended)

### Data Not Appearing

- **Artworks not showing**: Manifest.json may not be loaded
  - Check `public/artwork-manifest.json` exists
  - Verify file is valid JSON format
  
- **Categories not auto-generating**: No artworks loaded from manifest
  - Ensure manifest has `category` field for each artwork
  - Check browser console for fetch errors

### Export Issues

- **Download blocked**: Check browser popup/download settings
- **File too large**: Shouldn't happen with typical portfolio
- **Corrupted JSON**: Verify export file is valid using JSON validator

### Changes Not Persisting

**Expected behavior**: Changes only stay in manager tab memory
- **Solution**: Click "📥 EXPORT DATA" to save
- **Persistence**: Requires backend integration to update manifest.json

---

## Advanced Usage

### Custom Worflows

#### Bulk Category Updates
```
1. Export current portfolio-data.json
2. Edit JSON in text editor:
   - Find & replace category names
   - Edit subcategories
   - Adjust order numbers
3. Plan to: Re-import into manager (feature may be added)
```

#### Artwork Metadata CSV Import
```
Future feature: Bulk import artwork metadata from CSV
- Title, Category, Subcategory, Year, Medium, Tags, Description
- Would populate all fields at once
```

#### Theme/Icon Consistency
```
🎨 Art styles (solid colors, painting)
📐 Design/Concept (technical, drafting)
🖼️ Gallery/Showcase (curated work)
📰 Editorial (comics, stories)
🎬 Animation/Motion (video, gifs)
```

---

## Version History

**Current Version**: 2.0 (Full CRUD Implementation)

- ✅ Full artwork metadata editing
- ✅ Complete category management
- ✅ Subcategory CRUD operations
- ✅ Data export to JSON
- ⏳ Backend integration for persistence
- ⏳ Bulk import/export
- ⏳ Category reordering UI

---

## Questions & Support

For issues or feature requests:

1. **Check this guide** for solution
2. **Inspect browser console** (F12) for error messages
3. **Export data** as backup before major changes
4. **Document current structure** before reorganizing

---

**Last Updated**: Current Session  
**Password Required**: Yes (`G311soham@`)  
**Keyboard Shortcut**: Alt+W / Cmd+W
