import { useState, useEffect } from 'react'
import './App.css'

let backdata = [
    {
      "_id": "6ac64959107deb63562fb2cd",
      "name": "John Dou",
      "age": 24,
      "__v": 0
    },
    {
      "_id": "6ac74852d16ac30daef67d57",
      "name": "Jane Dou",
      "age": 22,
      "__v": 0
    },
    {
      "_id": "6ac755a4a771973a3ea397bb",
      "name": "Jane Dou",
      "age": 22,
      "__v": 0
    }
];
  
function App() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    fetch('/api/contacts')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setContacts(data.data || data);
        }
      })
      .catch(error => console.error("Error:", error));
  }, []);
  return (
    <div>
      <h1>Contacts</h1>
      {contacts.length > 0 ? (
        contacts.map((item, index) => (
          <div key={item._id || index}>
            <p>{item.name} - {item.age}</p>
          </div>
        ))
      ) : (
        <p>No contact</p>
      )}
    </div>
  )
}

export default App