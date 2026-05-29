# ESLint Issues & Fixes - LETREZDRAW Portfolio

**Date**: May 13, 2026  
**Total Issues**: 21 errors, 2 warnings  
**Status**: Requires fixes for production deploy  

---

## 🔴 Critical Issues (Must Fix)

### 1. **Duplicate Keys in Objects**

#### ClearanceHub.jsx - Line 423 & 510
```javascript
// Line 423: Duplicate key 'background'
style={{
  background: '...',
  // ... other styles
  background: '...' // DUPLICATE
}}

// Line 510: Duplicate key 'color'  
style={{
  color: '...',
  // ... other styles
  color: '...' // DUPLICATE
}}
```
**Impact**: High - Only the last value will be used, potentially breaking styles  
**Fix**: Remove duplicate key declarations

---

### 2. **Impure Function in Render (HeroMobile.jsx - Line 166)**
```javascript
// WRONG - Math.random() called during render
left: Math.random() * 4 - 2 + 'px'

// CORRECT - Use useRef/useState to store random value
const randomOffsetRef = useRef(Math.random() * 4 - 2);
// or in useEffect
```
**Impact**: High - Can cause unstable re-renders and glitches  
**Fix**: Move Math.random() to useEffect or useRef

---

### 3. **setState Synchronously in Effects**

#### Gallery.jsx - Line 73
```javascript
useEffect(() => {
  setCurrentIndex((i) => Math.min(i, Math.max(0, pieces.length - 1)));
}, [pieces.length]);
```
**Impact**: Medium - Causes cascading renders, performance issues  
**Fix**: Use initialState or useLayoutEffect

---

#### Operations.jsx - Line 37
```javascript
useEffect(() => {
  const hydrated = finalArtworks.map((art) => hydrateArtwork(art));
  setArtworksList(hydrated); // Synchronous setState
  // ...
}, []);
```
**Impact**: Medium - Performance degradation  
**Fix**: Combine preparation and state update

---

#### useDeviceCapability.js - Line 47
```javascript
useEffect(() => {
  // setState called directly
  setHasWebGL2(features.webgl2);
  // ...
}, []);
```
**Impact**: Medium - May cause race conditions  
**Fix**: Use useLayoutEffect or combine state updates

---

## 🟡 Important Issues (Should Fix)

### 4. **Unused Variables**

| File | Line | Variable | Fix |
|------|------|----------|-----|
| App.jsx | 143 | `e` | Remove unused event parameter |
| ArtworkDashboard.jsx | 207 | `index` | Remove unused parameter from map callback |
| ClearanceHub.jsx | 130 | `f`, `i` | Check if destructuring is needed |
| Hero.jsx | 2 | `gsap` | Remove unused import |
| HeroMobile.jsx | 9 | `device` | Remove unused destructured variable |
| HeroMobile.jsx | 10 | `themeIndex` | Remove unused destructured variable |
| Operations.jsx | 31 | `e` | Remove unused event parameter |
| PixelBlast.jsx | 30 | `intensity` | Remove or use variable |
| PixelBlast.jsx | 499 | `raf` | Remove or use variable |
| Sidebar.jsx | 37 | `transform` | Check for duplicate key |
| SiteManager.jsx | 56 | `e` | Remove unused event parameter |
| SiteManager.jsx | 423 | `selectedOperation` | Remove or use variable |

**Impact**: Low - Code cleanliness, can be auto-fixed  
**Fix**: Use underscore prefix for intentionally unused vars: `_e`, `_index`

---

### 5. **Missing Hook Dependencies**

#### GalleryWeb.jsx - Line 297
```javascript
const memoized = useMemo(() => {
  // uses edgeVersion and n
}, [edgeVersion, n]); // ESLint flags these as unnecessary
```
**Fix**: Review and add/remove dependencies based on actual usage

---

#### SiteManager.jsx - Line 114
```javascript
useEffect(() => {
  // uses newArtworkForm.extraImagePreviews and mainImagePreview
}, []); // Missing dependencies
```
**Fix**: Add missing dependencies to array

---

### 6. **Self-Assignment (GalleryWeb.jsx - Lines 197-200)**
```javascript
nodes[i].nx = nodes[i].nx;  // No-op
nodes[i].ny = nodes[i].ny;  // No-op
nodes[i].phx = nodes[i].phx;  // No-op
nodes[i].phy = nodes[i].phy;  // No-op
```
**Impact**: Low - Dead code  
**Fix**: Remove self-assignments or add actual logic

---

### 7. **Unused Assignment (GalleryWeb.jsx - Line 150)**
```javascript
let tick = requestAnimationFrame(...);
// tick never used
```
**Fix**: Either use `tick` or remove the assignment

---

## 🟠 Best Practice Issues (Nice-to-Have)

### 8. **Fast Refresh Export Issue (RenderThemeContext.jsx - Line 49)**
```javascript
// WRONG - Exporting constants from component file
export const THEME_CONFIG = {...};

export const RenderThemeProvider = () => {
  // ...
};

// CORRECT - Move constants to separate file
// themes.js or constants.js
```
**Fix**: Create separate file for constants/config

---

## 📋 Prioritized Fix Plan

### Phase 1: Critical Fixes (Must do)
1. **Remove duplicate keys in objects** (ClearanceHub.jsx)
2. **Fix impure function issue** (HeroMobile.jsx)
3. **Move Math.random() to useEffect** (HeroMobile.jsx)

### Phase 2: Important Fixes (Should do)
4. **Remove all unused variables** (Quick wins)
5. **Fix setState in effects** (Gallery, Operations, useDeviceCapability)
6. **Add missing hook dependencies** (SiteManager)

### Phase 3: Quality Improvements (Nice-to-have)
7. **Remove self-assignments** (GalleryWeb)
8. **Separate constants to new file** (RenderThemeContext)

---

## 🛠️ Quick Fix Commands

### Remove unused variables (auto-fix)
```bash
npm run lint -- --fix
```

This will automatically fix:
- Unused variables → prefix with underscore
- Extra whitespace
- Some formatting issues

### Manual fixes needed
The following require manual review:
- Duplicate keys (semantic issue)
- setState in effects (architectural issue)
- Import statements (intentional usage)
- Hook dependencies (logic issue)

---

## ⚡ Current Status

- **Build**: ✅ Passing (Vite syntax OK)
- **ESLint**: ⚠️ 21 errors, 2 warnings
- **Production Ready**: ❌ With warnings (should fix before deploy)

---

## 📊 Detailed Issue Breakdown

```
Categories:
├── Unused Imports/Variables: 10 issues
├── Duplicate Object Keys: 2 issues
├── setState in effects: 3 issues
├── Hook Dependencies: 3 issues
├── Dead Code: 2 issues
├── Export Issues: 1 issue
└── Impure Functions: 1 issue

Severity:
├── Errors (Must Fix): 19
└── Warnings (Should Fix): 2
```

---

## 🎯 Next Session Checklist

- [ ] Run `npm run lint -- --fix` to auto-fix
- [ ] Manually review and fix duplicate keys
- [ ] Move Math.random() to useEffect in HeroMobile
- [ ] Review and fix setState in effects pattern
- [ ] Separate constants from RenderThemeContext
- [ ] Re-run lint to verify all fixed
- [ ] Build and test functionally

---

## 📚 ESLint Rules Reference

- `no-unused-vars`: Variables declared but never used
- `no-dupe-keys`: Duplicate keys in object literals
- `react-hooks/set-state-in-effect`: setState in effect body
- `react-hooks/exhaustive-deps`: Missing dependencies in hooks
- `react/purity`: Impure functions during render
- `react-refresh/only-export-components`: Non-component exports in component files

---

**Recommendation**: Schedule a 15-minute linting cleanup session before final deployment.
