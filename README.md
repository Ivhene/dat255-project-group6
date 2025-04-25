# CheXpert Model Training
## Prerequisites for running locally
* Set up fresh Python environment: `python -m venv directory_name`
* `cd` into directory and activate the environment in your shell: `. bin/activate` (select activation script according to your shell)
* Install [PyTorch](https://pytorch.org/get-started/locally/) in Python environment
* Install Jupyter Lab: `pip install jupyterlab`
* Run Jupyter Lab: `jupyter lab`
* Remember to adjust `DATA_DIR`, `batch_size` and other variables

## Notes for running in Colab
* Select `Runtime` -> `Change runtime type` and make sure a GPU or TPU is selected.

## Try out the webapp
If you want to try out the webapp, you can use any of the images from the valid folder in this repo at https://huggingface.co/spaces/olefb/CheXpertLabeler 
