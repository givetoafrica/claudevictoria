# Claude Code - AI-Powered Coding Assistant

Claude Code is a command-line tool that brings the power of Claude AI directly to your coding workflow. Built with TypeScript and Anthropic's Claude API, it helps you generate code, analyze files, and have intelligent conversations about your projects.

## ✨ Features

- **Interactive Chat** - Have multi-turn conversations with Claude about your code
- **Code Generation** - Generate complete code snippets based on descriptions
- **File Analysis** - Analyze and get insights about your code files
- **Multiple Models** - Support for different Claude models
- **File Context** - Include code files in your conversations
- **Error Handling** - Robust error handling and user feedback

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

## 🚀 Installation

### 1. Clone or download this repository

```bash
git clone https://github.com/givetoafrica/claudevictoria.git
cd claudevictoria/claude-code
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 4. Build the project

```bash
npm run build
```

## 💻 Usage

### Chat Mode - Interactive Conversation

Start an interactive chat session:

```bash
npm start chat
```

Or ask a single question:

```bash
npm start chat "How do I sort an array in JavaScript?"
```

Include a file for context:

```bash
npm start chat -- -f src/index.ts
```

### Generate Code

Generate code based on a description:

```bash
npm start generate "a function that validates email addresses"
```

Specify the programming language:

```bash
npm start generate "a REST API endpoint" -l typescript
```

### Analyze Code

Analyze an existing code file:

```bash
npm start analyze src/utils/helpers.js
```

## 🔧 Development

### Available Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm run test

# Lint code
npm run lint
```

## 📝 Examples

### Example 1: Generate a React Component

```bash
npm start generate "a reusable React component that displays a user profile card" -l typescript
```

### Example 2: Analyze a File

```bash
npm start analyze ./src/api/user.ts
```

### Example 3: Interactive Chat with File Context

```bash
npm start chat -f ./src/api/database.js
# Then ask questions about the file
```

## 🎯 Available Models

Claude Code supports various Claude models:

- `claude-opus-4-1` - Most capable (default)
- `claude-sonnet-4-1` - Balanced
- `claude-haiku-3` - Fast and lightweight

Specify model with `-m` or `--model`:

```bash
npm start chat "Your question" -m claude-haiku-3
```

## 🔒 Security

- **API Key Security**: Never commit `.env` files or expose your API key
- **File Analysis**: Only include files you're comfortable sharing with Claude
- **Data Privacy**: Review Anthropic's privacy policy at [anthropic.com](https://www.anthropic.com)

## 🐛 Troubleshooting

### "API key not found"

Make sure you have set `ANTHROPIC_API_KEY` in your `.env` file:

```bash
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

### "Module not found"

Ensure you've installed dependencies:

```bash
npm install
```

### "File not found" when analyzing

Use absolute or relative paths from the project root:

```bash
npm start analyze ./src/helpers.js
```

### TypeScript errors

Make sure TypeScript is installed and build succeeds:

```bash
npm run build
```

## 📚 API Reference

### Chat Command

```bash
npm start chat [query] [options]

Options:
  -f, --file <path>        Include file contents in context
  -m, --model <model>      Specify Claude model (default: claude-opus-4-1)
```

### Generate Command

```bash
npm start generate <description> [options]

Options:
  -l, --language <lang>    Programming language (default: javascript)
  -m, --model <model>      Specify Claude model (default: claude-opus-4-1)
```

### Analyze Command

```bash
npm start analyze <filepath> [options]

Options:
  -m, --model <model>      Specify Claude model (default: claude-opus-4-1)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- Report bugs and issues
- Suggest improvements
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the Apache 2.0 License. See LICENSE file for details.

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the examples
3. Check the Anthropic documentation at [docs.anthropic.com](https://docs.anthropic.com)
4. Open an issue on GitHub

## 🔗 Links

- [Anthropic Console](https://console.anthropic.com)
- [Claude Documentation](https://docs.anthropic.com)
- [Claude Models](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [API Reference](https://docs.anthropic.com/en/api/getting-started)

## 🎉 Getting Started Quick Tips

1. **First time?** Start with interactive chat:
   ```bash
   npm install
   # Add your API key to .env
   npm run build
   npm start chat
   ```

2. **Want to generate code?** Try:
   ```bash
   npm start generate "a todo list manager class"
   ```

3. **Have existing code?** Analyze it:
   ```bash
   npm start analyze ./your_file.js
   ```

---

**Happy coding with Claude! 🚀**
