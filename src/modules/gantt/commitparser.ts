import { DateTime } from "luxon";


export function transformGitCommitHistory(commitHistory: string): Record<string, ganttDates> {
    const commitHistoryLines = commitHistory.split("\n");

    let returnRecord: Record<string, ganttDates> = {};

    for (const [id, line] of commitHistoryLines.entries()) {
        let lastDate = DateTime.fromSeconds(0);
        if (line.match("\\d+")) {
            lastDate = DateTime.fromSeconds(parseInt(line));
        } else {
            if (line == "") {
                continue;
            }
            if(returnRecord[line] != undefined) {
                if (returnRecord[line].startDate > lastDate) {
                    returnRecord[line].startDate = lastDate;
                }
                if (returnRecord[line].endDate < lastDate) {
                    returnRecord[line].endDate = lastDate;
                }
            } else {
                returnRecord[line] = {startDate: lastDate, endDate: lastDate};
            }
        }


    }

    return returnRecord;
}




interface ganttDates {
    startDate: DateTime;
    endDate: DateTime;
}