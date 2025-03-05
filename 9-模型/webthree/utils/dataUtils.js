export function processData(rawData) {
    // Split the raw data into an array of numbers
    const data = rawData.trim().split(/\s+/).map(Number);
  
    // Number of groups
    const numGroups = data[0];
    const result = [];
  
    let index = 1; // Start after the first element (number of groups)
  
    for (let i = 0; i < numGroups; i++) {
      // Extract the number of points and triangles
      const numPoints = data[index++];
      const numTriangles = data[index++];
  
      // Extract the points data
      const vertices = [];
      for (let j = 0; j < numPoints; j++) {
        const x = data[index++];
        const y = data[index++];
        const z = data[index++];
        vertices.push( x, y, z );
      }
  
      // Extract the triangles data
      const indices = [];
      for (let j = 0; j < numTriangles; j++) {
        const flag = data[index++]; // Read the flag (e.g., -1)
        const a = data[index++];
        const b = data[index++];
        const c = data[index++];
    
        if (flag === -1) {
          // Only add the triangle if the flag is -1
          indices.push( a, b, c );
        }
      }
  
      // Store the processed group
      result.push({ vertices, indices });
    }
  
    return result;
  }
  