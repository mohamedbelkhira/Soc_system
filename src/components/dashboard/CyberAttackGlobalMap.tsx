import React, { useState, useEffect, useCallback } from 'react';
import Globe from 'react-globe.gl';

// Interface for Cyber Attack Data
interface CyberAttack {
  id: string;
  attackerLocation: {
    lat: number;
    lng: number;
    country: string;
  };
  targetLocation: {
    lat: number;
    lng: number;
    country: string;
  };
  type: 'Ransomware' | 'DDoS' | 'Phishing' | 'Malware';
  intensity: number;
  timestamp: string;
}

// Predefined locations for global cyber attack simulation
const GLOBAL_LOCATIONS = [
  { lat: 37.7749, lng: -122.4194, country: 'United States' },    // San Francisco
  { lat: 35.6762, lng: 139.6503, country: 'Japan' },             // Tokyo
  { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },     // London
  { lat: 40.4168, lng: -3.7038, country: 'Spain' },              // Madrid
  { lat: -22.9068, lng: -43.1729, country: 'Brazil' },           // Rio de Janeiro
  { lat: 55.7558, lng: 37.6173, country: 'Russia' },             // Moscow
  { lat: 31.2304, lng: 121.4737, country: 'China' },             // Shanghai
  { lat: 28.6139, lng: 77.2090, country: 'India' },              // New Delhi
  { lat: -33.8688, lng: 151.2093, country: 'Australia' },        // Sydney
  { lat: 40.7128, lng: -74.0060, country: 'United States' }      // New York
];

const CyberAttackGlobe: React.FC = () => {
  
  return (
    <div className="relative w-full h-screen">
      hello world
      </div>
  );
};

export default CyberAttackGlobe;