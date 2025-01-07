# AWS Console AI Assistant

A Chrome extension that enhances the AWS Console experience with AI-powered assistance, providing contextual suggestions, explanations, and interactive features.

## Features

### Core Features
- 🤖 AI-powered AWS Console assistance
- 💬 Context-aware suggestions and explanations
- 🎯 Floating action button for quick access
- ⌨️ Keyboard shortcuts (Ctrl+Shift+Space)
- 📝 Interactive history tracking
- ⚙️ Customizable settings

### New Additional Features
1. **Service-Specific Templates**
   - Quick-access templates for common AWS service configurations
   - Pre-built policy templates for IAM
   - CloudFormation snippets

2. **Multi-Language Support**
   - Interface available in multiple languages
   - AI responses in the user's preferred language

3. **Enhanced Security Features**
   - IAM policy analyzer
   - Security best practice suggestions
   - Cost optimization recommendations

4. **Collaboration Tools**
   - Share AI responses with team members
   - Export conversations as documentation
   - Team-specific custom prompts

5. **Advanced Context Understanding**
   - Resource dependency visualization
   - Cross-service impact analysis
   - Cost estimation for suggested actions

## Installation

### Developer Mode Setup
1. **Download the Code**
   ```bash
   git clone https://github.com/yourusername/aws-console-ai-assistant.git
   ```

2. **Chrome Extension Setup**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked"
   - Select the root folder `aws-console-ai-assistant` (this is important - select the main folder containing manifest.json)

3. **API Key Configuration**
   - Click the extension icon in Chrome
   - Enter your OpenAI API key in the settings
   - (Optional) Configure custom endpoint if using a different AI provider

### Installation Verification
1. Navigate to AWS Console (https://console.aws.amazon.com)
2. Look for the floating AI assistant button in the bottom right
3. Try opening the assistant using the keyboard shortcut (Ctrl+Shift+Space)

## Usage

### Basic Usage
1. **Opening the Assistant**
   - Click the floating button in bottom right
   - Use keyboard shortcut: Ctrl+Shift+Space
   - Right-click and select "Ask AWS AI Assistant"

2. **Asking Questions**
   - Type your question in the input field
   - Press Enter or click Send
   - AI will provide context-aware responses

3. **Using Templates**
   - Click "Templates" in the AI panel
   - Select service-specific template
   - Customize as needed

### Advanced Features

1. **Custom Prompts**
   ```json
   {
     "name": "Security Check",
     "prompt": "Analyze the security implications of...",
     "tags": ["security", "audit"]
   }
   ```

2. **Team Settings**
   - Share templates across team
   - Configure shared API endpoints
   - Set organization-specific best practices

## Development

### Prerequisites
- Node.js 14+
- Chrome browser
- OpenAI API key or compatible AI service

### Local Development
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Extension**
   ```bash
   npm run build
   ```

3. **Testing**
   ```bash
   npm run test
   ```

### Folder Structure Explanation
- `/css`: Styling files
- `/icons`: Extension icons in various sizes
- `/js`: JavaScript source files
  - `/components`: Reusable UI components
  - `/utils`: Helper functions and utilities
- `/_locales`: Internationalization files
- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface

### Modification Guide

1. **Adding New Features**
   - Create new component in `/js/components`
   - Register in `manifest.json` if needed
   - Update `background.js` for new events

2. **Customizing Styles**
   - Modify `/css/styles.css`
   - Use AWS Console theme variables
   - Follow AWS design guidelines

3. **Adding New Templates**
   - Add template file in `/js/templates`
   - Register in template registry
   - Add documentation

## Troubleshooting

### Common Issues

1. **Extension Not Loading**
   - Verify Developer mode is enabled
   - Check manifest.json syntax
   - Ensure proper folder selection

2. **API Key Issues**
   - Verify API key in settings
   - Check network permissions
   - Validate API endpoint

3. **UI Not Showing**
   - Clear browser cache
   - Reload extension
   - Check console for errors

### Debug Mode
Enable debug mode in settings for detailed logging:
```javascript
localStorage.setItem('AWS_AI_DEBUG', 'true');
```

## Security Considerations

1. **API Key Storage**
   - Keys stored in Chrome's secure storage
   - Never exposed in plaintext
   - Optional encryption available

2. **Data Handling**
   - No sensitive data stored locally
   - All API communications encrypted
   - Regular security audits

## Updates and Maintenance

1. **Updating the Extension**
   - Pull latest code
   - Rebuild if needed
   - Reload in Chrome extensions

2. **Version History**
   - v1.0.0: Initial release
   - v1.1.0: Added templates
   - v1.2.0: Multi-language support

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow coding standards

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: [[Report bugs](https://github.com/machapraveen/AWS-Extension.git)]
- Email: praveenmacha777@gmail.com.com
- Documentation: [Wiki link]