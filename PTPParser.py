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
cap3 = pyshark.FileCapture('LeapCapture20161231c.pcap', display_filter='ptp')
#out = dir(cap)
print cap3[0].ptp

testType = 3 # 0 = Accuracy / 1 = Hold Over / 2 = BMCA / 3 = Leap Second
i = 0

#Write to logfile
output = open('output.txt','w')

if testType == 0:

    latencyLog = open('latency.txt','w')
    correctionSMLog = open('correctionSMValues.txt','w')
    correctionMSLog = open('correctionMSValues.txt','w')
    offsetLog = open('offset.txt','w')


    offset_count = 0
    numOffset = 1
    t1Valid = False
    offset_mean = 0
    N = 200
    correctionMS = 0  #initialize MS switch residence time
    correctionSM = 0  #inistialize SM switch residence time
    correctionSM1 = 0;

offset_sum = 0;

if testType == 3:
    leapFlag = 0

start = time.clock()

for packet in cap3:
#  print packet.sniff_time
  #s = str(packet.sniff_time) 
  #s = 'Packet'
  
  #verify if it is a PTP message
  if packet.eth.type == '2048': #check for only for layer 3 PTP
      #print 'Number of layer 3 Packets found: ', i
      if packet.udp.srcport == '319' or packet.udp.srcport == '320': #319 and 320 are ports used by PTP
          #print 'Number of PTP Packets found: ', i
          messageType = packet.ptp.v2_control
         
          s = str(packet.sniff_time) + ':' + messageType
          s = s + packet.ip.src
          
          if messageType == '0' and testType == 0:
                s = 'Sync Message'
                s = s + ':' + str(packet.sniff_time) + ':'
                s = s + packet.ptp.v2_sdr_origintimestamp_seconds + '.' + packet.ptp.v2_sdr_origintimestamp_nanoseconds 
                output.write(s)
                s = packet.ptp.v2_correction_ns + '\n'
                correctionMSLog.write(s)
                
                #T1 = float(s)
                #s = s+ ',' #P2P T1 Timestamp
          elif messageType == '1' and testType == 0:
                s =  'Delay_Request Message'
          elif messageType == '2' and testType == 0:
                s = 'Follow-Up Message'
          elif messageType =='3' and testType ==0:
                s = 'Delay Response Message'
          elif messageType == '4' and testType ==0:
                s = s+': Management Message'
                managementid = packet.ptp.v2_mm_managementid
                action = packet.ptp.v2_mm_action
                
                # Management message CURRENT_DATA_SET, RESPONSE
                if testType == 0 and managementid == PTPManagement.CURRENT_DATA_SET and action == PTPManagement.RESPONSE:
                    s = s + ': offset from master: ' + packet.ptp.v2_mm_offset_ns + '.'+ packet.ptp.v2_mm_offset_subns
                    s = s + ': mean path delay from master: ' + packet.ptp.v2_mm_pathdelay_ns + '.' + packet.ptp.v2_mm_pathdelay_subns
                    s = s + '\n'
                    
                    output.write(s)
          elif messageType == '5':  # PTP Control Messages
            messageID = packet.ptp.v2_messageid  
            if messageID == '11': #Announce Message

                #Parameters for Holdover Test
                if testType == 1 or testType == 3:
                    source = packet.ptp.v2_timesource
                    gm_clockaccuracy = packet.ptp.v2_an_grandmasterclockaccuracy
                    gm_clockclass = packet.ptp.v2_an_grandmasterclockclass
                    clockclass = ''
                    clockaccuracy = ''

                #Clock Accuracy Information

                if gm_clockaccuracy == '32':
                    clockaccuracy = 'Time is accurate to within 25 ns'
                elif gm_clockaccuracy == '33':
                    clockaccuracy = 'Time is accurate to within 100 ns'
                elif gm_clockaccuracy == '34':
                    clockaccuracy = 'Time is accurate to within 250 ns'
                elif gm_clockaccuracy == '35':
                    clockaccuracy = 'Time is accurate to within 1 us'
                elif gm_clockaccuracy == '36':
                    clockaccuracy = 'Time is accurate to within 2.5 us'
                elif gm_clockaccuracy == '37':
                    clockaccuracy = 'Time is accurate to within 10 us'
                elif gm_clockaccuracy == '38':
                    clockaccuracy = 'Time is accurate to within 25 us'
                elif gm_clockaccuracy == '39':
                    clockaccuracy = 'Time is accurate to within 100 us'
                elif gm_clockaccuracy == '40':
                    clockaccuracy = 'Time is accurate to within 250 us'
                elif gm_clockaccuracy == '41':
                    clockaccuracy = 'Time is accurate to within 1 ms'
                elif gm_clockaccuracy == '42':
                    clockaccuracy = 'Time is accurate to within 2.5 ms'
                elif gm_clockaccuracy == '43':
                    clockaccuracy = 'Time is accurate to within 10 ms'
                elif gm_clockaccuracy == '44':
                    clockaccuracy = 'Time is accurate to within 25 ms'
                elif gm_clockaccuracy == '45':
                    clockaccuracy = 'Time is accurate to within 100 ms'
                elif gm_clockaccuracy == '46':
                    clockaccuracy = 'Time is accurate to within 250 ms'
                elif gm_clockaccuracy == '47':
                    clockaccuracy = 'Time is accurate to within 1 s'
                elif gm_clockaccuracy == '48':
                    clockaccuracy = 'Time is accurate to within 10 s'
                elif gm_clockaccuracy == '49':
                    clockaccuracy = 'Time is accurate to > 10 s'


                #Clock Class Information
                if gm_clockclass == '6':
                    clockclass = 'PTP GM synchronized to primary reference time source, PTP Time scale.'
                elif gm_clockclass == '7':
                    clockclass = 'PTP GM in holdover mode within specifications, PTP Time scale.'
                elif gm_clockclass == '13':
                    clockclass= 'PTP GM synchronized to application specific time, ARB Time scale.'
                elif gm_clockclass == '14':
                    clockclass = 'PTP GM in holdover mode, ARB Time scale, within specifications.'
                elif gm_clockclass == '52':
                    clockclass = 'PTP GM in holdover mode out of specifications, PTP Time scale.'
                elif gm_clockclass == '58':
                    clockclass = 'PTP GM in holdover mode out of specifications, ARB Time scale.'
                elif gm_clockclass == '187':
                    clockclass = 'PTP GM in holdover mode out of specifications, PTP Time scale. May be slave to another clock in another domain.'
                elif gm_clockclass == '193':
                    clockclass = 'PTP GM in holdover mode out of specifications, ARB Time scale. May be slave to another clock in another domain.'
                elif gm_clockclass == '248':
                    clockclass = 'Default clock class'
                elif gm_clockclass == '255':
                    clockclass == 'Slave-Only'

                # Output for leap second Test
                if testType == 3:
                    ls_59 = int(packet.ptp.v2_flags_li59)
                    ls_61 = int(packet.ptp.v2_flags_li61)
                    utc_offset = packet.ptp.v2_an_origincurrentutcoffset

                    if leapFlag == 0 and (ls_59 == 1 or ls_61 == 1):
                        if ls_61 == 1:
                            leapFlag = 1
                            s = str(packet.sniff_time) + ': ADD LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + utc_offset + " leap61: " + str(ls_61)
                        if ls_59 == 1:
                            leapFlag = 2
                            s = str(packet.sniff_time) + 'SUBTRACT LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + utc_offset+ " leap59: " + str(ls_59)
                        output.write(s + '\n')
                        s = str(packet.sniff_time) + ': Announce Message: gm_clockaccuracy ' + gm_clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + source + " utc_offset: " + utc_offset + " src IP:" + str(packet.ip.src)
                        output.write(s + '\n')
                    elif leapFlag == 1 and (ls_61 == 0):
                        leapFlag == 0
                        s = str(packet.sniff_time) + ': Leap 61 Second Ends: gm_clockaccuracy ' + gm_clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + source + " utc_offset: " + utc_offset + " leap61: " + str(ls_61) + " src IP:" + str(packet.ip.src)
                        output.write(s + '\n')
                    elif leapFlag == 2 and (ls_59 == 0):
                        leapFlag == 0
                        s = str(packet.sniff_time) + ': Leap 59 Second Ends: gm_clockaccuracy ' + gm_clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + source + " utc_offset: " + utc_offset + " leap59: " + str(ls_59) + " src IP:" + str(packet.ip.src)
                        output.write(s + '\n')
#
                #Output for holdover test
                if source != '32':
                     s = 'ALARM: No GNSS source: ' + s + ' GM Clock Accuracy: ' + gm_clockaccuracy + 'GM Clock Class: ' + gm_clockclass + 'GM Source ' + source
                     output.write(s+'\n')
                elif gm_clockclass != '6':
                    s = 'ALARM: ' + clockclass + " gm_clock_class: " + gm_clockclass;

                #TODO Check LS61 or LS59 has returned to false immediately after update of currentUTCSeconds
                #TODO Check LS and currentUTCOffset fields in Announce message has returned to normal within 2 Announce messages after UTC midnight
                #TODO C37.238 Check ATOI TLV changes to include LS +1 within 6.7 to 13.3 s before UTC midnight

            elif messageID == '2' and testType ==0: #PDelay_Request
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
              if testType == 0:
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
              if testType == 0:
                s = str(packet.sniff_time) + ': Path Delay Response Followup Message'
                output.write(s)
                s = packet.ptp.v2_correction_ns + '\n'
                correctionMSLog.write(s)
                s = packet.ptp.v2_pdfu_responseorigintimestamp_seconds + '.' + packet.ptp.v2_pdfu_responseorigintimestamp_nanoseconds + '\n' #P2P T3 Timestamp
                #latencyLog.write(s)
                
          if packet.transport_layer == 'UDP':
                s = str(packet.sniff_time) + ': source IP: ' + str(packet.ip.src) + ' ' + s
          else:
                s = str(packet.sniff_time) + ': source MAC: ' + str(packet.eth.src) + ' ' + s
                
          #print packet.ip.src
          #print packet.ip.dst
          print s
  i+=1
stop = time.clock()

print stop - start

output.write('finished')
output.close()

#close all data files
if testType == 0:
    latencyLog.close()
    correctionSMLog.close()
    correctionMSLog.close()
    offsetLog.close()


