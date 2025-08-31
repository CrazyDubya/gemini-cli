/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export { BaseReport, type ReportData, type ReportMetadata } from './core/BaseReport.js';
export { ReportPipeline, ReportAggregator } from './core/ReportPipeline.js';

export { DreamJournalReport } from './use-cases/1-DreamJournal.js';
export { PlantGrowthReport } from './use-cases/2-PlantGrowthTracker.js';
export { MoodWeatherReport } from './use-cases/3-MoodWeatherCorrelation.js';
export { RecipeExperimentReport } from './use-cases/4-RecipeExperiment.js';
export { PetBehaviorReport } from './use-cases/5-PetBehaviorPattern.js';
export { CodeReviewPersonalityReport } from './use-cases/6-CodeReviewPersonality.js';
export { MusicListeningDNAReport } from './use-cases/7-MusicListeningDNA.js';
export { SocialNetworkHealthReport } from './use-cases/8-SocialNetworkHealth.js';
export { EnergyConsumptionReport } from './use-cases/9-EnergyConsumptionPattern.js';
export { ReadingComprehensionReport } from './use-cases/10-ReadingComprehension.js';
export { CreativeIdeaEvolutionReport } from './use-cases/11-CreativeIdeaEvolution.js';
export { ConversationDynamicsReport } from './use-cases/12-ConversationDynamics.js';