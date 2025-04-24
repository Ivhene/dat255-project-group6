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
