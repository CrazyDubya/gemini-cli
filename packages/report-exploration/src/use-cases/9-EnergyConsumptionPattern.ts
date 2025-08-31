/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface EnergyReading {
  timestamp: Date;
  device: string;
  consumption: number;
  cost: number;
  source: 'grid' | 'solar' | 'battery' | 'generator';
  room: string;
  activity?: string;
  occupancy: number;
  temperature: number;
}

interface EnergyProfile {
  peakHours: number[];
  baselineConsumption: number;
  wastageEstimate: number;
  efficiencyScore: number;
  carbonFootprint: number;
}

export class EnergyConsumptionReport extends BaseReport {
  private readings: EnergyReading[] = [];
  private profile: EnergyProfile;
  private deviceProfiles: Map<string, { avg: number; peak: number; phantom: number }> = new Map();
  private anomalies: EnergyReading[] = [];

  constructor() {
    super('energy-consumption');
    this.setTag('sustainability');
    this.setTag('cost-optimization');
    this.profile = {
      peakHours: [],
      baselineConsumption: 0,
      wastageEstimate: 0,
      efficiencyScore: 0,
      carbonFootprint: 0,
    };
  }

  addReading(reading: EnergyReading): void {
    this.readings.push(reading);
    this.updateDeviceProfile(reading);
    this.detectAnomaly(reading);
  }

  private updateDeviceProfile(reading: EnergyReading): void {
    if (!this.deviceProfiles.has(reading.device)) {
      this.deviceProfiles.set(reading.device, { avg: 0, peak: 0, phantom: 0 });
    }
    
    const profile = this.deviceProfiles.get(reading.device)!;
    const deviceReadings = this.readings.filter(r => r.device === reading.device);
    
    profile.avg = deviceReadings.reduce((sum, r) => sum + r.consumption, 0) / deviceReadings.length;
    profile.peak = Math.max(...deviceReadings.map(r => r.consumption));
    
    const nightReadings = deviceReadings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 0 && hour <= 6 && r.occupancy === 0;
    });
    
    if (nightReadings.length > 0) {
      profile.phantom = nightReadings.reduce((sum, r) => sum + r.consumption, 0) / nightReadings.length;
    }
  }

  private detectAnomaly(reading: EnergyReading): void {
    const deviceProfile = this.deviceProfiles.get(reading.device);
    
    if (deviceProfile && reading.consumption > deviceProfile.avg * 2) {
      this.anomalies.push(reading);
      this.setPriority('medium');
      this.setTag('anomaly-detected');
    }
  }

  calculateEnergyProfile(): void {
    this.profile.peakHours = this.identifyPeakHours();
    this.profile.baselineConsumption = this.calculateBaseline();
    this.profile.wastageEstimate = this.estimateWastage();
    this.profile.efficiencyScore = this.calculateEfficiency();
    this.profile.carbonFootprint = this.calculateCarbonFootprint();
  }

  private identifyPeakHours(): number[] {
    const hourlyConsumption: Record<number, number> = {};
    
    for (const reading of this.readings) {
      const hour = reading.timestamp.getHours();
      hourlyConsumption[hour] = (hourlyConsumption[hour] || 0) + reading.consumption;
    }
    
    const avgConsumption = Object.values(hourlyConsumption).reduce((a, b) => a + b, 0) / 24;
    
    return Object.entries(hourlyConsumption)
      .filter(([_, consumption]) => consumption > avgConsumption * 1.5)
      .map(([hour]) => parseInt(hour));
  }

  private calculateBaseline(): number {
    const nightReadings = this.readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 2 && hour <= 5;
    });
    
    if (nightReadings.length === 0) return 0;
    
    return nightReadings.reduce((sum, r) => sum + r.consumption, 0) / nightReadings.length;
  }

  private estimateWastage(): number {
    let wastage = 0;
    
    this.deviceProfiles.forEach((profile, device) => {
      wastage += profile.phantom * 24 * 30;
    });
    
    const unoccupiedConsumption = this.readings
      .filter(r => r.occupancy === 0 && r.consumption > this.profile.baselineConsumption)
      .reduce((sum, r) => sum + (r.consumption - this.profile.baselineConsumption), 0);
    
    wastage += unoccupiedConsumption;
    
    return wastage;
  }

  private calculateEfficiency(): number {
    const totalConsumption = this.readings.reduce((sum, r) => sum + r.consumption, 0);
    const necessaryConsumption = totalConsumption - this.profile.wastageEstimate;
    
    return necessaryConsumption / totalConsumption;
  }

  private calculateCarbonFootprint(): number {
    const carbonFactors = {
      grid: 0.5,
      solar: 0.05,
      battery: 0.1,
      generator: 0.8,
    };
    
    let totalCarbon = 0;
    
    for (const reading of this.readings) {
      totalCarbon += reading.consumption * carbonFactors[reading.source];
    }
    
    return totalCarbon;
  }

  predictFutureCost(days: number): number {
    const dailyAvg = this.readings.reduce((sum, r) => sum + r.cost, 0) / 
                    (this.readings.length / 24);
    
    const seasonalFactor = this.calculateSeasonalFactor();
    
    return dailyAvg * days * seasonalFactor;
  }

  private calculateSeasonalFactor(): number {
    const currentMonth = new Date().getMonth();
    const summerMonths = [5, 6, 7, 8];
    const winterMonths = [11, 0, 1, 2];
    
    if (summerMonths.includes(currentMonth)) return 1.3;
    if (winterMonths.includes(currentMonth)) return 1.2;
    return 1.0;
  }

  generateSavingsRecommendations(): Array<{ action: string; savings: number; difficulty: string }> {
    const recommendations: Array<{ action: string; savings: number; difficulty: string }> = [];
    
    this.deviceProfiles.forEach((profile, device) => {
      if (profile.phantom > 0.1) {
        recommendations.push({
          action: `Add smart plug to ${device} to eliminate phantom load`,
          savings: profile.phantom * 24 * 30 * 0.15,
          difficulty: 'easy',
        });
      }
    });
    
    if (this.profile.peakHours.length > 0) {
      recommendations.push({
        action: `Shift high-consumption activities outside peak hours (${this.profile.peakHours.join(', ')})`,
        savings: this.readings.reduce((sum, r) => sum + r.cost, 0) * 0.1,
        difficulty: 'medium',
      });
    }
    
    const highConsumptionDevices = Array.from(this.deviceProfiles.entries())
      .filter(([_, profile]) => profile.avg > 1)
      .map(([device]) => device);
    
    if (highConsumptionDevices.length > 0) {
      recommendations.push({
        action: `Upgrade ${highConsumptionDevices[0]} to energy-efficient model`,
        savings: this.deviceProfiles.get(highConsumptionDevices[0])!.avg * 0.3 * 24 * 30 * 0.15,
        difficulty: 'hard',
      });
    }
    
    const unoccupiedWastage = this.readings
      .filter(r => r.occupancy === 0 && r.consumption > this.profile.baselineConsumption)
      .reduce((sum, r) => sum + r.cost, 0);
    
    if (unoccupiedWastage > 0) {
      recommendations.push({
        action: 'Install occupancy sensors for automatic device control',
        savings: unoccupiedWastage * 30,
        difficulty: 'medium',
      });
    }
    
    return recommendations.sort((a, b) => b.savings - a.savings);
  }

  analyzeUsagePatterns(): Record<string, unknown> {
    return {
      dailyPattern: this.analyzeDailyPattern(),
      weeklyPattern: this.analyzeWeeklyPattern(),
      roomEfficiency: this.analyzeRoomEfficiency(),
      temperatureCorrelation: this.analyzeTemperatureImpact(),
      renewableUtilization: this.analyzeRenewableUsage(),
    };
  }

  private analyzeDailyPattern(): Record<string, number> {
    const pattern: Record<string, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    
    for (const reading of this.readings) {
      const hour = reading.timestamp.getHours();
      
      if (hour >= 6 && hour < 12) pattern.morning += reading.consumption;
      else if (hour >= 12 && hour < 17) pattern.afternoon += reading.consumption;
      else if (hour >= 17 && hour < 22) pattern.evening += reading.consumption;
      else pattern.night += reading.consumption;
    }
    
    return pattern;
  }

  private analyzeWeeklyPattern(): Record<string, number> {
    const pattern: Record<string, number> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.forEach(day => pattern[day] = 0);
    
    for (const reading of this.readings) {
      const day = days[reading.timestamp.getDay()];
      pattern[day] += reading.consumption;
    }
    
    return pattern;
  }

  private analyzeRoomEfficiency(): Record<string, number> {
    const roomConsumption: Record<string, { total: number; occupied: number }> = {};
    
    for (const reading of this.readings) {
      if (!roomConsumption[reading.room]) {
        roomConsumption[reading.room] = { total: 0, occupied: 0 };
      }
      
      roomConsumption[reading.room].total += reading.consumption;
      if (reading.occupancy > 0) {
        roomConsumption[reading.room].occupied += reading.consumption;
      }
    }
    
    const efficiency: Record<string, number> = {};
    
    for (const [room, data] of Object.entries(roomConsumption)) {
      efficiency[room] = data.total > 0 ? data.occupied / data.total : 0;
    }
    
    return efficiency;
  }

  private analyzeTemperatureImpact(): number {
    const temps = this.readings.map(r => r.temperature);
    const consumptions = this.readings.map(r => r.consumption);
    
    return this.calculateCorrelation(temps, consumptions);
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

  private analyzeRenewableUsage(): Record<string, number> {
    const sourceUsage: Record<string, number> = {
      grid: 0,
      solar: 0,
      battery: 0,
      generator: 0,
    };
    
    for (const reading of this.readings) {
      sourceUsage[reading.source] += reading.consumption;
    }
    
    const total = Object.values(sourceUsage).reduce((a, b) => a + b, 0);
    
    const percentages: Record<string, number> = {};
    for (const [source, usage] of Object.entries(sourceUsage)) {
      percentages[source] = total > 0 ? (usage / total) * 100 : 0;
    }
    
    return percentages;
  }

  generateReport(): void {
    this.calculateEnergyProfile();
    
    this.setContent({
      totalReadings: this.readings.length,
      profile: this.profile,
      deviceProfiles: Object.fromEntries(this.deviceProfiles),
      anomalies: this.anomalies.length,
      patterns: this.analyzeUsagePatterns(),
      recommendations: this.generateSavingsRecommendations(),
      predictions: {
        next30Days: this.predictFutureCost(30),
        next90Days: this.predictFutureCost(90),
        nextYear: this.predictFutureCost(365),
      },
      sustainabilityScore: this.calculateSustainabilityScore(),
    });
  }

  private calculateSustainabilityScore(): number {
    const renewablePercent = this.analyzeRenewableUsage();
    const renewableScore = (renewablePercent.solar + renewablePercent.battery) / 100;
    const efficiencyScore = this.profile.efficiencyScore;
    const carbonScore = 1 - (this.profile.carbonFootprint / (this.readings.length * 0.5));
    
    return (renewableScore * 0.4 + efficiencyScore * 0.4 + carbonScore * 0.2);
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}