'''
Created on Jan 3, 2017

@author: yashian


'''

import pyshark
import time
import numpy as np
import matplotlib.pyplot as plt
from array import *


class PTPManagement(object):
    TYPE = '5'
    CURRENT_DATA_SET = '8193'
    RESPONSE = '2'

#open saved trace file
#cap = pyshark.FileCapture('PMUTest.pcap')
#cap2 = pyshark.FileCapture('PTPCapture.pcap')
cap3 = pyshark.FileCapture('P2P_UDP_Sample.pcap', display_filter='ptp')
#out = dir(cap)
print cap3[0].ptp

output = open('output.txt','w')
latencyLog = open('latency.txt','w')
correctionSMLog = open('correctionSMValues.txt','w')
correctionMSLog = open('correctionMSValues.txt','w')
offsetLog = open('offset.txt','w')

i = 0
offset_count = 0
numOffset = 1
t1Valid = False
offset_mean = 0
N = 200
correctionMS = 0  #initialize MS switch residence time
correctionSM = 0  #inistialize SM switch residence time
correctionSM1 = 0;

offset_sum = 0;

start = time.clock()

for packet in cap3:
#  print packet.sniff_time
  #s = str(packet.sniff_time) 
  #s = 'Packet'
  
  #verify if it is a PTP message
  if packet.eth.type == '2048': #check for only for layer 3 PTP
      print 'Number of layer 3 Packets found: ', i
      if packet.udp.srcport == '319' or packet.udp.srcport == '320': #319 and 320 are ports used by PTP
          print 'Number of PTP Packets found: ', i
          messageType = packet.ptp.v2_control
         
          s = str(packet.sniff_time) + ':' + messageType
          s = s + packet.ip.src
          
          if messageType == '0':
                s = 'Sync Message'
                s = s + ':' + str(packet.sniff_time) + ':'
                s = s + packet.ptp.v2_sdr_origintimestamp_seconds + '.' + packet.ptp.v2_sdr_origintimestamp_nanoseconds 
                output.write(s)
                s = packet.ptp.v2_correction_ns + '\n'
                correctionMSLog.write(s)
                
                #T1 = float(s)
                #s = s+ ',' #P2P T1 Timestamp
          elif messageType == '1': 
                s =  'Delay_Request Message'
          elif messageType == '2':
                s = 'Follow-Up Message'
          elif messageType =='3':
                s = 'Delay Response Message'
          elif messageType == '4': 
                s = s+': Management Message'
                managementid = packet.ptp.v2_mm_managementid
                action = packet.ptp.v2_mm_action
                
                # Management message CURRENT_DATA_SET, RESPONSE
                if managementid == PTPManagement.CURRENT_DATA_SET and action == PTPManagement.RESPONSE:
                    s = s + ': offset from master: ' + packet.ptp.v2_mm_offset_ns + '.'+ packet.ptp.v2_mm_offset_subns
                    s = s + ': mean path delay from master: ' + packet.ptp.v2_mm_pathdelay_ns + '.' + packet.ptp.v2_mm_pathdelay_subns
                    s = s + '\n'
                    
                    output.write(s)
          elif messageType == '5':  # PTP Control Messages
            messageID = packet.ptp.v2_messageid  
            if messageID == '11': #Announce Message

                #Parameters for Holdover Test
                source = packet.ptp.v2_timesource
                gm_clockaccuracy = packet.ptp.v2_an_grandmasterclockaccuracy
                gm_clockclass = packet.ptp.v2_an_grandmasterclockclass

                #Parameters for Leap second Test
                ls_59 = packet.ptp.v2_flags_li59
                ls_61 = packet.ptp.v2_flags_li61
                utc_offset = packet.ptp.v2_an_origincurrentutcoffset

                #Clock Accuracy Information
                if gm_clockaccuracy == '6':
                    clockaccuracy = 'PTP GM synchronized to primary reference time source, PTP Time scale.'
                elif gm_clockaccuracy == '7':
                    clockaccuracy = 'PTP GM in holdover mode within specifications, PTP Time scale.'
                elif gm_clockaccuracy == '13':
                    clockaccuracy = 'PTP GM synchronized to application specific time, ARB Time scale.'
                elif gm_clockaccuracy == '14':
                    clockaccuracy = 'PTP GM in holdover mode, ARB Time scale, within specifications.'
                elif gm_clockaccuracy == '52':
                    clockaccuracy = 'PTP GM in holdover mode out of specifications, PTP Time scale.'
                elif gm_clockaccuracy == '58':
                    clockaccuracy = 'PTP GM in holdover mode out of specifications, ARB Time scale.'
                elif gm_clockaccuracy == '187':
                    clockaccuracy = 'PTP GM in holdover mode out of specifications, PTP Time scale. May be slave to another clock in another domain.'
                elif gm_clockaccuracy == '193':
                    clockaccuracy = 'PTP GM in holdover mode out of specifications, ARB Time scale. May be slave to another clock in another domain.'
                elif gm_clockaccuracy == '248':
                    clockaccuracy = 'Default clock class'
                elif gm_clockaccuracy == '255':
                    clockaccuracy == 'Slave-Only'

        
                s = str(packet.sniff_time) + ': Announce Message: gm_clockaccuracy' + gm_clockaccuracy + " gm_clockclass: " + gm_clockclass + " source: " + source + " utc_offset: " + utc_offset 
        
                if ls_61 == '1':
                   s = ':ADD LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + utc_offset
                if ls_59 == '1':
                    s = 'SUBTRACT LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + utc_offset
                if source != '32':
                     s = 'No GPS source: ' + s + ' GM Clock Accuracy: ' + gm_clockaccuracy + 'GM Clock Class: ' + gm_clockclass + 'GM Source ' + source
            elif messageID == '2': #PDelay_Request
                s = str(packet.sniff_time) + ': Path Delay Request Message'
                output.write(s)
                s = packet.ptp.v2_correction_ns;
                correctionSM = long(s);
                correctionSMLog.write(s + '\n')
                s = packet.ptp.v2_pdrq_origintimestamp_seconds + '.' + packet.ptp.v2_pdrq_origintimestamp_nanoseconds 
                T1 = float(s)
                
                if T1 > 1490000000:
                    t1Valid = True;
                    s = 'T1:' + s+ ',' #P2P T1 Timestamp
                else:
                    t1Valid = False;
                    #latencyLog.write(s) 
            elif messageID == '3': #PDelay_Response
                if t1Valid == True: #Process PDelay_Response only if PDelay Request has valid timestamp
                    s = str(packet.sniff_time) + ': Path Delay Response Message'
                    output.write(s)
                    s = packet.ptp.v2_correction_ns;
                    correctionMS = long(s)
                    correctionMSLog.write(s + '\n')
                    s = packet.ptp.v2_pdrs_requestreceipttimestamp_seconds + '.' + packet.ptp.v2_pdrs_requestreceipttimestamp_nanoseconds 
                    T2 = float(s)
                    if offset_count == 0:
                        latency_a = T2 - T1
                        offset_count = 1
                        correctionSM1 = correctionSM;
                        latencyLog.write('T1: ' + str(T1) + ' T2:' + str(T2)+ ' latency_a:' + str(latency_a) +'\n')
                    elif offset_count == 1:
                        latency_b = T2 - T1
                        path_delay_error = (correctionSM1 - correctionSM);
                        offset = ((latency_b - latency_a) * 1000000000)-path_delay_error; #offset in nanoseconds
                        
                        offset_count = 0
                        if abs(offset) < 10000:
                            offsetLog.write(str(offset) + '\n')
                    
                       # offsets.app
                        
#                         outlier = offset_mean * 10
#                         print "Outlier threshold: " + str(outlier)
#                         
#                         #remove outliers
#                         if numOffset > 1 and abs(offset) < abs(outlier):
#                             print "Offset mean: " + str(offset_mean)
#                             offset_sum = offset + offset_sum
#                             offset_mean = offset_sum / numOffset
#                             offsetLog.write(str(offset) + '\n')
#                             numOffset = numOffset + 1
#                         elif numOffset == 1:
#                             offsetLog.write(str(offset) + '\n')
#                             offset_sum = offset + offset_sum;
#                             offset_mean = offset_sum / numOffset
#                             numOffset = numOffset + 1
                            
                        latencyLog.write('T1: ' + str(T1) + ' T2:' + str(T2)+ ' latency_b:' + str(latency_b) +'\n')
                    s = s + ',' #P2P T2 Timestamp
                    #latencyLog.write(s)
            elif messageID == '10': #PDelay_Response_Followup
                s = str(packet.sniff_time) + ': Path Delay Response Followup Message'
                output.write(s)
                s = packet.ptp.v2_correction_ns + '\n'
                correctionMSLog.write(s)
                s = packet.ptp.v2_pdfu_responseorigintimestamp_seconds + '.' + packet.ptp.v2_pdfu_responseorigintimestamp_nanoseconds + '\n' #P2P T3 Timestamp
                #latencyLog.write(s)
                
          if packet.transport_layer == 'UDP':
                s = str(packet.sniff_time) + ': source IP: ' + str(packet.ip.src) + ' ' + s
          else:
                s = str(packet.sniff_time) + ': source MAC: ' + packet.eth.src + ' ' + s        
                
          print packet.ip.src
          print packet.ip.dst
          print s
  i+=1
stop = time.clock()

print stop - start

output.write('finished')

#close all data files
output.close()
latencyLog.close()
correctionSMLog.close()
correctionMSLog.close()
offsetLog.close()

