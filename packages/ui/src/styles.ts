export const colors = {
  prime: '#555',
  secondary: '#999',
  highlight: '#9cedff',
  button: (active: boolean) => (active ? '#333' : '#999'),
  background: '#EEE',
  notes: '#5596a5',
  notesSelected: '#03A9F4',
  notesBackground: '#33c8d3',
  black: '#1A1A1A',
  critical: 'red'
} as const;
