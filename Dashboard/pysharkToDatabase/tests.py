def switchover(info, lastPacket):

    if info.GMClockIdentity != lastPacket.GMClockIdentity and lastPacket.GMClockIdentity != '':

        print('Switchover from %s to %s' % (lastPacket.GMClockIdentity, info.GMClockIdentity))

def holdover(GMClockClass1, GMClockClass2, time_traceable, frequency_traceable):

    GMClass = {

        6: 'PTP GM synchronized to primary reference time source, PTP Time scale.',
        7: 'PTP GM in holdover mode within specifications, PTP Time scale.',
        13: 'PTP GM synchronized to application specific time, ARB Time scale.',
        14: 'PTP GM in holdover mode, ARB Time scale, within specifications.',
        52: 'PTP GM in holdover mode out of specifications, PTP Time scale.',
        58: 'PTP GM in holdover mode out of specifications, ARB Time scale.',
        187: 'PTP GM in holdover mode out of specifications, PTP Time scale. May be slave to another clock in another domain.',
        193: 'PTP GM in holdover mode out of specifications, ARB Time scale. May be slave to another clock in another domain.',
        248: 'Default clock class',
        255: 'Slave-Only',

    }

    print(GMClockClass1, ': ', GMClass.get(GMClockClass1), 'Time Traceable: ' , time_traceable, 'Frequency Traceable: ', frequency_traceable)

    if GMClockClass1 != GMClockClass2 and GMClockClass2 != 248:

        print('\n')
        print('Class switched from %d to %d    Time Traceable: %s   Frequency Traceable:  %s' % (GMClockClass2, GMClockClass1, ('False', 'True')[time_traceable is 1],('False', 'True')[frequency_traceable is 1]))
        print('\n')


def multicastMacAddressAnnounceSync(packet):

    if str(packet.ETH_DST) == '01:1b:19:00:00:00':

        return(True)

    return(False)


def multicastMacAddressPDelay(packet):

    if str(packet.ETH_DST) == '01:80:c2:00:00:0e':

        return (True)

    return (False)