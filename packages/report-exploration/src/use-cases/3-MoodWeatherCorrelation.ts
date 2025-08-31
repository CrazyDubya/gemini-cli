/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface MoodEntry {
  timestamp: Date;
  mood: number;
  energy: number;
  anxiety: number;
  socialInteraction: boolean;
  exercise: boolean;
  sleepQuality: number;
}

interface WeatherData {
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
}

export class MoodWeatherReport extends BaseReport {
  private moodEntries: MoodEntry[] = [];
  private weatherData: WeatherData[] = [];
  private correlations: Map<string, number> = new Map();

  constructor() {
    super('mood-weather-correlation');
    this.setTag('wellness');
    this.setTag('meteorological');
  }

  addMoodEntry(entry: MoodEntry): void {
    this.moodEntries.push(entry);
  }

  addWeatherData(data: WeatherData): void {
    this.weatherData.push(data);
  }

  analyzeCorrelations(): void {
    const alignedData = this.alignDataByTime();
    
    this.correlations.set('temperature-mood', 
      this.calculateCorrelation(
        alignedData.map(d => d.weather.temperature),
        alignedData.map(d => d.mood.mood)
      )
    );
    
    this.correlations.set('pressure-anxiety',
      this.calculateCorrelation(
        alignedData.map(d => d.weather.pressure),
        alignedData.map(d => d.mood.anxiety)
      )
    );
    
    this.correlations.set('sunshine-energy',
      this.calculateCorrelation(
        alignedData.map(d => 100 - d.weather.cloudCover),
        alignedData.map(d => d.mood.energy)
      )
    );
    
    this.correlations.set('humidity-sleep',
      this.calculateCorrelation(
        alignedData.map(d => d.weather.humidity),
        alignedData.map(d => d.mood.sleepQuality)
      )
    );
  }

  private alignDataByTime(): Array<{ mood: MoodEntry; weather: WeatherData }> {
    const aligned: Array<{ mood: MoodEntry; weather: WeatherData }> = [];
    
    for (const mood of this.moodEntries) {
      const closestWeather = this.findClosestWeather(mood.timestamp);
      if (closestWeather) {
        aligned.push({ mood, weather: closestWeather });
      }
    }
    
    return aligned;
  }

  private findClosestWeather(timestamp: Date): WeatherData | null {
    if (this.weatherData.length === 0) return null;
    
    let closest = this.weatherData[0];
    let minDiff = Math.abs(timestamp.getTime() - closest.timestamp.getTime());
    
    for (const weather of this.weatherData) {
      const diff = Math.abs(timestamp.getTime() - weather.timestamp.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = weather;
      }
    }
    
    return minDiff < 3600000 ? closest : null;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }

  generatePersonalizedRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.correlations.forEach((correlation, key) => {
      if (Math.abs(correlation) > 0.5) {
        const [weather, mood] = key.split('-');
        
        if (correlation > 0) {
          recommendations.push(
            `Strong positive correlation between ${weather} and ${mood}. ` +
            `Consider planning activities when ${weather} is favorable.`
          );
        } else {
          recommendations.push(
            `Strong negative correlation between ${weather} and ${mood}. ` +
            `Prepare coping strategies when ${weather} is unfavorable.`
          );
        }
      }
    });
    
    const exerciseEffect = this.analyzeExerciseEffect();
    if (exerciseEffect > 0.3) {
      recommendations.push('Exercise shows significant positive impact on mood regardless of weather.');
    }
    
    return recommendations;
  }

  private analyzeExerciseEffect(): number {
    const withExercise = this.moodEntries.filter(m => m.exercise);
    const withoutExercise = this.moodEntries.filter(m => !m.exercise);
    
    if (withExercise.length === 0 || withoutExercise.length === 0) return 0;
    
    const avgWithExercise = withExercise.reduce((sum, m) => sum + m.mood, 0) / withExercise.length;
    const avgWithoutExercise = withoutExercise.reduce((sum, m) => sum + m.mood, 0) / withoutExercise.length;
    
    return (avgWithExercise - avgWithoutExercise) / 10;
  }

  generateReport(): void {
    this.analyzeCorrelations();
    
    this.setContent({
      moodEntries: this.moodEntries.length,
      weatherDataPoints: this.weatherData.length,
      correlations: Object.fromEntries(this.correlations),
      insights: {
        strongestCorrelation: this.findStrongestCorrelation(),
        weatherSensitivity: this.calculateWeatherSensitivity(),
        optimalConditions: this.findOptimalConditions(),
        recommendations: this.generatePersonalizedRecommendations(),
      },
      patterns: {
        weeklyPattern: this.analyzeWeeklyPattern(),
        seasonalTrend: this.analyzeSeasonalTrend(),
      },
    });
  }

  private findStrongestCorrelation(): { factor: string; value: number } {
    let strongest = { factor: '', value: 0 };
    
    this.correlations.forEach((value, key) => {
      if (Math.abs(value) > Math.abs(strongest.value)) {
        strongest = { factor: key, value };
      }
    });
    
    return strongest;
  }

  private calculateWeatherSensitivity(): number {
    const avgCorrelation = Array.from(this.correlations.values())
      .reduce((sum, val) => sum + Math.abs(val), 0) / this.correlations.size;
    return avgCorrelation;
  }

  private findOptimalConditions(): WeatherData | null {
    const aligned = this.alignDataByTime();
    if (aligned.length === 0) return null;
    
    let best = aligned[0];
    let bestMood = aligned[0].mood.mood;
    
    for (const data of aligned) {
      if (data.mood.mood > bestMood) {
        bestMood = data.mood.mood;
        best = data;
      }
    }
    
    return best.weather;
  }

  private analyzeWeeklyPattern(): Record<string, number> {
    const pattern: Record<string, number> = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => {
      const dayEntries = this.moodEntries.filter(m => 
        days[m.timestamp.getDay()] === day
      );
      
      if (dayEntries.length > 0) {
        pattern[day] = dayEntries.reduce((sum, m) => sum + m.mood, 0) / dayEntries.length;
      }
    });
    
    return pattern;
  }

  private analyzeSeasonalTrend(): string {
    if (this.moodEntries.length < 30) return 'insufficient-data';
    
    const recent = this.moodEntries.slice(-10);
    const older = this.moodEntries.slice(0, 10);
    
    const recentAvg = recent.reduce((sum, m) => sum + m.mood, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.mood, 0) / older.length;
    
    return recentAvg > olderAvg ? 'improving' : 'declining';
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}