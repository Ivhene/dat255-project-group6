import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { loadModel, loadImage, preprocesImage } from "@/utils/imageProcessing";
import * as tf from "@tensorflow/tfjs";

// Define the output labels (conditions) exactly as in your Python notebook
const CONDITIONS = [
  "No Finding",
  "Enlarged Cardiomediastinum",
  "Cardiomegaly",
  "Lung Opacity",
  "Lung Lesion",
  "Edema",
  "Consolidation",
  "Pneumonia",
  "Atelectasis",
  "Pneumothorax",
  "Pleural Effusion",
  "Pleural Other",
  "Fracture",
  "Support Devices",
];

// --- Define your classification threshold ---
const CLASSIFICATION_THRESHOLD = 0.5; // Common starting point, adjust as needed

export default function Home() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsLoadingModel(true);
    console.log("Attempting to load model...");
    loadModel()
      .then((loadedModel) => {
        setModel(loadedModel);
        console.log("Model loaded successfully in component.");
        setIsLoadingModel(false);
      })
      .catch((error) => {
        console.error("Error loading the model in component:", error);
        alert("Failed to load the prediction model. Please try refreshing.");
        setIsLoadingModel(false);
      });
  }, []);

  const handleAnalyzeClick = async () => {
    console.log("Analyze button clicked");
    if (!model) {
      alert("Model is not loaded yet. Please wait.");
      console.log("Analysis attempt failed: Model not loaded.");
      return;
    }
    if (isAnalyzing) {
      console.log("Analysis already in progress.");
      return;
    }

    const fileInput = document.getElementById("image-upload");
    const imageFile = fileInput?.files?.[0];

    if (!imageFile) {
      alert("Please upload an image file.");
      return;
    }

    setIsAnalyzing(true);
    setPredictions([]);

    try {
      console.log("Loading image...");
      const image = await loadImage(imageFile);
      console.log("Image loaded, preprocessing...");

      const processedTensor = preprocesImage(image);
      console.log("Preprocessing complete, predicting...");

      const outputTensor = model.predict(processedTensor);
      console.log("Prediction complete, processing results...");

      const probabilities = outputTensor.dataSync();

      processedTensor.dispose();
      outputTensor.dispose();

      // --- Apply Thresholding Here ---
      const formattedPredictions = CONDITIONS.map((conditionName, index) => {
        const probability = probabilities[index];
        const classification = probability > CLASSIFICATION_THRESHOLD ? 1 : 0; // Apply threshold
        return {
          className: conditionName,
          probability: probability,
          classification: classification, // Add the 0/1 classification
        };
      });
      // --- End Thresholding ---

      console.log(
        "Formatted Predictions (with classification):",
        formattedPredictions
      );
      setPredictions(formattedPredictions);
    } catch (error) {
      console.error("Error analyzing the image:", error);
      alert(`An error occurred during analysis: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>CheXpert Disease Detection</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Chest X-Ray Disease Detection</h1>
          <p className={styles.description}>
            Upload a chest X-ray image to get predictions for common conditions
            using a ResNet50-based model.
          </p>
          <div id="input-area">
            <input
              type="file"
              className={styles.input}
              id="image-upload"
              accept="image/*"
            />
            <button
              className={styles.button}
              onClick={handleAnalyzeClick}
              disabled={isLoadingModel || isAnalyzing || !model}
            >
              {isLoadingModel
                ? "Loading Model..."
                : isAnalyzing
                ? "Analyzing..."
                : "Analyze Image"}
            </button>
            {!isLoadingModel && !model && (
              <p style={{ color: "red" }}>Model failed to load.</p>
            )}
          </div>
          <div id="output-area">
            {predictions.length > 0 && (
              <>
                <h2>
                  Predictions (Threshold: {CLASSIFICATION_THRESHOLD * 100}%):
                </h2>
                <ul className={styles.predictionList}>
                  {predictions
                    .sort((a, b) => b.probability - a.probability)
                    .map((pred, index) => (
                      <li key={index} className={styles.predictionItem}>
                        <span className={styles.className}>
                          {pred.className}
                        </span>
                        :{/* Display Classification (e.g., Present/Absent) */}
                        <span
                          className={styles.classification}
                          style={{
                            fontWeight: "bold",
                            marginLeft: "10px",
                            color: pred.classification === 1 ? "red" : "green",
                          }}
                        >
                          {pred.classification === 1 ? "Present" : "Absent"}
                        </span>
                        {/* Display Probability */}
                        <span
                          className={styles.probability}
                          style={{ marginLeft: "10px" }}
                        >
                          ({(pred.probability * 100).toFixed(1)}%)
                        </span>
                        {/* Optional: Add a simple bar visual */}
                        <div className={styles.probabilityBarContainer}>
                          <div
                            className={styles.probabilityBar}
                            style={{
                              width: `${(pred.probability * 100).toFixed(0)}%`,
                            }}
                          ></div>
                        </div>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
