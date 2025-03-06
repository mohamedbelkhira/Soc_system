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
  const [attacks, setAttacks] = useState<CyberAttack[]>([]);
  const [globeRotation, setGlobeRotation] = useState(0);

  // Generate a random attack
  const generateRandomAttack = useCallback((): CyberAttack => {
    const attackTypes: CyberAttack['type'][] = ['Ransomware', 'DDoS', 'Phishing', 'Malware'];
    
    // Randomly select attacker and target locations
    const attackerIndex = Math.floor(Math.random() * GLOBAL_LOCATIONS.length);
    let targetIndex = Math.floor(Math.random() * GLOBAL_LOCATIONS.length);
    
    // Ensure attacker and target are different
    while (targetIndex === attackerIndex) {
      targetIndex = Math.floor(Math.random() * GLOBAL_LOCATIONS.length);
    }

    const attackerLocation = GLOBAL_LOCATIONS[attackerIndex];
    const targetLocation = GLOBAL_LOCATIONS[targetIndex];

    return {
      id: `attack-${Date.now()}`,
      attackerLocation,
      targetLocation,
      type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      intensity: Math.random(), // Random intensity between 0 and 1
      timestamp: new Date().toISOString()
    };
  }, []);

  // Color mapping for attack types
  const getAttackColor = (type: string) => {
    switch(type) {
      case 'Ransomware': return '#FF0000';  // Red
      case 'DDoS': return '#FFFF00';        // Yellow
      case 'Phishing': return '#00FF00';    // Green
      case 'Malware': return '#FF6347';     // Tomato Red
      default: return '#FFFFFF';            // White
    }
  };

  // Simulate continuous attacks and globe rotation
  useEffect(() => {
    // Initial attacks
    const initialAttacks = Array.from({ length: 3 }, () => generateRandomAttack());
    setAttacks(initialAttacks);

    // Periodic attack generation
    const attackInterval = setInterval(() => {
      setAttacks(prevAttacks => {
        // Keep only the last 10 attacks to prevent memory buildup
        const updatedAttacks = [...prevAttacks, generateRandomAttack()].slice(-10);
        return updatedAttacks;
      });
    }, 5000); // Generate a new attack every 5 seconds

    // Continuous and smoother globe rotation
    const rotationInterval = requestAnimationFrame(function animate() {
      setGlobeRotation(prev => {
        // Adjust rotation speed and direction as needed
        const newRotation = (prev + 0.5) % 360;
        requestAnimationFrame(animate);
        return newRotation;
      });
    });

    // Cleanup intervals and animation frame
    return () => {
      clearInterval(attackInterval);
      cancelAnimationFrame(rotationInterval);
    };
  }, [generateRandomAttack]);

  // Transform attacks to arc data
  const arcsData = attacks.map(attack => ({
    startLat: attack.attackerLocation.lat,
    startLng: attack.attackerLocation.lng,
    endLat: attack.targetLocation.lat,
    endLng: attack.targetLocation.lng,
    color: getAttackColor(attack.type),
    attackData: attack
  }));

  return (
    <div className="relative w-full h-screen">
      <Globe
        // Globe Appearance
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Rotation Control
        width={window.innerWidth}
        height={window.innerHeight}
        globeRotation={{ lng: globeRotation }}
        
        // Arc Layer Configuration
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.9}
        arcDashGap={0.1}
        arcDashAnimateTime={1000}
        arcAltitude={(d) => d.attackData.intensity}
        
        // Interaction Handlers
        onArcClick={(arc, event) => {
          const attackData = arc.attackData as CyberAttack;
          alert(`
            Attack Type: ${attackData.type}
            From: ${attackData.attackerLocation.country}
            To: ${attackData.targetLocation.country}
            Intensity: ${(attackData.intensity * 100).toFixed(0)}%
            Time: ${new Date(attackData.timestamp).toLocaleString()}
          `);
        }}
        
        // Additional Globe Settings
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.15}
      />

      {/* Overlay with Attack Summary */}
      <div className="absolute top-4 right-4 bg-black/60 text-white p-4 rounded-lg shadow-xl max-h-[500px] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 border-b border-blue-500 pb-2">
          Real-Time Cyber Attacks
        </h2>
        {attacks.slice().reverse().map(attack => (
          <div key={attack.id} className="mb-3 p-2 bg-blue-900/50 rounded">
            <div className="flex justify-between">
              <span className="font-semibold">
                {attack.attackerLocation.country} → {attack.targetLocation.country}
              </span>
              <span className={`
                px-2 py-1 rounded text-xs 
                ${attack.type === 'Ransomware' ? 'bg-red-600' : 
                  attack.type === 'DDoS' ? 'bg-yellow-600' : 
                  attack.type === 'Phishing' ? 'bg-green-600' : 
                  'bg-tomato-600'}
              `}>
                {attack.type}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Intensity: {(attack.intensity * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-400">
              {new Date(attack.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberAttackGlobe;