FROM ubuntu:20.04

ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN apt-get update

RUN apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh\
    # && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh 

RUN conda --version
# RUN conda activate base
RUN echo $CONDA_PREFIX

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN conda install -c anaconda cudatoolkit=11.3.1
RUN conda install -c conda-forge faiss-gpu faiss
RUN conda install -c conda-forge faiss

# RUN conda list | grep cuda

COPY . .

EXPOSE 5000

CMD ["python", "main.py"]