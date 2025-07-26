export async function handleSubmit(lon, lat, yearsAhead) {
    try {
      const response = await fetch("http://localhost:5000/api/calculations/severity", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({            
            "location": {
                "latitude": lon, 
                "longitude": lat
            },
            "years_ahead": yearsAhead  
        }),
      });

      if (!response.ok) throw new Error('Failed to calcualate severity');
      
      const severity = await response.json();
      return severity;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};