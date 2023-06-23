import { DateTime } from "luxon";

/**
 * converts commit generated with: git log --pretty=format:"%at" --name-only --no-merges to a Record<string, ganttDates>
 *
 * @param commitHistory the git commit history
 */
export function transformGitCommitHistory(commitHistory: string): Record<string, ganttDates> {
    const commitHistoryLines = commitHistory.split("\n");

    let returnRecord: Record<string, ganttDates> = {};

    let lastDate = DateTime.fromSeconds(0);
    for (const [id, line] of commitHistoryLines.entries()) {
        if (line.match("\\d+")) {
            lastDate = DateTime.fromSeconds(parseInt(line));
            //console.log(lastDate);
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




export interface ganttDates {
    startDate: DateTime;
    endDate: DateTime;
}