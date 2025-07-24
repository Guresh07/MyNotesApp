import { promises as fs } from 'fs';
// import { jsxs } from 'react/jsx-runtime';

const filePath = './data/notes.json';

export const readNotes = async () => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export const writeNotes = async (notes) => {
    await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
}