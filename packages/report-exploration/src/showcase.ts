#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chalk from 'chalk';
import { DreamJournalReport } from './use-cases/1-DreamJournal.js';
import { PlantGrowthReport } from './use-cases/2-PlantGrowthTracker.js';
import { MoodWeatherReport } from './use-cases/3-MoodWeatherCorrelation.js';
import { RecipeExperimentReport } from './use-cases/4-RecipeExperiment.js';
import { PetBehaviorReport } from './use-cases/5-PetBehaviorPattern.js';
import { CodeReviewPersonalityReport } from './use-cases/6-CodeReviewPersonality.js';
import { MusicListeningDNAReport } from './use-cases/7-MusicListeningDNA.js';
import { SocialNetworkHealthReport } from './use-cases/8-SocialNetworkHealth.js';
import { EnergyConsumptionReport } from './use-cases/9-EnergyConsumptionPattern.js';
import { ReadingComprehensionReport } from './use-cases/10-ReadingComprehension.js';
import { CreativeIdeaEvolutionReport } from './use-cases/11-CreativeIdeaEvolution.js';
import { ConversationDynamicsReport } from './use-cases/12-ConversationDynamics.js';

interface UseCase {
  id: number;
  title: string;
  description: string;
  category: string;
  demonstrate: () => Promise<void>;
}

class ReportShowcase {
  private useCases: UseCase[] = [
    {
      id: 1,
      title: 'Dream Journal Analytics',
      description: 'Track and analyze dream patterns, symbols, emotions, and lucidity levels over time',
      category: 'Personal/Psychological',
      demonstrate: this.demonstrateDreamJournal.bind(this),
    },
    {
      id: 2,
      title: 'Plant Growth Tracker',
      description: 'Monitor plant health, predict growth, and receive care recommendations based on environmental data',
      category: 'Environmental/Botanical',
      demonstrate: this.demonstratePlantGrowth.bind(this),
    },
    {
      id: 3,
      title: 'Mood-Weather Correlation',
      description: 'Discover how weather patterns affect your mood and energy levels',
      category: 'Wellness/Meteorological',
      demonstrate: this.demonstrateMoodWeather.bind(this),
    },
    {
      id: 4,
      title: 'Recipe Experiment Lab',
      description: 'Scientific approach to recipe optimization through iterative experimentation',
      category: 'Culinary/Scientific',
      demonstrate: this.demonstrateRecipeExperiment.bind(this),
    },
    {
      id: 5,
      title: 'Pet Behavior Pattern Analysis',
      description: 'Predict pet behavior, identify stressors, and receive training recommendations',
      category: 'Animal Behavior',
      demonstrate: this.demonstratePetBehavior.bind(this),
    },
    {
      id: 6,
      title: 'Code Review Personality Profiler',
      description: 'Analyze code review patterns to understand reviewer personality and team dynamics',
      category: 'Software Development',
      demonstrate: this.demonstrateCodeReview.bind(this),
    },
    {
      id: 7,
      title: 'Music Listening DNA',
      description: 'Deep analysis of music preferences, listening patterns, and personalized recommendations',
      category: 'Entertainment/Analytics',
      demonstrate: this.demonstrateMusicDNA.bind(this),
    },
    {
      id: 8,
      title: 'Social Network Health Monitor',
      description: 'Track relationship health, identify at-risk connections, and optimize social interactions',
      category: 'Relationships/Wellness',
      demonstrate: this.demonstrateSocialNetwork.bind(this),
    },
    {
      id: 9,
      title: 'Energy Consumption Pattern Analyzer',
      description: 'Identify wastage, predict costs, and receive sustainability recommendations',
      category: 'Sustainability/Finance',
      demonstrate: this.demonstrateEnergyConsumption.bind(this),
    },
    {
      id: 10,
      title: 'Reading Comprehension Optimizer',
      description: 'Track reading speed, comprehension, and identify optimal learning conditions',
      category: 'Education/Cognitive',
      demonstrate: this.demonstrateReadingComprehension.bind(this),
    },
    {
      id: 11,
      title: 'Creative Idea Evolution Tracker',
      description: 'Map idea genealogy, track creative patterns, and identify breakthrough concepts',
      category: 'Innovation/Creativity',
      demonstrate: this.demonstrateIdeaEvolution.bind(this),
    },
    {
      id: 12,
      title: 'Conversation Dynamics Analyzer',
      description: 'Analyze speaking patterns, team dynamics, and communication effectiveness',
      category: 'Communication/Team',
      demonstrate: this.demonstrateConversationDynamics.bind(this),
    },
  ];

  async run(): Promise<void> {
    this.printHeader();
    this.printOverview();
    
    console.log(chalk.cyan('\n📊 Running demonstrations for all 12 use cases...\n'));
    
    for (const useCase of this.useCases) {
      await this.demonstrateUseCase(useCase);
    }
    
    this.printSummary();
  }

  private printHeader(): void {
    console.log(chalk.bold.magenta('\n' + '='.repeat(80)));
    console.log(chalk.bold.magenta('         REPORT EXPLORATION MVP - 12 Unexpected Use Cases'));
    console.log(chalk.bold.magenta('='.repeat(80)));
  }

  private printOverview(): void {
    console.log(chalk.yellow('\n📋 Overview:'));
    console.log('This MVP demonstrates how report functionality can be repurposed in creative ways.');
    console.log('Each use case shares common components while serving completely different purposes.\n');
    
    console.log(chalk.green('🔧 Common Components:'));
    console.log('  • BaseReport class with metadata, storage, and export capabilities');
    console.log('  • ReportPipeline for processing stages');
    console.log('  • ReportAggregator for combining multiple reports');
    console.log('  • Flexible data structures for various content types');
    console.log('  • Priority and tagging systems for alerts');
  }

  private async demonstrateUseCase(useCase: UseCase): Promise<void> {
    console.log(chalk.bold.blue(`\n${'-'.repeat(60)}`));
    console.log(chalk.bold.cyan(`${useCase.id}. ${useCase.title}`));
    console.log(chalk.gray(`   Category: ${useCase.category}`));
    console.log(chalk.white(`   ${useCase.description}`));
    console.log(chalk.bold.blue(`${'-'.repeat(60)}`));
    
    try {
      await useCase.demonstrate();
    } catch (error) {
      console.log(chalk.red(`   ❌ Error: ${error}`));
    }
  }

  private async demonstrateDreamJournal(): Promise<void> {
    const report = new DreamJournalReport();
    
    report.recordDream({
      narrative: 'Flying over a city made of glass',
      emotions: ['wonder', 'freedom', 'anxiety'],
      symbols: ['flight', 'glass', 'city', 'height'],
      lucidity: 3,
      recurring: false,
    });
    
    report.recordDream({
      narrative: 'Lost in a familiar yet strange house',
      emotions: ['confusion', 'curiosity', 'fear'],
      symbols: ['house', 'doors', 'maze', 'childhood'],
      lucidity: 2,
      recurring: true,
    });
    
    const insights = report.generateInsights();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log(`      • Symbol pattern detection: ${insights.recurringThemes.length} recurring themes`);
    console.log(`      • Emotional profiling: ${insights.emotionalProfile.length} emotion types tracked`);
    console.log(`      • Lucidity tracking: ${insights.lucidityTrend} trend`);
    console.log(`      • Average lucidity score: ${insights.averageLucidity.toFixed(2)}/5`);
  }

  private async demonstratePlantGrowth(): Promise<void> {
    const report = new PlantGrowthReport('plant-001', 'Monstera Deliciosa');
    
    const baseDate = new Date();
    report.addMeasurement({
      date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      height: 45,
      leafCount: 8,
      health: 4,
      watered: true,
      fertilized: false,
      temperature: 22,
      humidity: 65,
      lightHours: 6,
    });
    
    report.addMeasurement({
      date: baseDate,
      height: 48,
      leafCount: 9,
      health: 5,
      watered: true,
      fertilized: true,
      temperature: 23,
      humidity: 70,
      lightHours: 8,
    });
    
    const prediction = report.predictGrowth();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log(`      • Growth rate: ${report.calculateGrowthRate().toFixed(2)} cm/day`);
    console.log(`      • Health trend: ${prediction.healthTrend}`);
    console.log(`      • Expected height in 30 days: ${prediction.expectedHeight.toFixed(1)} cm`);
    console.log(`      • Environmental correlation analysis`);
    console.log(`      • Care recommendations: ${prediction.recommendations.length} suggestions`);
  }

  private async demonstrateMoodWeather(): Promise<void> {
    const report = new MoodWeatherReport();
    
    const now = new Date();
    report.addMoodEntry({
      timestamp: now,
      mood: 7,
      energy: 8,
      anxiety: 3,
      socialInteraction: true,
      exercise: true,
      sleepQuality: 8,
    });
    
    report.addWeatherData({
      timestamp: now,
      temperature: 22,
      humidity: 60,
      pressure: 1013,
      cloudCover: 30,
      precipitation: 0,
      windSpeed: 10,
      uvIndex: 5,
    });
    
    report.analyzeCorrelations();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Weather-mood correlation analysis');
    console.log('      • Personalized weather sensitivity score');
    console.log('      • Optimal condition identification');
    console.log('      • Weekly and seasonal pattern analysis');
    console.log('      • Exercise effect quantification');
  }

  private async demonstrateRecipeExperiment(): Promise<void> {
    const report = new RecipeExperimentReport();
    
    report.recordAttempt({
      id: 'attempt-1',
      timestamp: new Date(),
      baseRecipe: 'Chocolate Chip Cookies',
      modifications: ['brown butter', 'sea salt finish'],
      ingredients: [
        { name: 'flour', amount: 200, unit: 'g' },
        { name: 'butter', amount: 150, unit: 'g' },
        { name: 'sugar', amount: 100, unit: 'g' },
      ],
      cookingTime: 12,
      temperature: 180,
      technique: 'traditional-creaming',
      results: { taste: 4, texture: 5, appearance: 4, difficulty: 2 },
      notes: 'Excellent texture, could use more chocolate',
      wouldRepeat: true,
    });
    
    const suggestions = report.suggestNextExperiment();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Scientific method application to cooking');
    console.log('      • Modification impact analysis');
    console.log('      • Optimal combination identification');
    console.log(`      • Next experiment suggestions: ${suggestions.length} ideas`);
    console.log('      • Temperature and time hypothesis generation');
  }

  private async demonstratePetBehavior(): Promise<void> {
    const report = new PetBehaviorReport({
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      weight: 30,
    });
    
    report.recordBehavior({
      timestamp: new Date(),
      behavior: 'tail-wagging',
      trigger: 'owner-arrival',
      duration: 30,
      intensity: 4,
      location: 'front-door',
      humanPresent: true,
      otherPetsPresent: false,
    });
    
    const prediction = report.predictNextBehavior();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Behavior prediction algorithm');
    console.log('      • Stress trigger identification');
    console.log('      • Social pattern analysis');
    console.log('      • Health indicator monitoring');
    console.log(`      • Training recommendations generated`);
  }

  private async demonstrateCodeReview(): Promise<void> {
    const report = new CodeReviewPersonalityReport();
    
    report.addReview({
      id: 'review-1',
      timestamp: new Date(),
      reviewer: 'dev-1',
      fileType: 'typescript',
      linesReviewed: 200,
      comments: [
        { type: 'style', tone: 'neutral', length: 50, hasCodeSuggestion: true, hasExplanation: false, hasReference: false },
        { type: 'performance', tone: 'supportive', length: 100, hasCodeSuggestion: true, hasExplanation: true, hasReference: true },
      ],
      timeSpent: 30,
      severity: 'suggestion',
      approved: true,
    });
    
    const profile = report.generatePersonalityProfile();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log(`      • Personality profile: "${profile}"`);
    console.log('      • Review pattern analysis');
    console.log('      • Team compatibility scoring');
    console.log('      • Improvement suggestions');
    console.log('      • Conflict risk assessment');
  }

  private async demonstrateMusicDNA(): Promise<void> {
    const report = new MusicListeningDNAReport();
    
    report.addSession({
      timestamp: new Date(),
      track: {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        genre: 'rock',
        bpm: 120,
        key: 'Bb',
        energy: 0.8,
        valence: 0.6,
        danceability: 0.4,
        acousticness: 0.2,
      },
      duration: 360,
      skipped: false,
      repeated: true,
      context: 'work',
      mood: 'energetic',
      deviceType: 'desktop',
    });
    
    const personality = report.generateListeningPersonality();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log(`      • Listening personality: "${personality}"`);
    console.log('      • Genre distribution analysis');
    console.log('      • Context-based predictions');
    console.log('      • Skip pattern analysis');
    console.log('      • Discovery rate calculation');
  }

  private async demonstrateSocialNetwork(): Promise<void> {
    const report = new SocialNetworkHealthReport();
    
    report.addContact({
      id: 'contact-1',
      name: 'Alice',
      relationship: 'close_friend',
      importance: 5,
    });
    
    report.recordInteraction({
      timestamp: new Date(),
      contactId: 'contact-1',
      type: 'message',
      quality: 4,
      initiated: true,
      emotional_tone: 'positive',
      topics: ['work', 'hobbies'],
    });
    
    report.calculateNetworkMetrics();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Network health metrics calculation');
    console.log('      • At-risk relationship identification');
    console.log('      • Interaction pattern analysis');
    console.log('      • Social preference detection');
    console.log('      • Maintenance recommendations');
  }

  private async demonstrateEnergyConsumption(): Promise<void> {
    const report = new EnergyConsumptionReport();
    
    report.addReading({
      timestamp: new Date(),
      device: 'air-conditioner',
      consumption: 2.5,
      cost: 0.45,
      source: 'grid',
      room: 'living-room',
      activity: 'cooling',
      occupancy: 2,
      temperature: 28,
    });
    
    const futureCost = report.predictFutureCost(30);
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Phantom power detection');
    console.log('      • Peak hour identification');
    console.log(`      • Cost prediction: $${futureCost.toFixed(2)} for next 30 days`);
    console.log('      • Savings recommendations with ROI');
    console.log('      • Carbon footprint calculation');
  }

  private async demonstrateReadingComprehension(): Promise<void> {
    const report = new ReadingComprehensionReport();
    
    report.recordSession({
      timestamp: new Date(),
      material: {
        title: 'Effective TypeScript',
        type: 'book',
        category: 'technical',
        difficulty: 4,
        length: 300,
      },
      duration: 60,
      pagesRead: 30,
      comprehensionTest: { score: 8, questions: 10 },
      notes: ['Type inference', 'Generics patterns'],
      highlights: 5,
      rereads: 1,
      distractions: 2,
      environment: 'quiet',
      timeOfDay: 'morning',
    });
    
    const tips = report.generatePersonalizedTips();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Reading speed tracking by difficulty');
    console.log('      • Comprehension analysis by environment');
    console.log('      • Optimal learning condition identification');
    console.log(`      • Personalized tips: ${tips.length} suggestions`);
    console.log('      • Retention score calculation');
  }

  private async demonstrateIdeaEvolution(): Promise<void> {
    const report = new CreativeIdeaEvolutionReport();
    
    const parentId = 'idea-1';
    report.addIdea({
      id: parentId,
      timestamp: new Date(),
      title: 'Smart Plant Watering System',
      description: 'IoT system for automated plant care',
      category: 'hardware',
      tags: ['iot', 'automation', 'plants'],
      inspirations: ['nature', 'technology'],
      stage: 'concept',
      feasibility: 4,
      originality: 3,
      impact: 4,
      resources: ['Arduino', 'Moisture sensors'],
      connections: [],
    });
    
    report.addIdea({
      id: 'idea-2',
      timestamp: new Date(),
      title: 'AI Plant Health Diagnostics',
      description: 'Computer vision for plant disease detection',
      category: 'software',
      tags: ['ai', 'computer-vision', 'plants'],
      inspirations: ['machine-learning', 'agriculture'],
      stage: 'development',
      feasibility: 3,
      originality: 4,
      impact: 5,
      resources: ['TensorFlow', 'Camera'],
      connections: [],
    }, {
      parentId,
      mutations: ['Added AI component', 'Shifted to software focus'],
      iterationNumber: 2,
    });
    
    const breakthroughs = report.identifyBreakthroughIdeas();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log(`      • Idea genealogy tracking`);
    console.log(`      • Breakthrough ideas: ${breakthroughs.length} identified`);
    console.log('      • Cross-pollination analysis');
    console.log('      • Creative pattern recognition');
    console.log('      • Convergent evolution detection');
  }

  private async demonstrateConversationDynamics(): Promise<void> {
    const report = new ConversationDynamicsReport();
    
    report.addParticipant({
      id: 'speaker-1',
      name: 'Team Lead',
      dominance: 0,
      engagement: 0,
      positivity: 0,
    });
    
    report.addParticipant({
      id: 'speaker-2',
      name: 'Developer',
      dominance: 0,
      engagement: 0,
      positivity: 0,
    });
    
    report.recordTurn({
      timestamp: new Date(),
      speaker: 'speaker-1',
      text: 'What do you think about the new architecture?',
      duration: 10,
      wordCount: 8,
      sentiment: 0.2,
      energy: 0.5,
      interruption: false,
      questions: 1,
      statements: 0,
      agreements: 0,
      disagreements: 0,
    });
    
    report.recordTurn({
      timestamp: new Date(Date.now() + 11000),
      speaker: 'speaker-2',
      text: 'I think it has potential, but we need to consider scalability.',
      duration: 8,
      wordCount: 11,
      sentiment: 0.1,
      energy: 0.4,
      interruption: false,
      questions: 0,
      statements: 1,
      agreements: 1,
      disagreements: 0,
    });
    
    report.calculateConversationMetrics();
    const insights = report.generateCommunicationInsights();
    
    console.log(chalk.green('   ✅ Key Features:'));
    console.log('      • Turn-taking pattern analysis');
    console.log('      • Conversation phase detection');
    console.log('      • Team dynamics assessment');
    console.log(`      • Communication insights: ${insights.length} findings`);
    console.log('      • Network graph generation');
  }

  private printSummary(): void {
    console.log(chalk.bold.yellow('\n' + '='.repeat(80)));
    console.log(chalk.bold.yellow('                           SUMMARY'));
    console.log(chalk.bold.yellow('='.repeat(80)));
    
    console.log(chalk.white('\n🎯 Key Takeaways:'));
    console.log('  1. Report functionality can be adapted to ANY domain requiring data tracking');
    console.log('  2. Common components provide consistency while allowing flexibility');
    console.log('  3. Pattern detection and prediction are universally valuable');
    console.log('  4. Correlation analysis reveals hidden insights across domains');
    console.log('  5. Visualization and metrics help understand complex relationships');
    
    console.log(chalk.cyan('\n💡 Potential Applications:'));
    console.log('  • Personal development and wellness tracking');
    console.log('  • Scientific experimentation and research');
    console.log('  • Team and organizational analytics');
    console.log('  • Environmental and sustainability monitoring');
    console.log('  • Creative and innovation management');
    console.log('  • Educational and cognitive optimization');
    
    console.log(chalk.green('\n✨ Next Steps:'));
    console.log('  • Choose 1-3 use cases that resonate most');
    console.log('  • Extend with real data integration');
    console.log('  • Add visualization dashboards');
    console.log('  • Implement machine learning predictions');
    console.log('  • Create mobile/web interfaces');
    console.log('  • Add export formats (PDF, CSV, API)');
    
    console.log(chalk.bold.magenta('\n' + '='.repeat(80)));
    console.log(chalk.bold.magenta('                    END OF DEMONSTRATION'));
    console.log(chalk.bold.magenta('='.repeat(80) + '\n'));
  }
}

async function main(): Promise<void> {
  const showcase = new ReportShowcase();
  await showcase.run();
}

main().catch(console.error);