/**
 * Created by kgb on 9/26/17.
 */

import { reset } from "./resetPacket";

let rbestMasterClock;
let bestMasterClock;

export function RUN_BMCA(mostRecentAnnounceMessage,  bestMasterClocks, bestClocksOnPort, allClocksDict){


    if(!(mostRecentAnnounceMessage.subdomain_number in allClocksDict)){

        allClocksDict[mostRecentAnnounceMessage.subdomain_number] = {[mostRecentAnnounceMessage['ETH_DST']]: {}};
        bestClocksOnPort[mostRecentAnnounceMessage.subdomain_number] = {};
        bestMasterClocks[mostRecentAnnounceMessage.subdomain_number] = {};

    }
    else{

        if(!(mostRecentAnnounceMessage.ETH_DST in allClocksDict[mostRecentAnnounceMessage.subdomain_number])){

            allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST] = {[mostRecentAnnounceMessage.clockidentity]: mostRecentAnnounceMessage};

        }
        else{

            let check = check_timeout(mostRecentAnnounceMessage, allClocksDict, bestMasterClocks);
            allClocksDict = check[0];
            bestMasterClocks = check[1];

            for (let subdomain in allClocksDict) {

                if (subdomain === mostRecentAnnounceMessage.subdomain_number) {

                    bestMasterClock = reset(bestMasterClock);

                    for (let port in allClocksDict[subdomain]) {

                        rbestMasterClock = reset(rbestMasterClock);

                        if (port === mostRecentAnnounceMessage.ETH_DST) {

                            for (let clockid in allClocksDict[subdomain][port]) {

                                if (rbestMasterClock.clockidentity === '') {


                                    rbestMasterClock = allClocksDict[subdomain][port][clockid];


                                } else {

                                    rbestMasterClock = ((dataSetComparison(allClocksDict[subdomain][port][clockid], rbestMasterClock) === rbestMasterClock) ? rbestMasterClock : allClocksDict[mostRecentAnnounceMessage.subdomain_number][port][clockid]);

                                }
                                //StateDecision here
                                if (clockid === mostRecentAnnounceMessage.clockidentity) {

                                    if (qualified(mostRecentAnnounceMessage, allClocksDict[subdomain][port][clockid]) === true) {

                                        allClocksDict[subdomain][port][clockid] = mostRecentAnnounceMessage;

                                    }

                                }
                            }

                            if (!(mostRecentAnnounceMessage.clockidentity in allClocksDict[subdomain][port])) {

                                allClocksDict[subdomain][port] = {[mostRecentAnnounceMessage.clockidentity]: mostRecentAnnounceMessage};

                            }

                            if (!(port in bestClocksOnPort[subdomain])) {

                                bestClocksOnPort[subdomain][port] = rbestMasterClock;

                            }
                            else {

                                bestClocksOnPort[subdomain][port] = ((rbestMasterClock.clockidentity !== '') ? rbestMasterClock : bestClocksOnPort[subdomain][port]);

                            }

                            bestMasterClocks[subdomain] = ((dataSetComparison(bestMasterClocks[subdomain], rbestMasterClock) === bestMasterClocks[subdomain]) ? bestMasterClocks[subdomain] : bestClocksOnPort[subdomain][port]);

                        }

                    }
                }
            }


            }
        }

    return([mostRecentAnnounceMessage, bestMasterClocks, bestClocksOnPort, allClocksDict])
}


function check_timeout(mostRecentAnnounceMessage, allClocksDict, bestMasterClocks){


    for(let subdomain in allClocksDict){

        if(subdomain === mostRecentAnnounceMessage.subdomain_number) {

            for (let port in allClocksDict[subdomain]) {

                for (let clock in allClocksDict[subdomain][port]) {


                    allClocksDict[subdomain][port][clock].announce_message_timeout--;
                    bestMasterClocks[subdomain] = updateBestMasterInfo(bestMasterClocks[subdomain], allClocksDict[subdomain][port][clock]);

                    if (allClocksDict[subdomain][port][clock].announce_message_timeout === 0) {

                        delete(allClocksDict[subdomain][port][clock]);
                        break;
                    }
                }
            }
        }
    }

    return([allClocksDict, bestMasterClocks])
    }


function stateDecision(mostRecentAnnounceMessage, bestMasterOnPort, bestMasterClock){

    if(1 <= mostRecentAnnounceMessage.GMClockClass <= 127){

        if(dataSetComparison(mostRecentAnnounceMessage, bestMasterOnPort) === mostRecentAnnounceMessage.clockidentity){


        }
    }


}

function qualified(mostRecentAnnounceMessage, lastAnnounceMessage){

    if(mostRecentAnnounceMessage.localstepsremoved > 255){

        return(false);
    }

    if(mostRecentAnnounceMessage.sequence_id === lastAnnounceMessage.sequence_id){

        return(false);
    }

    return(true);
}


function dataSetComparison(firstPacket, secondPacket){

    if(firstPacket['GMClockIdentity'] === secondPacket['GMClockIdentity']){

        return(GMIdentity_EqualComparison(firstPacket, secondPacket))
    }
    else{

        return(GMIdentity_NotEqualComparison(firstPacket, secondPacket))
    }
}

function GMIdentity_EqualComparison(firstPacket, secondPacket){

    if(firstPacket['localstepsremoved'] > (secondPacket['localstepsremoved'] + 1)){

        secondPacket.comparison = 'local steps > 1';
        return(secondPacket)

    } else if((firstPacket['localstepsremoved'] + 1) < firstPacket['localstepsremoved']){

        firstPacket.comparison =  'local steps > 1';
        return(firstPacket)

    } else {

        if(firstPacket['localstepsremoved'] !== secondPacket['localstepsremoved']){

            return(setComparison(firstPacket, secondPacket, 'localstepsremoved'))
        }
        else{

            if(firstPacket['clockidentity'] !== secondPacket['clockidentity']){

                    return(setComparison(firstPacket, secondPacket, 'clockidentity'))

            }
            else{

                if(firstPacket['ETH_DST'] !== secondPacket['ETH_DST']){

                     return(setComparison(firstPacket, secondPacket, 'ETH_DST'))

                }

                else{

                    firstPacket.comparison = 'Same Clock';
                    return(firstPacket)
                }

            }
        }

    }

}

function GMIdentity_NotEqualComparison(firstPacket, secondPacket){


    if(firstPacket['priority_1'] !== secondPacket['priority_1']){


          return(setComparison(firstPacket, secondPacket, 'priority_1'))

    }
    else{

        if(firstPacket['GMClockClass'] !== secondPacket['GMClockClass']){

              return(setComparison(firstPacket, secondPacket, 'GMClockClass'))
        }
        else{

            if(firstPacket['GMClockAccuracy'] !== secondPacket['GMClockAccuracy']){

              return(setComparison(firstPacket, secondPacket, 'GMClockAccuracy'))
            }
            else{

                if(firstPacket['GMClockVariance'] !== secondPacket['GMClockVariance']){

                    return(setComparison(firstPacket, secondPacket, 'GMClockVariance'))

                }
                else{


                    if(firstPacket['priority_2'] !== secondPacket['priority_2']){

                        return(setComparison(firstPacket, secondPacket, 'priority_2'))

                    }
                    else{

                        return(setComparison(firstPacket, secondPacket, 'GMClockIdentity'))


                    }

                }
            }
        }

    }


}

function setComparison(firstPacket, secondPacket, field){

    if(firstPacket[field] < secondPacket[field]){

        firstPacket.comparison = field;
        return(firstPacket)

    } else{

        secondPacket.comparison = field;
        return(secondPacket)
    }
}


function updateBestMasterInfo(bestMasterClock, newestPacketFromClock){

    bestMasterClock.announce_message_timeout = ((newestPacketFromClock.clockidentity === bestMasterClock.clockidentity) ? bestMasterClock.announce_message_timeout - 1: bestMasterClock.announce_message_timeout);
    bestMasterClock.sniff_timestamp = ((newestPacketFromClock.clockidentity === bestMasterClock.clockidentity) ? newestPacketFromClock.sniff_timestamp : bestMasterClock.sniff_timestamp);
    bestMasterClock.sequence_id = ((newestPacketFromClock.clockidentity === bestMasterClock.clockidentity) ? newestPacketFromClock.sequence_id : bestMasterClock.sequence_id);

    bestMasterClock = (bestMasterClock.announce_message_timeout <= 0) ? reset(bestMasterClock): bestMasterClock;
    return(bestMasterClock)

}