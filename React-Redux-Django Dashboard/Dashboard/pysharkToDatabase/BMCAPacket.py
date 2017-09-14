import Dashboard.pysharkToDatabase.PTP_Messages as PTP_Messages

__metaclass__ = type

class BMCAPacket(PTP_Messages.AnnounceMessage):

    def __init__(self):

        super(BMCAPacket, self).__init__()

    def qualified(self, lastPacket):

        #if Packet.src_port == Packet.dst_port:

            #return(False)

        if str(self.clockidentity) == str(lastPacket.clockidentity) and int(self.sequence_id) <= int(lastPacket.sequence_id):

            return(False)

        if int(self.localstepsremoved) > 255:

            return(False)

        return(True)

    def BMCA(self, currentPacket, bestMasterClock,  allClocksDict, rBestMasterClocks):

        timestamp = bestMasterClock.sniff_timestamp

        if currentPacket.ETH_DST not in allClocksDict.keys():

            allClocksDict[currentPacket.ETH_DST] = {currentPacket.clockidentity: currentPacket}

        else:

            allClocksDict, bestMasterClock = self.check_timeout(allClocksDict, bestMasterClock)
            for port, devices in allClocksDict.copy().items():

                rbestMasterClock = BMCAPacket()

                if port == currentPacket.ETH_DST:

                    for identity, info in devices.copy().items():

                        if rbestMasterClock.clockidentity == '':

                            rbestMasterClock = info

                        else:

                            rbestMasterClock = (info, rbestMasterClock)[rbestMasterClock.dataSetComparisonAlgorithm(info) == rbestMasterClock.clockidentity]

                        bestMasterClock.stateDecisionAlgorithm(info, rbestMasterClock, bestMasterClock)

                        if identity == currentPacket.clockidentity:

                            if currentPacket.qualified(info) == True:

                                allClocksDict[port][identity] = currentPacket

                    if currentPacket.clockidentity not in devices.keys():

                        allClocksDict[port].update({currentPacket.clockidentity: currentPacket})

                    if port not in rBestMasterClocks.keys():

                        rBestMasterClocks[port] = rbestMasterClock

                    else:

                        rBestMasterClocks.update({port:(rBestMasterClocks[port], rbestMasterClock)[rbestMasterClock.clockidentity != '']})

                bestMasterClock = (rbestMasterClock, bestMasterClock)[bestMasterClock.dataSetComparisonAlgorithm(rbestMasterClock) == bestMasterClock.clockidentity]

        return currentPacket, bestMasterClock,  allClocksDict, rBestMasterClocks


    def stateDecisionAlgorithm(self, Packet, currentBestMasterOnPort, currentBestMaster):

        if 1 <= int(Packet.GMClockClass) <= 127:

            if Packet.dataSetComparisonAlgorithm(currentBestMasterOnPort) == Packet.clockidentity:

                Packet.STATE = 'M1'

            else:

                currentBestMasterOnPort.STATE = 'P1'

        else:

            if Packet.dataSetComparisonAlgorithm(currentBestMaster) == Packet.clockidentity:

                Packet.STATE = 'M2'

            else:

                if currentBestMasterOnPort.dataSetComparisonAlgorithm(currentBestMaster) == -2:

                    Packet.STATE = 'S1'

                else:

                    if currentBestMaster.dataSetComparisonAlgorithm(currentBestMasterOnPort) == currentBestMaster.clockidentity:

                        currentBestMasterOnPort.STATE = 'P2'

                    else:

                        currentBestMaster.STATE = 'M3'


    def dataSetComparisonAlgorithm(self, firstPacket):

        if str(firstPacket.GMClockIdentity) == str(self.GMClockIdentity):

            return(self.GMIdentity_EqualComaprison(firstPacket, self))

        else:

            return(self.GMIdentity_NotEqualComaprison(firstPacket, self))


    def GMIdentity_NotEqualComaprison(self, firstPacket, secondPacket):

        if int(firstPacket.priority_1) != int(secondPacket.priority_1):

            #print('Priority 1: ',firstPacket.priority_1, secondPacket.priority_1)
            return((secondPacket.clockidentity, firstPacket.clockidentity)[int(firstPacket.priority_1) < int(secondPacket.priority_1)])

        else:

            if int(firstPacket.GMClockClass) != int(secondPacket.GMClockClass):

                #print('GMClock Class: ',firstPacket.GMClockClass, secondPacket.GMClockClass)
                return((secondPacket.clockidentity, firstPacket.clockidentity)[int(firstPacket.GMClockClass) < int(secondPacket.GMClockClass)])

            else:

                if float(firstPacket.GMClockAccuracy) != float(secondPacket.GMClockAccuracy):
                    #print('Accuracy: ', firstPacket.GMClockAccuracy, secondPacket.GMClockAccuracy)
                    return((secondPacket.clockidentity, firstPacket.clockidentity)[float(firstPacket.GMClockAccuracy) < float(secondPacket.GMClockAccuracy)])

                else:

                    if float(firstPacket.GMClockVariance) != float(secondPacket.GMClockVariance):
                        #print('Variance: ', firstPacket.GMClockVariance, secondPacket.GMClockVariance)
                        return((secondPacket.clockidentity, firstPacket.clockidentity)[float(firstPacket.GMClockVariance) < float(secondPacket.GMClockVariance)])

                    else:

                        if int(firstPacket.priority_2) != int(secondPacket.priority_2):
                            #print('Priority 2: ",firstPacket.priority_2, secondPacket.priority_2)
                            return((secondPacket.clockidentity, firstPacket.clockidentity)[int(firstPacket.priority_2) < int(secondPacket.priority_2)])

                        else:
                            #print('GMClock ID: ', firstPacket.GMClockIdentity, secondPacket.GMClockIdentity)
                            return((secondPacket.clockidentity, firstPacket.clockidentity)[str(firstPacket.GMClockIdentity) < str(secondPacket.GMClockIdentity)])


    def GMIdentity_EqualComaprison(self, firstPacket, secondPacket):

        if int(firstPacket.localstepsremoved) > int(secondPacket.localstepsremoved) + 1:

            return(secondPacket.clockidentity)

        elif int(firstPacket.localstepsremoved) + 1 < int(secondPacket.localstepsremoved):

            return(firstPacket.clockidentity)

        else:

            if int(firstPacket.localstepsremoved) != int(secondPacket.localstepsremoved):
                    #print('Steps Removed: ',firstPacket.localstepsremoved, secondPacket.localstepsremoved)
                    return((secondPacket.clockidentity, firstPacket.clockidentity)[int(firstPacket.localstepsremoved) < int(secondPacket.localstepsremoved)])

            else:

                if str(firstPacket.clockidentity) != str(secondPacket.clockidentity):
                    #print('Clock Identity: ',firstPacket.clockidentity, secondPacket.clockidentity)
                    return((secondPacket.clockidentity, firstPacket.clockidentity)[str(firstPacket.clockidentity) < str(secondPacket.clockidentity)])

                else:

                    if firstPacket.ETH_DST != secondPacket.ETH_DST:
                        #print('Source Port: ', firstPacket.src_port, secondPacket.src_port)
                        return((secondPacket.clockidentity, firstPacket.clockidentity)[str(firstPacket.dst_port) < str(secondPacket.dst_port)])

                    else:

                        return(-2)


    def check_timeout(self, allClocksDict, bestMasterClock):

        for port, device in allClocksDict.copy().items():

            for identity, info in device.copy().items():

                if info.announce_message_timeout == 0:

                    del allClocksDict[port][identity]

                if info.clockidentity == bestMasterClock.clockidentity:

                    if bestMasterClock.announce_message_timeout is 0:

                        bestMasterClock.__init__()

                    info.announce_message_timeout -= 1
                    bestMasterClock.announce_message_timeout -= 1

                else:

                    info.announce_message_timeout -= 1

        return(allClocksDict, bestMasterClock)


