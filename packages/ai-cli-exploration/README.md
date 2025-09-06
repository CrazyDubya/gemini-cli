# AI CLI Exploration - Interactive Multi-Agent System

An innovative exploration of AI CLI capabilities featuring 12 unique AI agents with distinct personalities, plus seamless access to the original Gemini CLI - all from a single interactive launcher.

## 🚀 Quick Start

```bash
# Navigate to the package
cd packages/ai-cli-exploration

# Install dependencies
npm install

# Launch the interactive system
npm run launch
```

This will open an interactive menu where you can:
- Choose from 12 specialized AI agents
- Launch the original Gemini CLI
- Save and resume sessions
- Switch between agents seamlessly

## 🔐 Using Real AI (Optional)

To use real AI instead of simulated responses:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Set the environment variable:
   ```bash
   export GEMINI_API_KEY=your-api-key-here
   ```
3. Run the demo:
   ```bash
   npm run dev
   ```

When the API key is present, agents will use real AI for responses. When absent, they fall back to simulated responses.

## 🎮 Interactive Features

### Main Menu
- **Numbered Selection (0-12)**: Choose an agent
- **[0]**: Launch original Gemini CLI
- **[s]**: Show saved sessions
- **[q]**: Quit application

### In-Agent Commands
- **/help**: Show agent-specific help
- **/reset**: Reset conversation
- **/save**: Save current session
- **/menu**: Return to main menu
- **/exit**: Quit application

## Overview

Each use case showcases a unique AI agent with:
- **Distinct personality and role**
- **Domain-specific knowledge**
- **Stateful conversation management**
- **Memory and learning capabilities**
- **Creative interaction patterns**

## The 12 Use Cases

### 1. 🎲 Interactive Dungeon Master
**Category:** Gaming/Entertainment  
An immersive text-based RPG experience with dynamic storytelling, persistent world state, NPC relationships, and adaptive narrative that responds to player choices.

**Enhanced Features:**
- Dice rolling system (roll d20, d6, etc.)
- Save/load game functionality
- Loot generation system
- Combat logging

### 2. 🦆 Rubber Duck Debugger++
**Category:** Development/Debugging  
Enhanced rubber duck that uses the Socratic method, detects bug patterns, and guides developers to solve their own problems through thoughtful questioning.

**Enhanced Features:**
- Common mistake tracking and learning
- Debug strategy suggestions
- Personalized debugging tips
- Pattern recognition statistics

### 3. ⏰ Time Paradox Resolver
**Category:** Sci-Fi/Simulation  
Temporal mechanics consultant that analyzes timeline changes, calculates butterfly effects, and helps resolve paradoxes using actual temporal theory.

### 4. 🌙 Dream Interpreter
**Category:** Psychology/Wellness  
Jungian dream analysis combining symbolism, archetypes, and psychological insights to help users understand their subconscious.

### 5. ⚛️ Quantum Decision Engine
**Category:** Decision Making  
Evaluates all decision branches simultaneously using quantum superposition metaphors, showing probability distributions for different choices.

### 6. 🧪 Culinary Alchemist
**Category:** Culinary/Creative  
Transforms ingredients through molecular gastronomy principles, suggesting innovative cooking techniques and unexpected flavor combinations.

### 7. 🏛️ Memory Palace Architect
**Category:** Learning/Memory  
Builds navigable mental spaces using the method of loci, helping users store and recall information through vivid spatial imagery.

### 8. 🕐 Git Time Travel Guide
**Category:** Version Control  
Navigate repository history like an archaeologist, understanding the context and decisions behind code evolution.

### 9. 💪 Imposter Syndrome Coach
**Category:** Mental Health  
Realistic encouragement and perspective for developers, normalizing struggles and debunking toxic tech myths.

### 10. 📜 Code Poet Laureate
**Category:** Creative/Education  
Transforms programming concepts into beautiful poetry, making technical concepts memorable through verse.

### 11. 👻 Legacy Code Medium
**Category:** Legacy Systems  
Channels the spirits of developers past to understand the context and constraints that shaped ancient codebases.

### 12. ☯️ Zen Master of Programming
**Category:** Philosophy/Wisdom  
Teaches programming wisdom through koans, paradoxes, and meditation, finding deep meaning in error messages.

## Architecture

```
ai-cli-exploration/
├── src/
│   ├── core/
│   │   └── BaseAIAgent.ts         # Core agent framework
│   ├── use-cases/
│   │   ├── 1-DungeonMaster.ts     # RPG game master
│   │   ├── 2-DebuggerDuck.ts      # Socratic debugger
│   │   ├── 3-TimeParadoxResolver.ts # Temporal mechanics
│   │   ├── 4-DreamInterpreter.ts   # Dream analysis
│   │   ├── 5-QuantumDecision.ts    # Decision superposition
│   │   ├── 6-CulinaryAlchemist.ts  # Molecular gastronomy
│   │   ├── 7-MemoryPalace.ts       # Mnemonic spaces
│   │   ├── 8-GitTimeTravel.ts      # Repository archaeology
│   │   ├── 9-ImposterSyndrome.ts   # Developer confidence
│   │   ├── 10-CodePoet.ts          # Programming poetry
│   │   ├── 11-LegacyCodeMedium.ts  # Code séances
│   │   └── 12-ZenMaster.ts         # Programming koans
│   └── showcase.ts                 # Interactive demo
└── package.json
```

## Core Features

### BaseAIAgent Framework
- **Personality System**: Each agent has unique personality traits and communication style
- **Context Management**: Maintains role, constraints, knowledge, and goals
- **Memory System**: Can remember and recall information across conversations
- **History Compression**: Automatically compresses long conversations to maintain context
- **Decision Making**: Agents can make contextual decisions based on their role
- **Real AI Integration**: Uses Google's Gemini API when API key is provided

### Common Capabilities
- Stateful conversation management
- Pattern recognition and learning
- Dynamic prompt generation
- Context-aware responses
- Memory persistence
- Personality consistency

## Running the Demo

```bash
# Navigate to the package
cd packages/ai-cli-exploration

# Install dependencies
npm install

# Run the showcase (simulated AI)
npm run dev

# Or directly with tsx
npx tsx src/showcase.ts

# Run with real AI (requires API key)
npx tsx demo-real-ai.ts
```

## Key Innovations

1. **Personality-Driven AI**: Each agent has a distinct personality that affects its responses
2. **Domain Expertise**: Agents have specialized knowledge in their respective fields
3. **Emotional Intelligence**: Several agents provide emotional and psychological support
4. **Creative Expression**: Agents can generate poetry, narratives, and metaphorical explanations
5. **Stateful Interactions**: Maintains context and memory across conversation turns
6. **Pattern Recognition**: Detects patterns in user input and responds appropriately
7. **Real AI Integration**: Seamlessly switches between simulated and real AI responses

## Why This Matters

This exploration demonstrates that AI CLI tools can:
- **Go beyond code generation** to provide diverse types of assistance
- **Adapt personality and tone** for different contexts
- **Provide emotional support** alongside technical help
- **Make complex concepts accessible** through creative metaphors
- **Maintain long-term context** for more meaningful interactions
- **Gamify mundane tasks** to increase engagement

## Integration with Gemini CLI

These use cases could be integrated into Gemini CLI as:

1. **Plugins/Extensions**: Each agent as a loadable plugin
2. **Modes**: Switch between different agent personalities
3. **Commands**: Invoke specific agents with commands like `gemini --zen` or `gemini --duck`
4. **Persistent Sessions**: Save and restore agent states
5. **Multi-Agent Conversations**: Have multiple agents interact

## Future Enhancements

- **Real Gemini API Integration**: Connect to actual Gemini model for dynamic responses
- **Persistent Storage**: Save conversation history and agent memory to disk
- **Plugin System**: Allow users to create custom agents
- **Voice Integration**: Add speech recognition and synthesis
- **Visual Interfaces**: Create TUI/GUI for richer interactions
- **Multi-Agent Orchestration**: Enable agents to collaborate
- **Learning System**: Agents improve based on user feedback
- **Export Capabilities**: Save conversations, generate reports

## Technical Highlights

- **TypeScript**: Full type safety for agent definitions
- **Modular Design**: Each agent is self-contained and reusable
- **Extensible Framework**: Easy to add new agents or capabilities
- **Memory Management**: Automatic history compression for long conversations
- **Pattern Matching**: Intelligent input parsing and response generation
- **Real AI Integration**: Seamless switching between simulated and real AI

## Conclusion

This MVP proves that AI CLI tools like Gemini can be creatively adapted for any domain requiring intelligent, personality-driven interactions. The same underlying technology that powers code generation can:

- Create immersive gaming experiences
- Provide mental health support
- Teach through creative expression
- Help with decision-making
- Make learning more engaging
- Add personality to developer tools

The possibilities are limited only by imagination.

## License

Copyright 2025 Google LLC
SPDX-License-Identifier: Apache-2.0