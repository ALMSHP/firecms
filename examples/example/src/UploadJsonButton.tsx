import React from "react";
import { FirebaseApp } from "firebase/app"; // Import the FirebaseApp type
import { getFirestore, collection, doc, writeBatch } from "firebase/firestore";

const UploadJsonButton: React.FC<{ firebaseApp: FirebaseApp }> = ({ firebaseApp }) => {
    const db = getFirestore(firebaseApp);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const result = reader.result as string;
                    const jsonData = JSON.parse(result);
                    console.log("Parsed JSON data:", jsonData);

                    if (!Array.isArray(jsonData)) {
                        alert("Invalid JSON format. Expected an array of objects.");
                        return;
                    }

                    await uploadToFirestore(jsonData);
                } catch (error) {
                    console.error("Error processing file:", error);
                    alert("Failed to process the file. Check the console for details.");
                }
            };
            reader.readAsText(file);
        }
    };

    const uploadToFirestore = async (jsonData: any[]) => {
        try {
            const batchSize = 500;
            const collectionRef = collection(db, "questions");

            for (let i = 0; i < jsonData.length; i += batchSize) {
                const batch = writeBatch(db);
                const chunk = jsonData.slice(i, i + batchSize);

                chunk.forEach((docData) => {
                    if (typeof docData !== "object" || docData === null) {
                        console.warn("Skipping invalid document:", docData);
                        return;
                    }
                    const docRef = doc(collectionRef); // Correct way to create a unique document reference
                    batch.set(docRef, docData);
                });

                await batch.commit();
                console.log(`Batch ${i / batchSize + 1} committed successfully.`);
            }

            alert("All documents uploaded successfully!");
        } catch (error) {
            console.error("Error uploading documents to Firestore:", error);
            alert("Failed to upload documents. Check the console for details.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <label
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#6200ea",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "inline-block",
                }}
            >
                Upload JSON
                <input type="file" accept=".json" hidden onChange={handleFileUpload} />
            </label>
        </div>
    );
};

export default UploadJsonButton;
