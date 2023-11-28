import { randomBytes } from 'crypto';

const words = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Iceberg', 'Jackfruit'
];

function generateRoomCode(): string {
  const indices = Array.from(randomBytes(4)).map(byte => byte % words.length);
  return indices.map(index => words[index]).join('');
}

const newRoomCode = generateRoomCode();

export default newRoomCode