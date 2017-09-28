/**
 * Created by kgb on 9/26/17.
 */

import { reset } from "./resetPacket";

let rbestMasterClock;
let bestMasterClock;
let mostRecentAnnounceMessage;

export function RUN_BMCA(mostRecentAnnounceMessage,  bestMasterClocks, bestClocksOnPort, allClocksDict){

    if(!(mostRecentAnnounceMessage.subdomain_number in allClocksDict)){

        allClocksDict[mostRecentAnnounceMessage.subdomain_number] = {[mostRecentAnnounceMessage['ETH_DST']]: {}};
        bestClocksOnPort[mostRecentAnnounceMessage.subdomain_number] = {};
        bestMasterClocks[mostRecentAnnounceMessage.subdomain_number] = {};

    }
    else{

        if(!(mostRecentAnnounceMessage.ETH_DST in allClocksDict[mostRecentAnnounceMessage.subdomain_number])){

            allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST] = {[mostRecentAnnounceMessage.clockidentity]: {}};

        }
        else{

            if (!(mostRecentAnnounceMessage.clockidentity in allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST])) {

                allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST][mostRecentAnnounceMessage.clockidentity] =  mostRecentAnnounceMessage;

            }
            else {

                for (let subdomain in allClocksDict) {

                    bestMasterClock = reset();
                    bestMasterClocks[subdomain] = (bestMasterClocks[subdomain].announce_message_timeout > 0) ? bestMasterClocks[subdomain] : reset();


                    for (let port in allClocksDict[subdomain]) {

                        rbestMasterClock = reset();

                        for (let clockid in allClocksDict[subdomain][port]) {

                            allClocksDict[subdomain][port][clockid].announce_message_timeout --;
                            if (subdomain === mostRecentAnnounceMessage.subdomain_number && port === mostRecentAnnounceMessage.ETH_DST && clockid === mostRecentAnnounceMessage.clockidentity) {

                                allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST][mostRecentAnnounceMessage.clockidentity] = (qualified(mostRecentAnnounceMessage, allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST][mostRecentAnnounceMessage.clockidentity]) === true) ? mostRecentAnnounceMessage : allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST][mostRecentAnnounceMessage.clockidentity];


                            if (rbestMasterClock.clockidentity === '') {


                                rbestMasterClock = allClocksDict[subdomain][port][clockid];


                            } else {

                                rbestMasterClock = ((dataSetComparison(rbestMasterClock, allClocksDict[subdomain][port][clockid]) === rbestMasterClock) ? rbestMasterClock : allClocksDict[mostRecentAnnounceMessage.subdomain_number][port][clockid]);

                            }
                            //StateDecision here
                            if (allClocksDict[subdomain][port][clockid].announce_message_timeout === 0) {

                                    delete(allClocksDict[subdomain][port][clockid])

                                }
                            }


                        }
                        console.log('\n');
                        if (!(port in bestClocksOnPort[subdomain]) && (subdomain === mostRecentAnnounceMessage.subdomain_number)) {

                            bestClocksOnPort[subdomain][port] = rbestMasterClock;

                        }
                        else if (subdomain === mostRecentAnnounceMessage.subdomain_number) {

                            bestClocksOnPort[subdomain][port] = ((rbestMasterClock.clockidentity !== '') ? rbestMasterClock : bestClocksOnPort[subdomain][port]);
                            bestMasterClock = (((dataSetComparison(bestMasterClock, bestClocksOnPort[subdomain][port]) === bestMasterClock)) ? bestMasterClock : bestClocksOnPort[subdomain][port]);
                        }
                    }

                    bestMasterClocks[subdomain] = (subdomain === mostRecentAnnounceMessage.subdomain_number) ? bestMasterClock : bestMasterClocks[subdomain];
                }
            }

            }
        }

    return([mostRecentAnnounceMessage, bestMasterClocks, bestClocksOnPort, allClocksDict])
}

function stateDecision(mostRecentAnnounceMessage, bestMasterOnPort, bestMasterClock){

    if(1 <= mostRecentAnnounceMessage.GMClockClass <= 127){

        if(dataSetComparison(mostRecentAnnounceMessage, bestMasterOnPort) === mostRecentAnnounceMessage.clockidentity){


        }
    }


}

function qualified(mostRecentAnnounceMessage, lastAnnounceMessage){

    if(mostRecentAnnounceMessage !== undefined && lastAnnounceMessage !== undefined) {
        if (mostRecentAnnounceMessage.localstepsremoved > 255) {

            return (false);
        }

        if (mostRecentAnnounceMessage.sequence_id === lastAnnounceMessage.sequence_id || mostRecentAnnounceMessage.sniff_timestamp === lastAnnounceMessage.sniff_timestamp) {

            return (false);
        }
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
