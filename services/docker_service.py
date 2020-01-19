import os

import docker
import urllib3
from flask import g


def get_docker_client():
    current_path = os.path.dirname(__file__)
    cert = os.path.join(current_path, 'cert.pem')
    key = os.path.join(current_path, 'key.pem')
    tls_config = docker.tls.TLSConfig(
        client_cert=(cert, key)
    )
    docker_client = getattr(g, '_docker_client', None)
    if docker_client is None:
        docker_client = g._docker_client = docker.DockerClient(base_url='tcp://210.77.79.190:2376', tls=tls_config)
    return docker_client



if __name__ == '__main__':
    current_path = os.path.dirname(__file__)
    cert = os.path.join(current_path, 'cert.pem')
    key = os.path.join(current_path, 'key.pem')
    tls_config = docker.tls.TLSConfig(
        client_cert=(cert, key)
    )

    client = docker.DockerClient(base_url='tcp://210.77.79.190:2376', tls=tls_config)
    print "1", client.containers.list()
    c1 = client.containers.run("ubuntu:latest", "echo hello 1",detach=True)
    c2 = client.containers.run("ubuntu:latest", "echo hello 2",detach=True)
    c3 = client.containers.run("ubuntu:latest", "echo hello 3",detach=True)
    c4 = client.containers.run("ubuntu:latest", "echo hello 4",detach=True)
    print c1, c2, c3, c4
    print "3", client.containers.list()
    # print client.containers.run('rdccosmo/wrf', detach=True)
    container =  client.containers.get('c7244b0f43')
    print "4", container.logs()
    print "5", container.attrs['Config']['Image']
    # container = client.containers.get('e61eb21321')
    # print container.attrs['Config']['Image']
    #
    # container = client.containers.get('41d1d11a54')
    # print container.attrs['Config']['Image']
