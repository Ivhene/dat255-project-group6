# Setup

To run locally, create a .env file with the following content
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

To convert a model to the json format, use
```
tensorflowjs_converter --input_format=keras path/to/model/name.h5 ./tfjs_model_output
```
