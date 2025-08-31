/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface PlantMeasurement {
  date: Date;
  height: number;
  leafCount: number;
  health: 1 | 2 | 3 | 4 | 5;
  watered: boolean;
  fertilized: boolean;
  temperature: number;
  humidity: number;
  lightHours: number;
  notes?: string;
}

interface GrowthPrediction {
  expectedHeight: number;
  daysToFlower: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

export class PlantGrowthReport extends BaseReport {
  private measurements: PlantMeasurement[] = [];
  private plantSpecies: string;
  private plantId: string;

  constructor(plantId: string, species: string) {
    super('plant-growth');
    this.plantId = plantId;
    this.plantSpecies = species;
    this.setTag('botanical');
    this.setTag('environmental');
  }

  addMeasurement(measurement: PlantMeasurement): void {
    this.measurements.push(measurement);
    this.checkAlerts(measurement);
  }

  private checkAlerts(measurement: PlantMeasurement): void {
    if (measurement.health <= 2) {
      this.setPriority('high');
      this.setTag('needs-attention');
    }

    if (!measurement.watered && this.getDaysSinceWatered() > 3) {
      this.setPriority('critical');
      this.setTag('dehydration-risk');
    }
  }

  private getDaysSinceWatered(): number {
    const lastWatered = [...this.measurements]
      .reverse()
      .find(m => m.watered);
    
    if (!lastWatered) return 999;
    
    const daysDiff = (Date.now() - lastWatered.date.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(daysDiff);
  }

  calculateGrowthRate(): number {
    if (this.measurements.length < 2) return 0;
    
    const firstHeight = this.measurements[0].height;
    const lastHeight = this.measurements[this.measurements.length - 1].height;
    const daysPassed = (this.measurements[this.measurements.length - 1].date.getTime() - 
                       this.measurements[0].date.getTime()) / (1000 * 60 * 60 * 24);
    
    return (lastHeight - firstHeight) / daysPassed;
  }

  predictGrowth(): GrowthPrediction {
    const growthRate = this.calculateGrowthRate();
    const avgHealth = this.measurements.reduce((sum, m) => sum + m.health, 0) / this.measurements.length;
    const recentHealth = this.measurements.slice(-5).reduce((sum, m) => sum + m.health, 0) / 5;
    
    const recommendations: string[] = [];
    
    if (this.getDaysSinceWatered() > 2) {
      recommendations.push('Water immediately');
    }
    
    const avgLightHours = this.measurements.reduce((sum, m) => sum + m.lightHours, 0) / this.measurements.length;
    if (avgLightHours < 6) {
      recommendations.push('Increase light exposure');
    }
    
    const lastMeasurement = this.measurements[this.measurements.length - 1];
    if (lastMeasurement.humidity < 40) {
      recommendations.push('Increase humidity');
    }

    return {
      expectedHeight: lastMeasurement.height + (growthRate * 30),
      daysToFlower: Math.max(0, 60 - this.measurements.length),
      healthTrend: recentHealth > avgHealth ? 'improving' : 
                   recentHealth < avgHealth ? 'declining' : 'stable',
      recommendations,
    };
  }

  generateReport(): void {
    const prediction = this.predictGrowth();
    
    this.setContent({
      plantId: this.plantId,
      species: this.plantSpecies,
      measurements: this.measurements,
      statistics: {
        growthRate: this.calculateGrowthRate(),
        averageHealth: this.measurements.reduce((sum, m) => sum + m.health, 0) / this.measurements.length,
        totalGrowth: this.measurements[this.measurements.length - 1].height - this.measurements[0].height,
        daysSinceWatered: this.getDaysSinceWatered(),
      },
      prediction,
      environmentalCorrelations: this.findCorrelations(),
    });
  }

  private findCorrelations(): Record<string, number> {
    if (this.measurements.length < 5) return {};
    
    const correlations: Record<string, number> = {};
    
    const temps = this.measurements.map(m => m.temperature);
    const healths = this.measurements.map(m => m.health);
    correlations['temperature-health'] = this.calculateCorrelation(temps, healths);
    
    const lights = this.measurements.map(m => m.lightHours);
    const growths = this.measurements.slice(1).map((m, i) => 
      m.height - this.measurements[i].height
    );
    if (growths.length === lights.length - 1) {
      correlations['light-growth'] = this.calculateCorrelation(lights.slice(0, -1), growths);
    }
    
    return correlations;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}