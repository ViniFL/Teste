import React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";


export const App = () => {
  const firebaseApp = initializeApp ({
    apiKey: "AIzaSyCBP7RwzX8Y8asMa2JXD5R7ccoFH85lvBQ",
    authDomain: "teste-taugor-8d532.firebaseapp.com",
    projectId: "teste-taugor-8d532",
  });

  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [gender, setGender] = useState("");
  const [born, setBorn] = useState("");
  const [users, setUsers] = useState([]);

  
  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  const [imgURL, setImgURL] = useState("");
  const [progressPorcent, setPorgessPorcent] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target[0]?.files[0];
    if (!file) return;

    const storageRef = ref(getStorage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPorgessPorcent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgURL(downloadURL);
        });
      }
    );
  };

  useEffect(() =>{
    const getUsers = async () => {
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  
  return (
    <div>
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input type="file" />
          <button>Enviar</button>
        </form>
        {!imgURL && <p>{progressPorcent}%</p>}
        {imgURL && <img src={imgURL} alt="Imagem" height={200} />}
      </header>
      <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)}/>
      <input type="text" placeholder="Endereço" value={adress} onChange={(e) => setAdress(e.target.value)}/>
      <input type="text" placeholder="Telefone" value={telephone} onChange={(e) => setTelephone(e.target.value)}/>
      <input type="text" placeholder="Genero" value={gender} onChange={(e) => setGender(e.target.value)}/>
      <input type="text" placeholder="Data de nascimento" value={born} onChange={(e) => setBorn(e.target.value)}/>
      <button> Criar Usuário </button>
      <ul>
        {users.map((users) => {
          return (
            <div key={users.id}>
              <li>{users.name}</li>
              <li>{users.adress}</li>
              <li>{users.telephone}</li>
              <li>{users.gender}</li>
              <li>{users.born}</li>
            </div>  
          )
        })}
      </ul>
    </div>
  );
}

export default App;
