# TinyMCE Editor Setup Guide

## 🚀 Complete TinyMCE Configuration

This guide covers the complete setup of TinyMCE editor with API key and advanced features.

## ✅ What's Already Configured

### 1. API Key Setup
- ✅ API Key: `vyft1oibx9lh90b00hpkok043btlm119n1hkmwamw6g38x7y`
- ✅ Environment variable: `NEXT_PUBLIC_TINYMCE_API_KEY`
- ✅ Domain configuration: `NEXT_PUBLIC_TINYMCE_DOMAIN`

### 2. Enhanced Features Enabled
- ✅ Enhanced Tables
- ✅ Enhanced Media Embed
- ✅ Import from Word
- ✅ Advanced formatting options
- ✅ RTL (Right-to-Left) support for Persian/Arabic
- ✅ Image upload and management
- ✅ Template system
- ✅ Quick bars for faster editing
- ✅ Auto-save functionality

## 🔧 Configuration Details

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_TINYMCE_API_KEY=vyft1oibx9lh90b00hpkok043btlm119n1hkmwamw6g38x7y
NEXT_PUBLIC_TINYMCE_DOMAIN=localhost:3000
```

### Production Domain Setup
When deploying to production, update the domain:

```bash
# For production - se1a.org
NEXT_PUBLIC_TINYMCE_DOMAIN=se1a.org

# For localhost development
NEXT_PUBLIC_TINYMCE_DOMAIN=localhost:3000
```

### Automatic Domain Detection
The TinyMCE configuration now automatically detects the domain:
- **Development**: Uses `localhost:3000`
- **Production**: Uses `se1a.org` or any other production domain
- **Hosting**: Works on any hosting platform (Vercel, Netlify, etc.)

## 🎨 Available Features

### Text Formatting
- Bold, italic, underline, strikethrough
- Text alignment (left, center, right, justify)
- Font family and size options
- Text color and background color
- Lists (ordered and unordered)

### Advanced Features
- **Enhanced Tables**: Full table editing with advanced options
- **Media Embed**: Easy embedding of videos and media
- **Image Tools**: Advanced image editing and management
- **Templates**: Pre-built content templates
- **Code Samples**: Syntax highlighting for code blocks
- **Quick Bars**: Context-sensitive toolbars for faster editing
- **Auto-save**: Automatic content saving
- **Full-screen Mode**: Distraction-free editing
- **Print Preview**: Preview content before printing

### RTL Support
- Right-to-left text direction
- Persian/Arabic font support
- Proper text alignment for RTL languages

## 🚀 Usage

The TinyMCE editor is automatically configured in the admin blog page (`/admin/blog`). It includes:

1. **Rich Text Editing**: Full WYSIWYG editing experience
2. **Image Upload**: Direct image upload to your server
3. **Template System**: Quick content creation with templates
4. **RTL Support**: Perfect for Persian content
5. **Advanced Formatting**: Professional document formatting

## 🔒 Security Notes

- API key is properly configured for your domain
- Image uploads are handled securely
- Content is sanitized before saving
- RLS (Row Level Security) is maintained

## 🐛 Troubleshooting

### Common Issues

1. **Editor not loading**: Check if API key is correctly set
2. **Domain errors**: Ensure domain matches your deployment URL
3. **Image upload issues**: Verify image upload handler is working
4. **RTL not working**: Check if directionality is set to 'rtl'

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with different browsers
4. Check network requests to TinyMCE CDN

## 📱 Mobile Support

The editor is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile phones
- Touch-enabled devices

## 🎯 Next Steps

1. Test the editor functionality
2. Update domain for production deployment
3. Customize templates as needed
4. Train content creators on new features

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review browser console for errors
3. Verify API key and domain configuration
4. Test with a fresh browser session

---

**Status**: ✅ Fully Configured and Ready to Use
**Last Updated**: $(date)
**Version**: TinyMCE 6.1.0 with Enhanced Features
