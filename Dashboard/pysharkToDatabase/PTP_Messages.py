import json
__metaclass__ = type

class AnnounceMessage:

    clockidentity = ''
    GMClockIdentity = ''
    sniff_timestamp = 0
    IP_SRC = ''
    IP_DST = ''
    ETH_SRC = ''
    ETH_DST = ''
    message_type = ''
    alternateMasterFlag = 0
    src_port = -1
    dst_port = -1
    priority_1 = 128
    priority_2 = 128
    sequence_id = 0
    sourceport_id = 0
    localstepsremoved = 0
    GMClockClass = 248
    GMClockAccuracy = 0
    GMClockVariance = 0
    announce_message_timeout = 5
    timesource = 0
    subdomainnumber = 0
    STATE = ''

    def __init__(self):

        self.clockidentity = ''
        self.GMClockIdentity = ''
        self.sniff_timestamp = 0
        self.IP_SRC = ''
        self.IP_DST = ''
        self.ETH_SRC = ''
        self.ETH_DST = ''
        self.message_type = ''
        self.alternateMasterFlag = 0
        self.src_port = -1
        self.dst_port = -1
        self.priority_1 = 200
        self.priority_2 = 200
        self.sourceport_id = 0
        self.localstepsremoved = 0
        self.GMClockClass = 248
        self.GMClockAccuracy = 0
        self.GMClockVariance = 0
        self.announce_message_timeout = 5
        self.timesource = 0
        self.subdomainnumber = 0
        self.STATE = ''

    def __getitem__(self, item):

        return(getattr(self, str(item)))

    def __setitem__(self, key, value):

        setattr(self, key, value)

    def toJSON(self):

        return json.dumps(self, default=lambda o: o.__dict__, indent=4)

    def print_packet_info(self):

        print(vars(self))


