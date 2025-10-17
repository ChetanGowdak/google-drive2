// src/components/common/firebaseApi.js
import { db } from "../../firebase";
import { storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

let trashRef = collection(db, "trash");

// ===== Create / Move to Trash (already used in Data.jsx) =====
export const postTrashCollection = async (object) => {
  try {
    // Keep a timestamp for "Deleted on"
    await addDoc(trashRef, {
      ...object,
      deletedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
  }
};

// ===== LISTEN: Files in Trash for a user =====
const getTrashFiles = (userId, setFiles) => {
  const filesData = collection(db, "trash");
  const unsubscribeFiles = onSnapshot(
    query(filesData, where("userId", "==", userId)),
    (snapshot) => {
      setFiles(() => {
        const fileArr = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            data: docSnap.data(),
          }))
          .sort(
            (a, b) => b.data.timestamp?.seconds - a.data.timestamp?.seconds
          );
        return fileArr;
      });
    }
  );

  return unsubscribeFiles;
};

// ===== LISTEN: Files in My Drive for a user =====
const getFilesForUser = (userId, setFiles) => {
  const filesData = collection(db, "myfiles");
  const unsubscribeFiles = onSnapshot(
    query(filesData, where("userId", "==", userId)),
    (snapshot) => {
      setFiles(() => {
        const fileArr = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            data: docSnap.data(),
          }))
          .sort(
            (a, b) => b.data.timestamp?.seconds - a.data.timestamp?.seconds
          );
        return fileArr;
      });
    }
  );

  return unsubscribeFiles;
};

// ===== STAR / UNSTAR =====
const handleStarred = async (id) => {
  try {
    const docRef = doc(db, "myfiles", id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const currentStarredStatus = docSnapshot.data().starred || false;
      if (currentStarredStatus) {
        toast.error("Removed from starred");
      } else {
        toast.success("Added to starred");
      }
      await updateDoc(docRef, { starred: !currentStarredStatus });
    } else {
      console.error("Document does not exist.");
    }
  } catch (error) {
    console.error("Error updating starred status: ", error);
  }
};

// ===== RESTORE from Trash → My Drive =====
const restoreFile = async (trashId) => {
  try {
    const trashDocRef = doc(db, "trash", trashId);
    const trashSnap = await getDoc(trashDocRef);
    if (!trashSnap.exists()) {
      toast.error("File not found in Trash");
      return;
    }
    const data = trashSnap.data();

    // Re-create in myfiles with original fields
    await addDoc(collection(db, "myfiles"), {
      ...data,
      deletedAt: null,
      // keep original timestamp/crypto/path etc.
    });

    // Remove from trash
    await deleteDoc(trashDocRef);
    toast.success("File restored");
  } catch (err) {
    console.error(err);
    toast.error("Failed to restore");
  }
};

// ===== DELETE FOREVER: remove from Firestore + Storage =====
const deleteForever = async (trashId, data) => {
  try {
    const confirmed = window.confirm(
      "This will permanently delete the file. Continue?"
    );
    if (!confirmed) return;

    // 1) delete Firestore trash doc
    await deleteDoc(doc(db, "trash", trashId));

    // 2) delete storage object if path present
    if (data?.path) {
      const fileRef = ref(storage, data.path);
      await deleteObject(fileRef);
    }
    toast.error("Permanently deleted");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete");
  }
};

export {
  getFilesForUser,
  handleStarred,
  getTrashFiles,
  restoreFile,
  deleteForever,
};
