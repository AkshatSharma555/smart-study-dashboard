import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';

export default function useFirebaseData(path = 'sensors') {
  const [data, setData] = useState({
    temperature: '--',
    humidity: '--',
    ldr: '--',
    posture: 'Waiting...'
  });
  const [lastUpdated, setLastUpdated] = useState(null); // Naya state time track karne ke liye

  useEffect(() => {
    const dataRef = ref(database, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setLastUpdated(new Date()); // Jaise hi data aaye, time update kar do
      }
    });

    return () => unsubscribe();
  }, [path]);

  // Ab hum data aur time dono return kar rahe hain
  return { data, lastUpdated }; 
}