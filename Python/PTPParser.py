'''
Created on Jan 3, 2017

@author: yashian


'''

import pyshark
import time
import mysql.connector
from mysql.connector import MySQLConnection, Error
from python_mysql_dbconfig import  read_db_config



import numpy as np
import matplotlib.pyplot as plt
from array import *

# PTP Management Message Object
class PTPManagement(object):
    TYPE = '5'
    CURRENT_DATA_SET = '8193'
    RESPONSE = '2'

# PTP Grandmaster Clock Object
class GrandmasterClock(object):
    leap_flag = 0
    utc_offset_flag = 0
    curr_utc_offset = 0
    clockaccuracy = ''
    clockclass = ''
    timeTraceable = ''
    ls_59 = 0
    ls_61 = 0
    utc_offset = ''
    clock_id = ''
    source = ''
    atoi_jumpseconds = ''
    atoi_currentoffset = ''
    utc_valid = ''

# Process Announce Messages Function
def announceMessageTest(packet, testType, gm):
    s=''

    # Parameters for Holdover and Leap Test
    if testType == 1 or testType == 3:
          source = packet.ptp.v2_timesource
          gm.clockaccuracy = packet.ptp.v2_an_grandmasterclockaccuracy
          gm.clockclass = packet.ptp.v2_an_grandmasterclockclass
          gm.clock_id = packet.ptp.v2_an_grandmasterclockidentity
          gm.timeTraceable = packet.ptp.v2_flags_timetraceable
          clockclass = ''
          clockaccuracy = ''

          # Output for General Sync Test
          if source == '16':
              s = 'Source: Atomic Clock'
          elif source == '32':
              s = 'Source: GPS'
          elif source == '48':
              s = 'Source:Terrestrial'
          elif source == '64':
              s = 'Source: PTP'
          elif source == '80':
              s = 'Source: NTP'
          elif source == '96':
              s = 'Source: Handset'
          elif source == '144':
              s = 'Source: Other'
          elif source == '160':
              s = 'Source: Internal Oscillator'




    # Clock Accuracy Information
    if gm.clockaccuracy == '32':
          clockaccuracy = 'Time is accurate to within 25 ns'
    elif gm.clockaccuracy == '33':
          clockaccuracy = 'Time is accurate to within 100 ns'
    elif gm.clockaccuracy == '34':
          clockaccuracy = 'Time is accurate to within 250 ns'
    elif gm.clockaccuracy == '35':
          clockaccuracy = 'Time is accurate to within 1 us'
    elif gm.clockaccuracy == '36':
          clockaccuracy = 'Time is accurate to within 2.5 us'
    elif gm.clockaccuracy == '37':
          clockaccuracy = 'Time is accurate to within 10 us'
    elif gm.clockaccuracy == '38':
          clockaccuracy = 'Time is accurate to within 25 us'
    elif gm.clockaccuracy == '39':
          clockaccuracy = 'Time is accurate to within 100 us'
    elif gm.clockaccuracy == '40':
          clockaccuracy = 'Time is accurate to within 250 us'
    elif gm.clockaccuracy == '41':
          clockaccuracy = 'Time is accurate to within 1 ms'
    elif gm.clockaccuracy == '42':
          clockaccuracy = 'Time is accurate to within 2.5 ms'
    elif gm.clockaccuracy == '43':
         clockaccuracy = 'Time is accurate to within 10 ms'
    elif gm.clockaccuracy == '44':
         clockaccuracy = 'Time is accurate to within 25 ms'
    elif gm.clockaccuracy == '45':
         clockaccuracy = 'Time is accurate to within 100 ms'
    elif gm.clockaccuracy == '46':
         clockaccuracy = 'Time is accurate to within 250 ms'
    elif gm.clockaccuracy == '47':
         clockaccuracy = 'Time is accurate to within 1 s'
    elif gm.clockaccuracy == '48':
         clockaccuracy = 'Time is accurate to within 10 s'
    elif gm.clockaccuracy == '49':
         clockaccuracy = 'Time is accurate to > 10 s'

    # Clock Class Information
    if gm.clockclass == '6':
      clockclass = 'PTP GM synchronized to primary reference time source, PTP Time scale.'
    elif gm.clockclass == '7':
      clockclass = 'PTP GM in holdover mode within specifications, PTP Time scale.'
    elif gm.clockclass == '13':
      clockclass = 'PTP GM synchronized to application specific time, ARB Time scale.'
    elif gm.clockclass == '14':
      clockclass = 'PTP GM in holdover mode, ARB Time scale, within specifications.'
    elif gm.clockclass == '52':
      clockclass = 'PTP GM in holdover mode out of specifications, PTP Time scale.'
    elif gm.clockclass == '58':
      clockclass = 'PTP GM in holdover mode out of specifications, ARB Time scale.'
    elif gm.clockclass == '187':
      clockclass = 'PTP GM in holdover mode out of specifications, PTP Time scale. May be slave to another clock in another domain.'
    elif gm.clockclass == '193':
      clockclass = 'PTP GM in holdover mode out of specifications, ARB Time scale. May be slave to another clock in another domain.'
    elif gm.clockclass == '248':
      clockclass = 'Default clock class'
    elif gm.clockclass == '255':
      clockclass == 'Slave-Only'

    query = "INSERT INTO Packet (Timestamp, SourceMac, clockClass, clockIdentity, clockSource, clockAccuracy) VALUES(%s,%s,%s,%s,%s,%s)"
    args = (str(packet.sniff_time),str(packet.eth.src),str(gm.clockclass),str(gm.clock_id),str(source),str(clockaccuracy))


    try:
        cursor = cnx.cursor()

        cursor.execute(query, args)

        if cursor.lastrowid:
            print('last insert id', cursor.lastrowid)
        else:
            print('last insert id not found')

        cnx.commit()

    except Error as error:
        print(error)
    finally:
        cursor.close()

    # Output for leap second Test
    if testType == 3:
          gm.ls_59 = int(packet.ptp.v2_flags_li59)
          gm.ls_61 = int(packet.ptp.v2_flags_li61)
          gm.utc_offset = packet.ptp.v2_an_origincurrentutcoffset
         # gm.atoi_jumpseconds = packet.ptp.v2_an_atoi_jumpseconds
         # gm.atoi_currentoffset = packet.ptp.v2_an_atoi_currentoffset
          gm.utc_reasonable = packet.ptp.v2_flags_utcreasonable

          if gm.curr_utc_offset == 0:
              gm.curr_utc_offset = int(gm.utc_offset)
          elif gm.curr_utc_offset != int(gm.utc_offset):
              gm.utc_offset_flag = 1  # Indicate utcOffset has changed (leap second has occurred)
              gm.curr_utc_offset = int(gm.utc_offset)
              s = str(packet.sniff_time) + ': UTC Offset changed to: ' + gm.utc_offset

          if gm.leap_flag == 0 and (gm.ls_59 == 1 or gm.ls_61 == 1):
              if gm.ls_61 == 1:
                  gm.leap_flag = 1
                  s = str(packet.sniff_time) + ': ADD LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + gm.utc_offset + " leap61: " + str(
                      gm.ls_61)
              if gm.ls_59 == 1:
                  gm.leap_flag = 2
                  s = str(packet.sniff_time) + 'SUBTRACT LEAP SECOND: ' + s + ' UTC OFFSET Change: ' + gm.utc_offset + " leap59: " + str(
                      gm.ls_59)
              output.write(s + '\n')
              s = str(packet.sniff_time) + ' GM Clock ID: ' + gm.clock_id + ': Announce Message: gm_clockaccuracy ' + clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + gm.source + " utc_offset: " + gm.utc_offset
              output.write(s + '\n')
          elif gm.utc_offset_flag == 1 and gm.leap_flag == 1 and (gm.ls_61 == 0):
              gm.leap_flag == 0
              s = str(packet.sniff_time) + ' GM Clock ID: ' + gm.clock_id + ': Leap 61 Second Announce Message Correctly Updated: gm_clockaccuracy ' + clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + gm.source + " utc_offset: " + gm.utc_offset + " leap61: " + str(
                  gm.ls_61)
              output.write(s + '\n')
          elif gm.utc_offset_flag == 1 and gm.leap_flag == 2 and (gm.ls_59 == 0):
              gm.leap_flag == 0
              s = str(packet.sniff_time) + ' GM Clock ID: ' + gm.clock_id +  ': Leap 59 Second Announce Message Correctly Updated: gm_clockaccuracy ' + clockaccuracy + ' ' + " gm_clockclass: " + clockclass + " source: " + gm.source + " utc_offset: " + gm.utc_offset + " leap59: " + str(
                  gm.ls_59)
              output.write(s + '\n')

          # Output for holdover test
          if source != '32':
              s = 'ALARM: No GNSS source: ' + s + ' GM Clock ID: ' + gm.clock_id +  ' GM Clock Accuracy: ' + gm.clockaccuracy + 'GM Clock Class: ' + gm.clockclass + 'GM Source ' + gm.source
              output.write(s + '\n')
          elif gm.clockclass != '6':
              s = 'ALARM: ' + clockclass + " gm_clock_class: " + gm.clockclass+ ' GM Clock ID: ' + gm.clock_id;





          # TODO Check LS61 or LS59 has returned to false immediately after update of currentUTCSeconds
          if gm.utc_offset_flag == 1 and gm.ls_61 == 1:
              s = 'FAIL: UTC offset changed to: ' + gm.utc_offset + " and Leap Flag 61 is still true."
          elif gm.utc_offset_flag == 1 and gm.ls_59 == 1:
              s = 'FAIL: UTC offset changed to: ' + gm.utc_offset + " and Leap Flag 59 is still true."

              # TODO Check LS and currentUTCOffset fields in Announce message has returned to normal within 2 Announce messages after UTC midnight
              # TODO C37.238 Check ATOI TLV changes to include LS +1 within 6.7 to 13.3 s before UTC midnight




cap3 = pyshark.FileCapture('LeapCapture20161231c.pcap', display_filter='ptp')
#out = dir(cap)

print cap3[0].ptp

#Create Connection to database
db_config = read_db_config()

#cnx = mysql.connector.connect(user='root', password=')P:?.lo90p;/',
#                              host='127.0.0.1',
#                              database='ptp_power')

try:
    cnx = MySQLConnection(**db_config)
    if cnx.is_connected():
        print('Connected to MySQL Database')
except Error as error:
    print (error)



testType = 3 # 0 = Accuracy / 1 = Hold Over / 2 = BMCA / 3 = Leap Second
i = 0

#Write to logfile
output = open('output.txt','w')



#initialize a hash table of grandmaster clocks
GM_Clocks = {}

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
    correctionSM = 0  #initialize SM switch residence time
    correctionSM1 = 0;

offset_sum = 0;



start = time.clock()

for packet in cap3:

  
  #verify if it is a PTP message
  if packet.eth.type == '35063': # PTP v 2 over Ethernet
      messageType = packet.ptp.v2_control
      messageID = packet.ptp.v2_messageid

      if messageType == '5':
          if messageID == '11':
            clock_id = packet.ptp.v2_an_grandmasterclockidentity

            #add a hash entry if clock id does not exist
            if GM_Clocks.has_key(clock_id) == False:
                GM_Clocks[clock_id] = GrandmasterClock()

            announceMessageTest(packet,testType,GM_Clocks[clock_id])
  if packet.eth.type == '2048': # IPv4
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
            if messageID == '11':
                clock_id = packet.ptp.v2_an_grandmasterclockidentity

                # add a hash entry if clock id does not exist
                if GM_Clocks.has_key(clock_id) == False:
                    GM_Clocks[clock_id] = GrandmasterClock()

                announceMessageTest(packet, testType, GM_Clocks[clock_id])
            elif messageID == '2' and testType ==0: #PDelay_Request
                s = str(packet.sniff_time) + ': Path Delay Request Message'
                output.write(s)
                s = packet.ptp.v2_correction_ns
                correctionSM = long(s)
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
                    s = packet.ptp.v2_correction_ns
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


