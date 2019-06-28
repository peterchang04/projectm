cd C:/projectm
docker pull gcr.io/projectm-238622/local:latest
docker run -it -v %cd%:/app -p 80:80 --name projectm_local gcr.io/projectm-238622/local:latest
