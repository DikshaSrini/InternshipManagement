import mockData from '../mockData.json';
 
export function fetchInterns() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });
}