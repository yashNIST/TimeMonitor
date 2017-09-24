import pyshark
from pyshark_parser import packet_util

# This program parses through PCAP files from wireshark
# to find the Message Type, Message ID, Origin Timestamp in seconds
# and nanoseconds and finds whether the timesource came from a GPS
# signal or not.

def get_field_names(layer):                               # gets each of the field names of a specific layer in the packet

    z = 0
    while z <= len(layer.field_names) - 1:

        print(layer.field_names[z])

        z += 1

def is_field_here(pkt, layer, field):                   # checks whether a certain field exists in a layer of the packet
                                                        # also changes the field name to a format that the pyshark utilities can work with
    field = pkt[layer]._sanitize_field_name(field)
    z = 0
    while z <= len(pkt[layer].field_names)-1:

        if field == pkt[layer].field_names[z]:
            return True
        z += 1
    return False


def get_message_type(pkt):                             # returns the message type that you see in wireshark

    x = ''
    if int(pkt.ptp.v2_control) == 0:
        x = "Sync Message"
    if int(pkt.ptp.v2_control) == 2:
        x = "Follow_Up Message"
    if int(pkt.ptp.v2_control) == 3:
        x = "Delay_Resp"
    if int(pkt.ptp.v2_control) == 5:

        if int(pkt.ptp.v2_messageid) == 2:

            x = "Path Delay Request"

        elif int(pkt.ptp.v2_messageid) == 3:  # 3 is path delay response

            x = "Path Delay Response"

        elif int(pkt.ptp.v2_messageid) == 11:

            x = "Announce Message"

    return x


def get_ip(pkt, f):                                      # gets the source IP address of the message if the packet has an IP layer (It usually should)

    if pkt.__contains__('ip'):
        return pkt['ip'].get_field(f)
    else:
        return None


def get_timesource(pkt):                                                        # checks the field names to see if the timesource is added. If it is it prints it out.
                                                                                # The timesource is only present on the 'Announce Message' types
    z = 0
    while z <= len(pkt.ptp.field_names) - 1:

        if pkt.ptp.field_names[z] == 'v2_timesource':

            return 'GPS(0x20)'

        z += 1

def get_field(pkt, layer, field):

    if pkt.__contains__(layer):

        if is_field_here(pkt, layer, field) == True:
            return packet_util.get_value_from_packet_for_layer_field(pkt, layer, field)
        else:
            return None


