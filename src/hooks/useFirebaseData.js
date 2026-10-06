import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';

export default function useFirebaseData(path = 'sensors') {
  // Default state jab tak Firebase se data nahi aata
  const [data, setData] = useState({
    temperature: '--',
    humidity: '--',
    ldr: '--',
    posture: 'Waiting...'
  });

  useEffect(() => {
    // Firebase database mein 'sensors' path ka reference
    const dataRef = ref(database, path);

    // onValue ek listener hai jo real-time changes pakadta hai
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val()); // ESP32 jo data bhejega wo yahan set ho jayega
      } else {
        console.log("No data available at this path yet");
      }
    });

    // Cleanup function (Best practice: jab component hatega toh listener band ho jayega)
    return () => unsubscribe();
  }, [path]);

  return data; // Yeh hook live data return karega
}