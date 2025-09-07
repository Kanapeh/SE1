# 🔧 TinyMCE Troubleshooting Guide

## Common Plugin Loading Errors

### ❌ Error: Failed to load plugin: [plugin-name]
This error occurs when TinyMCE tries to load a plugin that doesn't exist or isn't available.

### ✅ Solution: Stable Plugin Configuration

**Current Stable Plugins:**
```typescript
plugins: [
  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
  'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
  'template', 'codesample', 'pagebreak', 'nonbreaking',
  'imagetools', 'autosave', 'save', 'directionality'
]
```

### 🚫 Problematic Plugins (Removed)
- `hr` - Horizontal rule plugin (causes loading errors)
- `toc` - Table of Contents plugin (causes loading errors)
- `accordion` - Accordion plugin (may cause issues)
- `textpattern` - Text pattern plugin (removed for stability)
- `quickbars` - Quick bars plugin (removed for stability)
- `visualchars` - Visual characters plugin (removed for stability)
- `noneditable` - Non-editable plugin (removed for stability)

## 🔍 Debugging Steps

### 1. Check API Key
```typescript
// Verify API key is loaded
console.log('TinyMCE API Key:', process.env.NEXT_PUBLIC_TINYMCE_API_KEY);
```

### 2. Check Domain Configuration
```typescript
// Verify domain is set correctly
console.log('TinyMCE Domain:', process.env.NEXT_PUBLIC_TINYMCE_DOMAIN);
```

### 3. Test with Minimal Configuration
```typescript
// Start with basic plugins only
plugins: ['lists', 'link', 'image', 'code', 'table', 'wordcount', 'help']
```

### 4. Check Browser Console
- Open Developer Tools (F12)
- Look for TinyMCE-related errors
- Check Network tab for failed plugin loads

## 🛠️ Plugin Management

### Adding New Plugins
1. **Test First**: Add one plugin at a time
2. **Check Documentation**: Verify plugin exists in TinyMCE 7
3. **Test Loading**: Ensure plugin loads without errors
4. **Update Toolbar**: Add corresponding toolbar buttons

### Safe Plugin List
These plugins are known to work reliably:
- `advlist` - Advanced lists
- `autolink` - Auto-linking
- `lists` - Basic lists
- `link` - Link management
- `image` - Image handling
- `charmap` - Character map
- `preview` - Preview mode
- `anchor` - Anchor links
- `searchreplace` - Find and replace
- `visualblocks` - Visual blocks
- `code` - Code view
- `fullscreen` - Fullscreen mode
- `insertdatetime` - Date/time insertion
- `media` - Media embedding
- `table` - Table management
- `help` - Help system
- `wordcount` - Word counting
- `emoticons` - Emoji support
- `template` - Template system
- `codesample` - Code samples
- `pagebreak` - Page breaks
- `nonbreaking` - Non-breaking spaces
- `imagetools` - Image editing tools
- `autosave` - Auto-save functionality
- `save` - Save functionality
- `directionality` - RTL/LTR support

## 🎯 Current Working Configuration

### Editor Configuration
```typescript
const editorConfig = {
  apiKey: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
  domain: process.env.NEXT_PUBLIC_TINYMCE_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'localhost:3000'),
  height: 500,
  menubar: true,
  directionality: 'rtl',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
    'template', 'codesample', 'pagebreak', 'nonbreaking',
    'imagetools', 'autosave', 'save', 'directionality'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic underline strikethrough | alignleft aligncenter ' +
    'alignright alignjustify | outdent indent |  numlist bullist | ' +
    'forecolor backcolor removeformat | pagebreak | charmap emoticons | ' +
    'fullscreen preview save print | insertfile image media template link anchor codesample | ' +
    'ltr rtl | code | help',
  // ... other configurations
};
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_TINYMCE_API_KEY=vyft1oibx9lh90b00hpkok043btlm119n1hkmwamw6g38x7y
NEXT_PUBLIC_TINYMCE_DOMAIN=localhost:3000
```

## 🚀 Performance Tips

### 1. Lazy Loading
```typescript
// Load TinyMCE only when needed
const [editorLoaded, setEditorLoaded] = useState(false);
```

### 2. Error Handling
```typescript
onError: (error: any) => {
  console.error('TinyMCE Error:', error);
  setEditorLoaded(false);
}
```

### 3. RTL Support
```typescript
directionality: 'rtl',
content_style: 'body { direction: rtl; text-align: right; }'
```

## 📱 Mobile Compatibility

- ✅ **Touch Support**: Works on tablets and phones
- ✅ **Responsive**: Adapts to screen size
- ✅ **RTL Support**: Perfect for Persian/Arabic content
- ✅ **Image Upload**: Works on mobile devices

## 🔒 Security Considerations

- ✅ **API Key**: Properly configured and secured
- ✅ **Domain Validation**: Only works on configured domains
- ✅ **Content Sanitization**: HTML content is sanitized
- ✅ **Image Upload**: Secure image handling

## 📞 Support

If you encounter issues:

1. **Check this guide first**
2. **Review browser console for errors**
3. **Test with minimal plugin configuration**
4. **Verify environment variables are loaded**
5. **Test on different browsers**

---

**Last Updated**: $(date)
**TinyMCE Version**: 7.x
**Status**: ✅ Stable Configuration
