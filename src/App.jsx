import React from "react";
import "./App.css";
import { db, storage } from "./config/firebase";
import { Container } from "react-bootstrap";

export default function App() {
  const [progress, setProgress] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [deletingImage, setDeletingImage] = React.useState(null);

  const onDelete = async (imageId) => {
    setDeletingImage(imageId);
    try {
      await db.collection("images").doc(imageId).delete();
    } catch (err) {
      console.error("Error deleting image:", err.message);
    } finally {
      setDeletingImage(null);
    }
  };

  const deleteAll = async (_) => {
    try {
      await db
        .collection("images")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            doc.ref.delete();
          });
        });
    } catch (err) {
      console.error("Error deleting images:", err.message);
    }
  };

  React.useEffect(() => {
    const unsubscribe = db
      .collection("images")
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        let dbSnap = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setImages(dbSnap);
      });
    return unsubscribe;
  }, []);

  const uploadImg = (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref(file.name);
    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        console.log(err);
      },
      async () => {
        const url = await storageRef.getDownloadURL().then((url) => {
          db.collection("images").add({
            url,
            createdAt: Date.now(),
          });
          setProgress(0);
        });
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Storage</h1>
        <div className="inputs">
          <input
            type="file"
            id="upload"
            className="d-none"
            onChange={uploadImg}
          />
          <label htmlFor="upload">upload file</label>
        </div>
        {progress > 0 ? <progress value={progress} max="100" /> : null}

        <Container className="text-start my-3">
          {images.length > 0 ? (
            <button className="w-100 p-2 delete-all" onClick={deleteAll}>
              Delete All
            </button>
          ) : null}
          <div className="box-images ">
            {images &&
              images.map((img, index) => {
                return (
                  <div className="img-item" key={index}>
                    <img src={img.url} alt="" />
                    <button
                      onClick={(_) => onDelete(img.id)}
                      disabled={deletingImage === img.id}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
          </div>
        </Container>
      </header>
    </div>
  );
}
