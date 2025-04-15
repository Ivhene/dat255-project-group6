# Setup project

To run locally, create a .env file with the following content
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

# Convert a model
## Create a new python environment
Create a new python environemnt to avoid version conflicts

## Install dependencies
Run the command below
```bash
pip install convertionRequirements
```

## Convert the model
To convert a model to the json format, use
```bash
tensorflowjs_converter --input_format=keras path/to/model/name.h5 ./tfjs_model_output
```
