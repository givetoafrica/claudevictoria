#!/usr/bin/env node

import { Command } from 'commander';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const program = new Command();
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

program
  .name('claude-code')
  .description('AI-powered coding assistant with Claude')
  .version('1.0.0');

// Main chat command
program
  .command('chat [query]')
  .description('Start an interactive chat session or ask a single question')
  .option('-f, --file <path>', 'Include file contents in context')
  .option('-m, --model <model>', 'Specify Claude model', 'claude-opus-4-1')
  .action(async (query, options) => {
    try {
      await runChat(query, options);
    } catch (error) {
      handleError(error);
    }
  });

// Generate code command
program
  .command('generate <description>')
  .description('Generate code based on description')
  .option('-l, --language <lang>', 'Programming language', 'javascript')
  .option('-m, --model <model>', 'Specify Claude model', 'claude-opus-4-1')
  .action(async (description, options) => {
    try {
      await generateCode(description, options);
    } catch (error) {
      handleError(error);
    }
  });

// Analyze file command
program
  .command('analyze <filepath>')
  .description('Analyze code in a file')
  .option('-m, --model <model>', 'Specify Claude model', 'claude-opus-4-1')
  .action(async (filepath, options) => {
    try {
      await analyzeFile(filepath, options);
    } catch (error) {
      handleError(error);
    }
  });

// Interactive chat function
async function runChat(initialQuery: string | undefined, options: any) {
  const model = options.model || 'claude-opus-4-1';
  const conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }> = [];

  let fileContext = '';
  if (options.file) {
    try {
      fileContext = fs.readFileSync(options.file, 'utf-8');
      console.log(`\n📄 File context loaded: ${options.file}\n`);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      return;
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  console.log('🤖 Claude Code - Interactive Chat');
  console.log('Type your message or "exit" to quit\n');

  if (initialQuery) {
    console.log(`You: ${initialQuery}\n`);
    let userMessage = initialQuery;
    if (fileContext) {
      userMessage += `\n\nFile context:\n\`\`\`\n${fileContext}\n\`\`\``;
    }

    try {
      const response = await client.messages.create({
        model: model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: userMessage }],
      });

      const assistantMessage =
        response.content[0].type === 'text' ? response.content[0].text : '';
      console.log(`Claude: ${assistantMessage}\n`);

      conversationHistory.push({ role: 'user', content: userMessage });
      conversationHistory.push({ role: 'assistant', content: assistantMessage });
    } catch (error) {
      handleError(error);
      rl.close();
      return;
    }
  }

  // Continue conversation loop
  while (true) {
    const userInput = await askQuestion('You: ');

    if (userInput.toLowerCase() === 'exit') {
      console.log('\nGoodbye! 👋');
      rl.close();
      break;
    }

    if (!userInput.trim()) continue;

    try {
      conversationHistory.push({ role: 'user', content: userInput });

      const response = await client.messages.create({
        model: model,
        max_tokens: 2048,
        messages: conversationHistory,
      });

      const assistantMessage =
        response.content[0].type === 'text' ? response.content[0].text : '';
      console.log(`\nClaude: ${assistantMessage}\n`);

      conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });
    } catch (error) {
      handleError(error);
    }
  }
}

// Generate code function
async function generateCode(description: string, options: any) {
  const model = options.model || 'claude-opus-4-1';
  const language = options.language || 'javascript';

  console.log(`\n🔧 Generating ${language} code...\n`);

  const prompt = `Generate ${language} code that ${description}. 
    Provide clean, well-commented code with best practices.
    Include error handling and documentation.`;

  try {
    const response = await client.messages.create({
      model: model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const code =
      response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(code);

    // Optionally save to file
    const saveToFile = await new Promise<string>((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(
        '\nSave to file? (yes/no): ',
        (answer: string) => {
          rl.close();
          resolve(answer);
        }
      );
    });

    if (saveToFile.toLowerCase() === 'yes') {
      const ext = language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'js';
      const filename = `generated_code.${ext}`;
      fs.writeFileSync(filename, code);
      console.log(`✅ Code saved to ${filename}`);
    }
  } catch (error) {
    handleError(error);
  }
}

// Analyze file function
async function analyzeFile(filepath: string, options: any) {
  const model = options.model || 'claude-opus-4-1';

  if (!fs.existsSync(filepath)) {
    console.error(`❌ File not found: ${filepath}`);
    return;
  }

  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const fileName = path.basename(filepath);

  console.log(`\n📊 Analyzing ${fileName}...\n`);

  const prompt = `Please analyze the following code file and provide:
1. Summary of what the code does
2. Key functions/classes
3. Potential issues or improvements
4. Security concerns (if any)
5. Performance suggestions

Code file: ${fileName}
\`\`\`
${fileContent}
\`\`\``;

  try {
    const response = await client.messages.create({
      model: model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const analysis =
      response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(analysis);
  } catch (error) {
    handleError(error);
  }
}

// Error handler
function handleError(error: any) {
  if (error instanceof Error) {
    console.error(`❌ Error: ${error.message}`);
  } else {
    console.error('❌ An unexpected error occurred');
  }
  process.exit(1);
}

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
