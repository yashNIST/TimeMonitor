from django import template
from Dashboard.models import Announce_Message, Path_Delay_Request_Message
from Dashboard.pysharkToDatabase import PyShark_Capture, BMCAPacket, tests
import datetime

register = template.Library()
announce_messages = Announce_Message.objects.all()
p_delay_request_messages = Path_Delay_Request_Message.objects.all()

#get best master for each seperate subdomain number and display it along with devices under test and devices on each port
@register.inclusion_tag('Timing_Testbed_Dashboard/BMCA/BMCA_list.html')
def BMCA_Dict():

    bestMasterClock = BMCAPacket.BMCAPacket()
    rBestMasterClocks = {}  # Dictionary of best packets on each port
    ports = {}  # Dictionary of all devices organized by domain number and port number
    # subdomain number: how boundary clock handles grandmasters on different domains
    # boundary clock has 1 slave port and the rest are defaulted to master
    for announce_message in announce_messages:

        firstPacket = BMCAPacket.BMCAPacket()
        firstPacket.IP_SRC = announce_message.IP_SRC
        firstPacket.IP_DST = announce_message.IP_DST
        firstPacket.ETH_SRC = announce_message.ETH_SRC
        firstPacket.ETH_DST = announce_message.ETH_DST
        firstPacket.sniff_timestamp = announce_message.sniff_timestamp
        firstPacket.sequence_id = announce_message.sequence_id
        firstPacket.clockidentity = announce_message.clockidentity
        firstPacket.GMClockIdentity = announce_message.GMClockIdentity
        firstPacket.localstepsremoved = announce_message.localstepsremoved
        firstPacket.alternateMasterFlag = announce_message.alternateMasterFlag
        firstPacket.GMClockClass = announce_message.GMClockClass
        firstPacket.GMClockAccuracy = announce_message.GMClockAccuracy
        firstPacket.GMClockVariance = announce_message.GMClockVariance
        firstPacket.priority_1 = announce_message.priority_1
        firstPacket.priority_2 = announce_message.priority_2
        firstPacket.sourceport_id = announce_message.sourceport_id
        firstPacket.timesource = announce_message.timesource

        firstPacket, bestMasterClock, ports, rBestMasterClocks = bestMasterClock.BMCA(firstPacket, bestMasterClock, ports, rBestMasterClocks)

    #allClocksDict = {'129.6.60.67': 3, '129.6.60.68': 4, '129.6.60.69': 5, '129.6.60.70': 6}
    #bestMasterClock = Announce_Message.objects.filter(sniff_timestamp=bestMasterClock.sniff_timestamp, ETH_DST=bestMasterClock.ETH_DST, clockidentity=bestMasterClock.clockidentity)
    return({'bestMasterClock': bestMasterClock, 'bestClocksonEachPort': rBestMasterClocks,'allClocks': ports})

@register.inclusion_tag('Timing_Testbed_Dashboard/Holdover/Holdover_list.html')
def Holdover_Dict():

    startFlag = 0
    startRecoveryTime = 0
    endRecoveryTime = 0
    result = ''
    firstPacket = BMCAPacket.PTP_Messages.AnnounceMessage()

    for announce_message in announce_messages:

        firstPacket = BMCAPacket.BMCAPacket()
        firstPacket.IP_SRC = announce_message.IP_SRC
        firstPacket.IP_DST = announce_message.IP_DST
        firstPacket.ETH_SRC = announce_message.ETH_SRC
        firstPacket.ETH_DST = announce_message.ETH_DST
        firstPacket.sniff_timestamp = announce_message.sniff_timestamp
        firstPacket.sequence_id = announce_message.sequence_id
        firstPacket.clockidentity = announce_message.clockidentity
        firstPacket.GMClockIdentity = announce_message.GMClockIdentity
        firstPacket.GMClockClass = announce_message.GMClockClass
        firstPacket.GMClockAccuracy = announce_message.GMClockAccuracy
        firstPacket.GMClockVariance = announce_message.GMClockVariance
        firstPacket.time_traceable = announce_message.timetraceable
        firstPacket.frequency_traceable = announce_message.frequencytraceable
        firstPacket.timesource = announce_message.timesource

        if int(announce_message.timesource) != 32:

            pass
            #print('ALARM: No GNSS source: ' + str(announce_message.clockidentity) + ' GM Clock ID: ' + str(announce_message.GMClockIdentity) + ' GM Clock Accuracy: ' + str(announce_message.GMClockAccuracy) + ' GM Clock Class: ' + str(announce_message.GMClockClass) + ' GM Source:' + str(announce_message.timesource))

        if int(announce_message.timetraceable) == 0 and int(announce_message.frequencytraceable) == 0 and startFlag == 0:

            startRecoveryTime = announce_message.sniff_timestamp
            startFlag = 1

        elif int(announce_message.timetraceable) == 1 and int(announce_message.frequencytraceable) == 1 and startFlag == 1:

            endRecoveryTime = announce_message.sniff_timestamp
            if (endRecoveryTime - startRecoveryTime) > 16:

                result = 'FAIL: '

            else:

                result = 'PASS: '

            result = (result + ' recovery time is ' + str(endRecoveryTime - startRecoveryTime) + ' seconds')
            startFlag = 0

    return ({'Packet': firstPacket, 'result': result})

        #tests.holdover(int(announce_message.GMClockClass), int(announce_message.GMClockClass), int(announce_message.timetraceable), int(announce_message.frequencytraceable))

@register.inclusion_tag('Timing_Testbed_Dashboard/LeapSecond/LeapSecond_list.html')
def LeapSecond_Dict():

    packet = BMCAPacket.PTP_Messages.AnnounceMessage()
    check = lambda action, li61, li59: 'Positive Leap Second' if (li61 is 1) else 'Negative Leap Second' if (li59 is 1) else 'Do Nothing'
    action = ''

    for announce_message in announce_messages:

        packet.clockidentity = announce_message.clockidentity
        packet.ETH_DST = announce_message.ETH_DST
        packet.utcoffset = announce_message.origincurrentutcoffset
        packet.origintimestampseconds = announce_message.origintimestampseconds
        packet.origindatetime = datetime.datetime.fromtimestamp(packet.origintimestampseconds)
        packet.utcreasonable = announce_message.utcreasonable
        packet.li59 = announce_message.li59
        packet.li61 = announce_message.li61

        action = check(action, packet.li61, packet.li59)

    return ({'Packet': packet, 'action': action})

@register.inclusion_tag('Timing_Testbed_Dashboard/ATOI/ATOI_list.html')
def ATOI_Dict():

    packet = BMCAPacket.PTP_Messages.AnnounceMessage()

    for announce_message in announce_messages:

        packet.clockidentity = announce_message.clockidentity
        packet.ETH_DST = announce_message.ETH_DST
        packet.ATOI_DisplayName = announce_message.ATOI_DisplayName
        packet.ATOI_Key = announce_message.ATOI_Key
        packet.ATOI_Offset = announce_message.ATOI_Offset
        packet.ATOI_TLVType = announce_message.ATOI_TLVType
        packet.ATOI_JumpSeconds= announce_message.ATOI_JumpSeconds
        packet.ATOI_TimeOfNextJump = announce_message.ATOI_TimeOfNextJump


    return ({'Packet': packet})

@register.inclusion_tag('Timing_Testbed_Dashboard/Multicast_MAC_Address/MulticastMAC_list.html')
def Multicast_MAC():

    packet = BMCAPacket.PTP_Messages.AnnounceMessage()
    result = ''
    MAC = lambda eth: 'Path Delay Request Messages Have Correct MAC Address' if eth == '01:80:c2:00:00:0e' else 'Path Delay Request Messages Do Not Have Correct MAC Address'

    for message in p_delay_request_messages:

        packet.clockidentity = message.clockidentity
        packet.ETH_DST = message.ETH_DST
        packet.sequence_id = message.sequence_id
        packet.sniff_timestamp = message.sniff_timestamp

        result = MAC(packet.ETH_DST)


    return ({'Packet': packet, 'result': result})
