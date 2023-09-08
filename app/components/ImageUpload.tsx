"use client";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {Button} from "@tremor/react";
import {ChangeEvent, useState} from "react";

export const ImageUpload = () => {

  const [file, setFile] = useState<File>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const imageUpload = () => {
    if (!file) {
      console.log("no file")

      return;
    }
    console.log("file")
    console.log(file)
    const fileName = file.name;
    // Create a root reference
    const storage = getStorage();

    // Create a reference to 'mountains.jpg'
    // const mountainsRef = ref(storage, "mountains.jpg");

    // Create a reference to the image
    const imageRef = ref(storage, `images/${fileName}`);

    // While the file names are the same, the references point to different files
    // mountainsRef.name === mountainImagesRef.name; // true
    // mountainsRef.fullPath === mountainImagesRef.fullPath; // false


    // 'file' comes from the Blob or File API
    uploadBytes(imageRef, file).then((snapshot) => {
      console.log("snapshot")
      console.log(snapshot)
      console.log("Uploaded a blob or file!");
    }).catch((error) => {
        // Handle unsuccessful uploads
        console.log(error)
    });
  }

  return (
    <div>
      <label className={"flex gap-x-3"}>
        <input type="file" onChange={handleFileChange}  />
        Select image
      </label>
      <Button onClick={imageUpload}>Upload</Button>
    </div>
  );
};
