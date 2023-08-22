import optparse
import port_scanner.scanner as Scanner


def main():
    parser = optparse.OptionParser(
        'usage %prog -H' + '<target host> -p <target port>')
    parser.add_option('-H', dest='tgtHost', type='string', help='specify target host')
    parser.add_option('-q', dest='quiet', action='store_true',
                      help='specify quiet mode, will not show closed ports')
    (options, args) = parser.parse_args()
    # tgtHost = options.tgtHost
    quiet_mode = options.quiet

    scanner = Scanner(host=tgtHost, ports='default')

    scanner(quiet_mode=quiet_mode)

    # if (tgtHos
    # t == None):
    #     print(parser.usage)
    #     exit(0)
    #
    # if (tgtPorts[0] == 'tcp'):
    #     tgtPorts = (x for x in range(1, 65536))
    # else:
    #     if not ((re.search('\\d+[-]\\d+', tgtPorts[0]))):
    #         return
    #     (min, max) = tgtPorts[0].split('-')
    #     tgtPorts = (x for x in range(int(min), int(max) + 1))
    #
    # startTime = time.time()
    # p = Pool()
    # if (tgtHost.find('.x') != -1):
    #     for lastOctet in range(1, 255):
    #         curIp = tgtHost.replace('x', str(lastOctet))
    #         p = p.apply_async(portScan, args=(curIp, tgtPorts, quietMode))
    # else:
    #     p = p.apply_async(portScan, args=(tgtHost, tgtPorts, quietMode))
    # p.join()
    # timeDelta = int((time.time() - startTime) * 1000)
    # print('-----------------------------------------------------------------------------------')
    # print('Total Time To Run ' + '%d days %d hours %d minutes %d seconds' % prntime(timeDelta))
    # print('-----------------------------------------------------------------------------------')

if __name__ == '__main__':
    main()
