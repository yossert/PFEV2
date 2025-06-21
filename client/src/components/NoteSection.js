import React, { useEffect, useState } from 'react';
import axios from '../axios';

const NoteSection = ({ projetId, currentUser }) => {
const [notes, setNotes] = useState([]);
const [newNote, setNewNote] = useState('');

const fetchNotes = async () => {
const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } };
const res = await axios.get(`/api/notes/byProject/${projetId}`, config);
setNotes(res.data);
   };

const handlePublish = async () => {
if (!newNote.trim()) return;
const token = localStorage.getItem('token');
const config = { headers: { Authorization: `Bearer ${token}` } };
const payload = {
projetId,
 contenu: newNote,
  auteur: currentUser, // par exemple : nom de l'utilisateur connecté
    automatique: false
   };
    await axios.post('/api/notes', payload, config);
    setNewNote('');
     fetchNotes();
   };

  useEffect(() => {
    fetchNotes();
  }, [projetId]);
   return (
    <div className="note-section">
       <h3>Notes de travail</h3>
       <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Écrire une note..."
      />
       <button onClick={handlePublish}>Publier</button>

      <h4>Activités :</h4>
       <div className="notes-list">
         {notes.map((note) => (
           <div key={note._id} className="note-item">
             <p><strong>{note.auteur}</strong> - {new Date(note.date).toLocaleString()}</p>
             <p>{note.contenu}</p>
           </div>
         ))}
       </div>
     </div>
   );
 };

 export default NoteSection;
