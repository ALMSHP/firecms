import { buildCollection, buildProperty } from "@firecms/core";

export const ofekQuestionsCollection = buildCollection({
    id: "ofek_questions",
    name: "Ofek Questions",
    description: "Collection of questions with associated images, voice recordings, and categories",
    path: "questions",
    properties: {
        category: buildProperty({
            dataType: "string",
            name: "Category",
            enumValues: {
                general: "General",
                science: "Science",
                history: "History",
                literature: "Literature",
                // Add more categories as needed
            },
            validation: { required: false },
            description: "Select the category that best fits the question"
        }),
        question: buildProperty({
            dataType: "string",
            name: "Question",
            validation: { required: true },
            description: "The text of the question"
        }),
        answer: buildProperty({
            dataType: "string",
            name: "Answer",
            validation: { required: false },
            description: "The text of the answer",
            multiline: true
        }),
        image: buildProperty({
            dataType: "string",
            name: "Image",
            storage: {
                storagePath: "ofek_questions/images",
                acceptedFiles: ["image/*"],
                maxSize: 2 * 1024 * 1024, // 2 MB
                metadata: { cacheControl: "max-age=31536000" } // Cache for 1 year
            },
            description: "Upload an image related to the question"
        }),
        audioQuetsion: buildProperty({
            dataType: "string",
            name: "audioQuestion",
            storage: {
                storagePath: "ofek_questions/audioQuestion",
                acceptedFiles: ["audio/*"],
                maxSize: 5 * 1024 * 1024, // 5 MB
                metadata: { cacheControl: "max-age=31536000" } // Cache for 1 year
            },
            description: "Upload a voice recording related to the question"
        }),
        audioAnswer: buildProperty({
            dataType: "string",
            name: "Voice Recording",
            storage: {
                storagePath: "ofek_questions/audioAnswer",
                acceptedFiles: ["audio/*"],
                maxSize: 5 * 1024 * 1024, // 5 MB
                metadata: { cacheControl: "max-age=31536000" } // Cache for 1 year
            },
            description: "Upload a voice recording related to the question"
        })
    }
});
