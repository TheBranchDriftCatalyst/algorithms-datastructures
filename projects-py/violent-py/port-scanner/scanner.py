from socket import *
from gevent.pool import Pool

DEF_PORT_LIST = [
    1, 5, 7, 18, 20, 21, 22, 23, 25, 29, 37, 42, 43, 49, 53, 69, 70, 79, 80,
    103, 108, 109, 110, 115, 118, 119, 137, 139, 143, 150, 156, 161, 9090,
    179, 190, 194, 197, 389, 396, 443, 444, 445, 458, 546, 547, 563, 569,
    1080, 201, 4380, 4370, 17603, 17600, 49588, 15292, 6263, 6258, 8080,
    8081, 9091, 9000, 9999, 9998, 9997, 138, 873, 3260, 6281, 5000, 5001,
    995, 3005, 5353, 8324, 32469
] + list(range(6890, 6999))


class Scanner:

    def __init__(self, host='0.0.0.0', ports=DEF_PORT_LIST):
        self.host = host
        self.ports = ports
        self.socket = net.socket(net.AF_INET, net.SOCK_STREAM)
        self.pool = Pool()

    def __call__(self, quiet_mode=False):
