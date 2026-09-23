/**
 * RunFam GPS Geolocation Tracking Engine
 * Supports real HTML5 geolocation, noise filtering, pace calculations,
 * active run resilience, and simulated Chhatrapati Sambhajinagar route testing.
 */

import { GPSPoint } from '../types';
import { haversineDistance } from './db';

export type GPSAccuracyStatus = 'searching' | 'ready' | 'good' | 'weak' | 'denied' | 'unavailable';

export interface RunTrackerState {
  isActive: boolean;
  isPaused: boolean;
  status: GPSAccuracyStatus;
  accuracyMeters: number | null;
  distanceKm: number;
  durationSeconds: number;
  currentPaceSecPerKm: number; // e.g. 330 = 5:30/km
  avgPaceSecPerKm: number;
  currentSpeedKmh: number;
  elevationGainMeters: number;
  points: GPSPoint[];
  lastPoint: GPSPoint | null;
  startTime: number | null;
  isSimulated: boolean;
}

// Realistic Sambhajinagar waypoints for the demo test runner
// Jalna Road to Prozone Mall circuit
const CSN_SIMULATION_WAYPOINTS = [
  { lat: 19.8762, lng: 75.3433, alt: 580 }, // Kranti Chowk start
  { lat: 19.8778, lng: 75.3475, alt: 582 }, // Jalna Road stretch
  { lat: 19.8795, lng: 75.3520, alt: 585 }, // Near Akashwani
  { lat: 19.8820, lng: 75.3585, alt: 588 }, // Cannaught intersection
  { lat: 19.8835, lng: 75.3640, alt: 591 }, // Prozone Mall approaches
  { lat: 19.8860, lng: 75.3700, alt: 593 }, // Prozone Mall entrance
  { lat: 19.8880, lng: 75.3760, alt: 595 }, // MIDC Chikalthana gate
  { lat: 19.8850, lng: 75.3740, alt: 593 }, // Loop return
  { lat: 19.8810, lng: 75.3620, alt: 589 }, // Cidco boulevard
  { lat: 19.8780, lng: 75.3480, alt: 583 }, // Cannaught Garden return
  { lat: 19.8765, lng: 75.3438, alt: 581 }, // Finish loop
];

export class GPSTrackingEngine {
  private state: RunTrackerState;
  private watchId: number | null = null;
  private timerInterval: any = null;
  private simInterval: any = null;
  private simStep = 0;
  private listeners: Set<(state: RunTrackerState) => void> = new Set();

  constructor() {
    this.state = this.getInitialState();
    this.restoreActiveRun();
  }

  private getInitialState(): RunTrackerState {
    return {
      isActive: false,
      isPaused: false,
      status: 'searching',
      accuracyMeters: null,
      distanceKm: 0,
      durationSeconds: 0,
      currentPaceSecPerKm: 0,
      avgPaceSecPerKm: 0,
      currentSpeedKmh: 0,
      elevationGainMeters: 0,
      points: [],
      lastPoint: null,
      startTime: null,
      isSimulated: false,
    };
  }

  public subscribe(listener: (state: RunTrackerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
    this.persistActiveRun();
  }

  private persistActiveRun() {
    if (this.state.isActive && this.state.points.length > 0) {
      try {
        localStorage.setItem('runfam_active_run_backup', JSON.stringify(this.state));
      } catch (e) {
        console.warn('Run backup failed:', e);
      }
    } else if (!this.state.isActive) {
      localStorage.removeItem('runfam_active_run_backup');
    }
  }

  private restoreActiveRun() {
    try {
      const backup = localStorage.getItem('runfam_active_run_backup');
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed.isActive) {
          this.state = {
            ...parsed,
            isPaused: true, // Pause on restore so runner can choose to resume
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  // Request GPS status & permissions
  public checkGPSAvailability(): Promise<GPSAccuracyStatus> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        this.state.status = 'unavailable';
        this.notify();
        return resolve('unavailable');
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const acc = pos.coords.accuracy;
          this.state.accuracyMeters = Math.round(acc);
          this.state.status = acc <= 15 ? 'ready' : acc <= 30 ? 'good' : 'weak';
          this.notify();
          resolve(this.state.status);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            this.state.status = 'denied';
          } else {
            this.state.status = 'unavailable';
          }
          this.notify();
          resolve(this.state.status);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    });
  }

  // Start Real GPS Run
  public startRun(options?: { simulated?: boolean }) {
    this.stopIntervals();

    this.state = {
      ...this.getInitialState(),
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      isSimulated: !!options?.simulated,
      status: options?.simulated ? 'good' : 'searching',
    };

    // Duration timer (every second)
    this.timerInterval = setInterval(() => {
      if (this.state.isActive && !this.state.isPaused) {
        this.state.durationSeconds += 1;
        // Recalculate average pace
        if (this.state.distanceKm > 0.05) {
          this.state.avgPaceSecPerKm = Math.round(this.state.durationSeconds / this.state.distanceKm);
        }
        this.notify();
      }
    }, 1000);

    if (options?.simulated) {
      this.startSimulatedGPS();
    } else {
      this.startRealGPS();
    }

    this.notify();
  }

  private startRealGPS() {
    if (!('geolocation' in navigator)) {
      this.state.status = 'unavailable';
      this.notify();
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!this.state.isActive || this.state.isPaused) return;

        const { latitude, longitude, altitude, accuracy, speed } = pos.coords;
        this.state.accuracyMeters = Math.round(accuracy);
        this.state.status = accuracy <= 15 ? 'good' : accuracy <= 35 ? 'ready' : 'weak';

        // Discard low-accuracy jitter (> 40 meters)
        if (accuracy > 40 && this.state.points.length > 2) {
          return;
        }

        const point: GPSPoint = {
          latitude,
          longitude,
          altitude: altitude || 580,
          accuracy,
          speed: speed || 0,
          timestamp: pos.timestamp || Date.now(),
        };

        this.processNewPoint(point);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        if (err.code === err.PERMISSION_DENIED) {
          this.state.status = 'denied';
        } else {
          this.state.status = 'weak';
        }
        this.notify();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );
  }

  // Simulated GPS Runner for test environments & review
  private startSimulatedGPS() {
    this.simStep = 0;
    // Emit initial point at Kranti Chowk
    const startPt = CSN_SIMULATION_WAYPOINTS[0];
    this.processNewPoint({
      latitude: startPt.lat,
      longitude: startPt.lng,
      altitude: startPt.alt,
      accuracy: 6,
      speed: 3.0,
      timestamp: Date.now(),
    });

    // Run simulation tick every 2.5 seconds
    this.simInterval = setInterval(() => {
      if (!this.state.isActive || this.state.isPaused) return;

      this.simStep += 1;
      const totalWaypoints = CSN_SIMULATION_WAYPOINTS.length;
      const wpIndex = this.simStep % (totalWaypoints - 1);
      const nextIndex = wpIndex + 1;

      const pA = CSN_SIMULATION_WAYPOINTS[wpIndex];
      const pB = CSN_SIMULATION_WAYPOINTS[nextIndex];

      // Interpolate with small natural GPS jitter (0.0001 deg approx ~10m)
      const fraction = ((this.simStep * 0.2) % 1);
      const lat = pA.lat + (pB.lat - pA.lat) * fraction + (Math.random() - 0.5) * 0.00008;
      const lng = pA.lng + (pB.lng - pA.lng) * fraction + (Math.random() - 0.5) * 0.00008;
      const alt = pA.alt + (pB.alt - pA.alt) * fraction;

      const speedMs = 2.9 + (Math.random() * 0.4); // ~10.8 km/h runner pace (5:33/km)

      this.processNewPoint({
        latitude: lat,
        longitude: lng,
        altitude: alt,
        accuracy: 5,
        speed: speedMs,
        timestamp: Date.now(),
      });
    }, 2500);
  }

  private processNewPoint(newPoint: GPSPoint) {
    if (this.state.lastPoint) {
      const deltaKm = haversineDistance(
        this.state.lastPoint.latitude,
        this.state.lastPoint.longitude,
        newPoint.latitude,
        newPoint.longitude
      );

      // Noise gate: ignore movements < 2 meters
      if (deltaKm > 0.002) {
        // Speed check: filter jumps faster than 40 km/h
        const timeDiffHours = (newPoint.timestamp - this.state.lastPoint.timestamp) / 3600000;
        const segmentSpeedKmh = timeDiffHours > 0 ? deltaKm / timeDiffHours : 0;

        if (segmentSpeedKmh <= 35) {
          this.state.distanceKm = Number((this.state.distanceKm + deltaKm).toFixed(3));

          // Elevation gain
          if (newPoint.altitude && this.state.lastPoint.altitude) {
            const elevDiff = newPoint.altitude - this.state.lastPoint.altitude;
            if (elevDiff > 0.5) {
              this.state.elevationGainMeters += Math.round(elevDiff);
            }
          }

          // Current Pace & Speed
          if (newPoint.speed && newPoint.speed > 0.5) {
            this.state.currentSpeedKmh = Number((newPoint.speed * 3.6).toFixed(1));
            this.state.currentPaceSecPerKm = Math.round(1000 / newPoint.speed);
          } else if (timeDiffHours > 0) {
            this.state.currentSpeedKmh = Number(segmentSpeedKmh.toFixed(1));
            this.state.currentPaceSecPerKm = Math.round(3600 / segmentSpeedKmh);
          }
        }
      }
    }

    this.state.lastPoint = newPoint;
    this.state.points.push(newPoint);
    this.notify();
  }

  public pauseRun() {
    if (this.state.isActive) {
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resumeRun() {
    if (this.state.isActive && this.state.isPaused) {
      this.state.isPaused = false;
      this.notify();
    }
  }

  public finishRun(): RunTrackerState {
    this.stopIntervals();
    const finalState = { ...this.state };
    this.state = this.getInitialState();
    this.notify();
    localStorage.removeItem('runfam_active_run_backup');
    return finalState;
  }

  public discardRun() {
    this.stopIntervals();
    this.state = this.getInitialState();
    this.notify();
    localStorage.removeItem('runfam_active_run_backup');
  }

  private stopIntervals() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = null;
    }
  }

  public getState(): RunTrackerState {
    return { ...this.state };
  }
}

export const gpsEngine = new GPSTrackingEngine();

// Format helpers
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatPace(paceSecPerKm: number): string {
  if (!paceSecPerKm || paceSecPerKm <= 0 || paceSecPerKm > 1200) {
    return '--:--';
  }
  const mins = Math.floor(paceSecPerKm / 60);
  const secs = Math.round(paceSecPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
