import * as tf from "@tensorflow/tfjs";

// **IMPORTANT**: Values determined from project1.ipynb
const MODEL_INPUT_WIDTH = 224; // From IMG_SIZE = (224, 224) in cell [6] & [7]
const MODEL_INPUT_HEIGHT = 224; // From IMG_SIZE = (224, 224) in cell [6] & [7]
const MODEL_EXPECTS_NORMALIZATION_0_TO_1 = true; // From rescale=1./255 in cell [6]

export async function loadModel() {
  try {
    const modelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tfjs_model_output/model.json`; // Node.js environment

    console.log(`Loading model from: ${modelUrl}`);
    const model = await tf.loadLayersModel(modelUrl);
    console.log("Custom CheXpert model loaded successfully");

    // Optional: Warm up the model
    tf.tidy(() => {
      const dummyInput = tf.zeros([
        1,
        MODEL_INPUT_HEIGHT,
        MODEL_INPUT_WIDTH,
        3,
      ]);
      model.predict(dummyInput);
    });
    console.log("Model warmed up");
    return model;
  } catch (error) {
    console.error("Error loading the custom model:", error);
    throw error;
  }
}

export function preprocesImage(image) {
  // Preprocess the image to match the model's training requirements
  const tensor = tf.tidy(() => {
    // Convert the image to a tensor
    const imgTensor = tf.browser.fromPixels(image);

    // Resize the image to the expected input size (224x224)
    // Using bilinear interpolation is common and often gives good results.
    const resizedTensor = tf.image.resizeBilinear(imgTensor, [
      MODEL_INPUT_HEIGHT,
      MODEL_INPUT_WIDTH,
    ]);

    // Normalize the pixel values
    let normalizedTensor;
    if (MODEL_EXPECTS_NORMALIZATION_0_TO_1) {
      // Normalize to [0, 1] range (as done with rescale=1./255)
      normalizedTensor = resizedTensor.div(255.0);
    } else {
      // Example: Normalize to [-1, 1] range (like standard MobileNet preprocessing)
      // normalizedTensor = resizedTensor.toFloat().div(127.5).sub(1.0);
      // If your model expected something else, implement it here.
      // Based on the notebook, the else block shouldn't be needed.
      console.warn(
        "Model expects normalization other than [0, 1], but notebook used rescale=1./255. Using [0, 1]."
      );
      normalizedTensor = resizedTensor.div(255.0); // Fallback to notebook method
    }

    // Add the batch dimension (models expect batches of images)
    // Final shape should be [1, 224, 224, 3]
    return normalizedTensor.expandDims();
  });

  return tensor;
}

// loadImage function remains the same - loads file into an Image object
export function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided to loadImage."));
    }
    if (!file.type.startsWith("image/")) {
      return reject(new Error(`File is not an image: ${file.type}`));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        console.log(
          `Image loaded successfully: ${file.name}, size: ${img.width}x${img.height}`
        );
        resolve(img); // Resolve with the Image object
      };
      img.onerror = (err) => {
        console.error("Error loading image data into Image object:", err);
        reject(new Error(`Could not load image data for ${file.name}`));
      };
      img.src = event.target.result;
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error); // Handle FileReader errors
    };
    reader.readAsDataURL(file);
  });
}
