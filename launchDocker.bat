cd C:/projectm
docker run -it -v %cd%:/app -p 80:80 gcr.io/projectm-238622/local:latest
