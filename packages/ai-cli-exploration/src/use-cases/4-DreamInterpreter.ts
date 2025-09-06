/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface DreamEntry {
  id: string;
  content: string;
  symbols: string[];
  emotions: string[];
  themes: string[];
  interpretation: string;
  timestamp: Date;
  lucidity: number;
  intensity: number;
}

interface DreamPattern {
  type: 'recurring_symbol' | 'emotional_theme' | 'narrative_structure' | 'temporal_pattern';
  pattern: string;
  frequency: number;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  associatedSymbols: string[];
  interpretation: string;
}

interface PersonalSymbol {
  symbol: string;
  personalMeaning: string;
  universalMeaning: string;
  frequency: number;
  emotionalValence: number;
  contexts: string[];
  evolution: SymbolEvolution[];
}

interface SymbolEvolution {
  date: Date;
  context: string;
  meaning: string;
  confidence: number;
}


export class DreamInterpreterAgent extends BaseAIAgent {
  private symbols: Map<string, string> = new Map();
  private interpretations: string[] = [];
  private dreamJournal: Map<string, DreamEntry> = new Map();
  private detectedPatterns: DreamPattern[] = [];
  private personalDictionary: Map<string, PersonalSymbol> = new Map();
  private emotionLexicon: Map<string, number> = new Map();
  private dreamCounter: number = 0;

  constructor() {
    super(
      {
        role: 'a mystical dream interpreter combining psychology, symbolism, and ancient wisdom',
        personality: 'Wise, empathetic, slightly mysterious. Speaks in metaphors and sees deeper meanings.',
        constraints: ['Never diagnose medical conditions', 'Respect cultural interpretations', 'Maintain mystery while providing insight'],
        knowledge: ['Jungian psychology', 'Ancient symbolism', 'Cultural dream meanings', 'Archetypal patterns'],
        goals: ['Reveal hidden meanings', 'Connect dreams to waking life', 'Empower self-understanding'],
      },
      { canRemember: true, canLearn: true }
    );

    this.initializeSymbols();
    this.initializeEmotionLexicon();
    this.initializePersonalDictionary();
  }

  private initializeSymbols(): void {
    this.symbols.set('water', 'emotions and the unconscious mind');
    this.symbols.set('flying', 'freedom and transcending limitations');
    this.symbols.set('falling', 'loss of control or fear of failure');
    this.symbols.set('animals', 'instinctual nature and primal desires');
    this.symbols.set('house', 'the self and different aspects of personality');
    this.symbols.set('death', 'transformation and endings leading to new beginnings');
    this.symbols.set('fire', 'passion, destruction, or purification');
    this.symbols.set('mirror', 'self-reflection and hidden truths');
    this.symbols.set('forest', 'the unknown and unconscious exploration');
    this.symbols.set('mountain', 'challenges and spiritual ascension');
    this.symbols.set('ocean', 'vast unconscious and emotional depths');
    this.symbols.set('storm', 'emotional turmoil and inner conflict');
  }

  private initializeEmotionLexicon(): void {
    this.emotionLexicon.set('fear', -0.8);
    this.emotionLexicon.set('anxiety', -0.6);
    this.emotionLexicon.set('joy', 0.9);
    this.emotionLexicon.set('peace', 0.7);
    this.emotionLexicon.set('confusion', -0.3);
    this.emotionLexicon.set('excitement', 0.8);
    this.emotionLexicon.set('sadness', -0.7);
    this.emotionLexicon.set('wonder', 0.6);
    this.emotionLexicon.set('anger', -0.5);
    this.emotionLexicon.set('curiosity', 0.4);
    this.emotionLexicon.set('nostalgia', 0.2);
    this.emotionLexicon.set('liberation', 0.8);
  }

  private initializePersonalDictionary(): void {
    // Personal dictionary starts empty and builds over time
    // This creates personalized meanings based on user's dream patterns
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    // Check for special commands
    if (lower.includes('/patterns') || lower.includes('pattern')) {
      return this.analyzeDreamPatterns();
    }
    
    if (lower.includes('/dictionary') || lower.includes('personal symbols')) {
      return this.showPersonalDictionary();
    }
    
    if (lower.includes('/analysis') || lower.includes('analyze trends')) {
      return this.generateDreamAnalysis();
    }
    
    // Process as new dream entry
    this.dreamCounter++;
    const dreamId = `dream-${this.dreamCounter}-${Date.now()}`;
    
    const symbols = this.extractSymbols(input);
    const emotions = this.extractEmotions(input);
    const themes = this.extractThemes(input);
    const interpretation = await this.interpretDream(input, symbols, emotions, themes);
    
    // Create dream entry
    const dreamEntry: DreamEntry = {
      id: dreamId,
      content: input,
      symbols,
      emotions,
      themes,
      interpretation,
      timestamp: new Date(),
      lucidity: this.assessLucidity(input),
      intensity: this.assessIntensity(input),
    };
    
    // Store dream and update personal dictionary
    this.dreamJournal.set(dreamId, dreamEntry);
    this.updatePersonalDictionary(dreamEntry);
    this.detectNewPatterns();
    
    this.interpretations.push(interpretation);
    
    return this.generateDreamReport(dreamEntry);
  }

  private extractSymbols(dream: string): string[] {
    const words = dream.toLowerCase().split(/\s+/);
    const foundSymbols = Array.from(this.symbols.keys()).filter(symbol => 
      words.some(word => word.includes(symbol))
    );
    
    // Also check personal dictionary
    const personalSymbols = Array.from(this.personalDictionary.keys()).filter(symbol =>
      words.some(word => word.includes(symbol.toLowerCase()))
    );
    
    return [...new Set([...foundSymbols, ...personalSymbols])];
  }

  private extractEmotions(dream: string): string[] {
    const words = dream.toLowerCase().split(/\s+/);
    return Array.from(this.emotionLexicon.keys()).filter(emotion =>
      words.some(word => word.includes(emotion) || this.isEmotionalSynonym(word, emotion))
    );
  }

  private extractThemes(dream: string): string[] {
    const themes = [];
    const lower = dream.toLowerCase();
    
    if (lower.includes('chase') || lower.includes('run') || lower.includes('escape')) themes.push('pursuit');
    if (lower.includes('exam') || lower.includes('test') || lower.includes('unprepared')) themes.push('evaluation_anxiety');
    if (lower.includes('naked') || lower.includes('exposed') || lower.includes('embarrassed')) themes.push('vulnerability');
    if (lower.includes('lost') || lower.includes('can\'t find') || lower.includes('searching')) themes.push('seeking');
    if (lower.includes('dead') || lower.includes('died') || lower.includes('funeral')) themes.push('transformation');
    if (lower.includes('late') || lower.includes('missed') || lower.includes('hurry')) themes.push('time_pressure');
    if (lower.includes('childhood') || lower.includes('parent') || lower.includes('family')) themes.push('origins');
    
    return themes;
  }

  private isEmotionalSynonym(word: string, emotion: string): boolean {
    const synonyms: Record<string, string[]> = {
      fear: ['scared', 'terrified', 'afraid', 'frightened'],
      joy: ['happy', 'elated', 'cheerful', 'delighted'],
      sadness: ['depressed', 'melancholy', 'sorrowful', 'blue'],
      anger: ['mad', 'furious', 'irritated', 'rage'],
    };
    
    return synonyms[emotion]?.includes(word) || false;
  }

  private async interpretDream(dream: string, symbols: string[], emotions: string[], themes: string[]): Promise<string> {
    let interpretation = '';
    
    // Incorporate personal dictionary meanings
    const personalInterpretations = symbols
      .filter(s => this.personalDictionary.has(s))
      .map(s => {
        const personal = this.personalDictionary.get(s)!;
        return `The ${s} in your personal symbolism represents ${personal.personalMeaning} (evolved from ${personal.evolution.length} previous dreams)`;
      });
    
    const universalInterpretations = symbols
      .filter(s => this.symbols.has(s) && !this.personalDictionary.has(s))
      .map(s => `The ${s} represents ${this.symbols.get(s)}`);
    
    if (personalInterpretations.length > 0) {
      interpretation += 'Personal Symbolism:\n' + personalInterpretations.join('. ') + '\n\n';
    }
    
    if (universalInterpretations.length > 0) {
      interpretation += 'Universal Symbolism:\n' + universalInterpretations.join('. ') + '\n\n';
    }
    
    // Add emotional context
    if (emotions.length > 0) {
      const emotionalContext = this.analyzeEmotionalContext(emotions);
      interpretation += `Emotional Landscape: ${emotionalContext}\n\n`;
    }
    
    // Add thematic analysis
    if (themes.length > 0) {
      interpretation += `Thematic Elements: ${themes.join(', ')} - These patterns suggest ${this.interpretThemes(themes)}\n\n`;
    }
    
    const insight = this.generateAdvancedInsight(dream, symbols, emotions, themes);
    interpretation += `Deep Insight: ${insight}`;
    
    return interpretation || 'Your dream speaks of transformation and hidden potential waiting to be discovered.';
  }

  private analyzeEmotionalContext(emotions: string[]): string {
    const totalValence = emotions.reduce((sum, emotion) => {
      return sum + (this.emotionLexicon.get(emotion) || 0);
    }, 0);
    
    const averageValence = totalValence / emotions.length;
    
    if (averageValence > 0.5) return `predominantly positive (${emotions.join(', ')}) - suggesting growth and resolution`;
    if (averageValence < -0.5) return `predominantly challenging (${emotions.join(', ')}) - indicating areas needing attention`;
    return `mixed emotional complexity (${emotions.join(', ')}) - reflecting life's natural duality`;
  }

  private interpretThemes(themes: string[]): string {
    const themeInsights: Record<string, string> = {
      pursuit: 'you may be avoiding something important or striving toward an elusive goal',
      evaluation_anxiety: 'you\'re processing feelings about being judged or tested in waking life',
      vulnerability: 'you\'re confronting fears about being seen or exposed',
      seeking: 'you\'re searching for something missing in your conscious life',
      transformation: 'you\'re processing major life changes or transitions',
      time_pressure: 'you feel rushed or anxious about missed opportunities',
      origins: 'you\'re reconnecting with foundational aspects of your identity',
    };
    
    return themes.map(theme => themeInsights[theme] || 'exploring deep unconscious material').join('; ');
  }

  private generateAdvancedInsight(dream: string, symbols: string[], emotions: string[], themes: string[]): string {
    // Pattern count for future statistical analysis
    const dreamCount = this.dreamJournal.size;
    
    if (dreamCount > 5) {
      const recurringElements = this.findRecurringElements();
      if (recurringElements.length > 0) {
        return `This dream connects to your recurring pattern of ${recurringElements[0]}, suggesting ongoing integration of ${this.generateContextualInsight()}`;
      }
    }
    
    const complexityScore = symbols.length + emotions.length + themes.length;
    if (complexityScore > 8) {
      return 'This richly symbolic dream indicates significant psychological processing - your unconscious is actively working through multiple life themes';
    }
    
    return this.generateInsight(dream);
  }

  private identifyArchetype(dream: string): string {
    const archetypes = ['The Hero\'s Journey', 'The Shadow Self', 'The Wise Old Sage', 'The Inner Child', 'The Trickster'];
    return archetypes[Math.floor(Math.random() * archetypes.length)];
  }

  private generateInsight(dream: string): string {
    const insights = [
      'unresolved tensions seeking resolution in your waking life',
      'opportunities for growth you haven\'t fully recognized yet',
      'aspects of yourself that are ready to emerge and be integrated',
      'the need to balance opposing forces or perspectives in your life',
      'your psyche\'s attempt to process recent experiences and emotions',
      'guidance from your unconscious about a current life situation',
      'the emergence of creative potential waiting to be expressed',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private generateContextualInsight(): string {
    const contexts = [
      'personal power and autonomy',
      'relationships and connection',
      'creative expression and authenticity',
      'spiritual growth and meaning',
      'professional identity and purpose',
      'emotional healing and wholeness',
    ];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  private assessLucidity(dream: string): number {
    const lucidityMarkers = ['realized i was dreaming', 'knew it was a dream', 'became lucid', 'took control', 'changed the dream'];
    const score = lucidityMarkers.reduce((acc, marker) => 
      dream.toLowerCase().includes(marker) ? acc + 0.2 : acc, 0
    );
    return Math.min(1.0, score);
  }

  private assessIntensity(dream: string): number {
    const intensityWords = ['vivid', 'intense', 'overwhelming', 'powerful', 'dramatic', 'shocking', 'incredible'];
    const score = intensityWords.reduce((acc, word) =>
      dream.toLowerCase().includes(word) ? acc + 0.15 : acc, 0.3
    );
    return Math.min(1.0, score);
  }

  private updatePersonalDictionary(dreamEntry: DreamEntry): void {
    for (const symbol of dreamEntry.symbols) {
      if (this.personalDictionary.has(symbol)) {
        const personal = this.personalDictionary.get(symbol)!;
        personal.frequency++;
        personal.contexts.push(dreamEntry.themes.join(', '));
        
        const newEvolution: SymbolEvolution = {
          date: dreamEntry.timestamp,
          context: dreamEntry.themes.join(', '),
          meaning: this.inferMeaningFromContext(symbol, dreamEntry),
          confidence: 0.7 + (personal.frequency * 0.05),
        };
        personal.evolution.push(newEvolution);
        
        const dreamEmotionalScore = dreamEntry.emotions.reduce((acc, emotion) => 
          acc + (this.emotionLexicon.get(emotion) || 0), 0) / dreamEntry.emotions.length;
        personal.emotionalValence = (personal.emotionalValence + dreamEmotionalScore) / 2;
        
      } else {
        const newSymbol: PersonalSymbol = {
          symbol,
          personalMeaning: this.inferMeaningFromContext(symbol, dreamEntry),
          universalMeaning: this.symbols.get(symbol) || 'Personal significance developing',
          frequency: 1,
          emotionalValence: dreamEntry.emotions.reduce((acc, emotion) => 
            acc + (this.emotionLexicon.get(emotion) || 0), 0) / Math.max(dreamEntry.emotions.length, 1),
          contexts: [dreamEntry.themes.join(', ')],
          evolution: [{
            date: dreamEntry.timestamp,
            context: dreamEntry.themes.join(', '),
            meaning: this.inferMeaningFromContext(symbol, dreamEntry),
            confidence: 0.6,
          }],
        };
        
        this.personalDictionary.set(symbol, newSymbol);
      }
    }
  }

  private inferMeaningFromContext(symbol: string, dreamEntry: DreamEntry): string {
    const contextClues = [
      ...dreamEntry.themes,
      ...dreamEntry.emotions,
    ];
    
    if (contextClues.includes('fear') || contextClues.includes('anxiety')) {
      return `represents challenges or fears you're processing (${symbol} in anxious context)`;
    }
    if (contextClues.includes('joy') || contextClues.includes('peace')) {
      return `symbolizes positive growth or resolution (${symbol} in harmonious context)`;
    }
    if (contextClues.includes('transformation')) {
      return `signifies major life changes or personal evolution (${symbol} as transformation catalyst)`;
    }
    
    return `holds personal significance in your journey of ${contextClues[0] || 'self-discovery'}`;
  }

  private detectNewPatterns(): void {
    if (this.dreamJournal.size < 3) return;
    
    const dreams = Array.from(this.dreamJournal.values());
    
    const symbolFrequency: Map<string, number> = new Map();
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        symbolFrequency.set(symbol, (symbolFrequency.get(symbol) || 0) + 1);
      });
    });
    
    for (const [symbol, frequency] of symbolFrequency.entries()) {
      if (frequency >= 3) {
        const existingPattern = this.detectedPatterns.find(p => p.pattern === symbol && p.type === 'recurring_symbol');
        if (!existingPattern) {
          const relevantDreams = dreams.filter(d => d.symbols.includes(symbol));
          this.detectedPatterns.push({
            type: 'recurring_symbol',
            pattern: symbol,
            frequency,
            confidence: Math.min(0.9, frequency / dreams.length + 0.3),
            firstSeen: relevantDreams[0].timestamp,
            lastSeen: relevantDreams[relevantDreams.length - 1].timestamp,
            associatedSymbols: this.findAssociatedSymbols(symbol, dreams),
            interpretation: `The repeated appearance of ${symbol} suggests deep personal significance`,
          });
        } else {
          existingPattern.frequency = frequency;
          existingPattern.lastSeen = dreams[dreams.length - 1].timestamp;
        }
      }
    }
  }

  private findAssociatedSymbols(targetSymbol: string, dreams: DreamEntry[]): string[] {
    const coOccurrences: Map<string, number> = new Map();
    
    dreams
      .filter(dream => dream.symbols.includes(targetSymbol))
      .forEach(dream => {
        dream.symbols.forEach(symbol => {
          if (symbol !== targetSymbol) {
            coOccurrences.set(symbol, (coOccurrences.get(symbol) || 0) + 1);
          }
        });
      });
    
    return Array.from(coOccurrences.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symbol, _]) => symbol);
  }

  private findRecurringElements(): string[] {
    return this.detectedPatterns
      .filter(pattern => pattern.frequency >= 3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
      .map(pattern => pattern.pattern);
  }

  private generateDreamReport(dreamEntry: DreamEntry): string {
    const patternConnections = this.detectedPatterns
      .filter(p => dreamEntry.symbols.includes(p.pattern) || dreamEntry.emotions.includes(p.pattern))
      .slice(0, 2);
    
    let report = `🌙 ENHANCED DREAM INTERPRETATION:

${dreamEntry.interpretation}

📊 DREAM METRICS:
• Lucidity Level: ${(dreamEntry.lucidity * 100).toFixed(0)}%
• Emotional Intensity: ${(dreamEntry.intensity * 100).toFixed(0)}%
• Symbolic Density: ${dreamEntry.symbols.length} symbols
• Thematic Elements: ${dreamEntry.themes.length} themes

🔗 PATTERN CONNECTIONS:`;

    if (patternConnections.length > 0) {
      report += '\\n' + patternConnections.map(p => 
        `• ${p.pattern} (${p.type.replace('_', ' ')}) - seen ${p.frequency} times`
      ).join('\\n');
    } else {
      report += '\\n• No recurring patterns detected yet - continue journaling for deeper insights';
    }

    report += `

🎯 ARCHETYPAL RESONANCE: ${this.identifyArchetype(dreamEntry.content)}

💡 INTEGRATION SUGGESTIONS:
${this.generateIntegrationSuggestions(dreamEntry)}

🎛️ DREAM COMMANDS:
• '/patterns' - View all detected dream patterns
• '/dictionary' - See your personal symbol meanings  
• '/analysis' - Get comprehensive dream trend analysis`;

    return report;
  }

  private generateIntegrationSuggestions(dreamEntry: DreamEntry): string {
    const suggestions = [];
    
    if (dreamEntry.lucidity > 0.3) {
      suggestions.push('Practice reality checks to increase lucid dreaming opportunities');
    }
    
    if (dreamEntry.intensity > 0.7) {
      suggestions.push('Journal about this vivid dream - strong dreams often carry important messages');
    }
    
    if (dreamEntry.emotions.includes('fear') || dreamEntry.emotions.includes('anxiety')) {
      suggestions.push('Consider what in your waking life might be triggering these anxious dream emotions');
    }
    
    if (dreamEntry.themes.includes('transformation')) {
      suggestions.push('Reflect on current life transitions - your psyche is processing change');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Meditate on the symbols and emotions from this dream throughout your day');
    }
    
    return suggestions.slice(0, 2).map(s => `• ${s}`).join('\\n');
  }

  private analyzeDreamPatterns(): string {
    if (this.detectedPatterns.length === 0) {
      return `🔍 PATTERN ANALYSIS:

No recurring patterns detected yet. Record at least 3-5 dreams to begin seeing meaningful patterns emerge.

Current dream count: ${this.dreamJournal.size}
Minimum for pattern detection: 3 dreams`;
    }

    return `🔍 DREAM PATTERN ANALYSIS:

Detected Patterns (${this.detectedPatterns.length} total):

${this.detectedPatterns
  .sort((a, b) => b.confidence - a.confidence)
  .map((pattern, i) => `${i + 1}. ${pattern.pattern.toUpperCase()}
   • Frequency: ${pattern.frequency} occurrences
   • Confidence: ${(pattern.confidence * 100).toFixed(0)}%
   • Associated with: ${pattern.associatedSymbols.join(', ') || 'standalone pattern'}`)
  .join('\\n\\n')}

💡 Continue keeping a dream journal to track how these patterns evolve over time.`;
  }

  private showPersonalDictionary(): string {
    if (this.personalDictionary.size === 0) {
      return `📚 PERSONAL DREAM DICTIONARY:

Your personal dictionary is still developing. Record more dreams to build your personalized symbol library!

Universal symbols available: ${Array.from(this.symbols.keys()).slice(0, 5).join(', ')}...`;
    }

    const entries = Array.from(this.personalDictionary.entries())
      .sort((a, b) => b[1].frequency - a[1].frequency);

    return `📚 PERSONAL DREAM DICTIONARY:

Your Personalized Symbols (${entries.length} total):

${entries.map(([symbol, data], i) => `${i + 1}. ${symbol.toUpperCase()}
   📊 Frequency: ${data.frequency} dreams
   💭 Personal Meaning: ${data.personalMeaning}
   🌍 Universal Meaning: ${data.universalMeaning}`)
   .join('\\n\\n')}

✨ Your dream dictionary grows richer with each dream!`;
  }

  private generateDreamAnalysis(): string {
    if (this.dreamJournal.size < 5) {
      return `📊 DREAM TREND ANALYSIS:

Insufficient data for comprehensive analysis. 
Current dreams: ${this.dreamJournal.size}
Continue recording your dreams to unlock detailed trend analysis!`;
    }

    const dreams = Array.from(this.dreamJournal.values());
    const allThemes = dreams.flatMap(d => d.themes);
    const topThemes = this.getTopItems(allThemes, 3);

    return `📊 COMPREHENSIVE DREAM ANALYSIS:

🎯 TOP THEMES (${this.dreamJournal.size} dreams):
${topThemes.map(([theme, count]) => `• ${theme}: ${count} dreams`).join('\\n')}

📈 PATTERN STRENGTH: ${this.detectedPatterns.length > 0 ? 
  (this.detectedPatterns.reduce((sum, p) => sum + p.confidence, 0) / this.detectedPatterns.length * 100).toFixed(0) : '0'}%

🌟 Your dreams show rich symbolic content and growing self-awareness over your journey.`;
  }

  private getTopItems(items: string[], limit: number): Array<[string, number]> {
    const frequency = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}