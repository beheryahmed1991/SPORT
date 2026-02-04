import { MATCH_STATUS } from '../validation/matches.js';

/**
 * Determine the current match status from the provided start and end times.
 * @param {string|number|Date} startTime - Value parseable as the match start time.
 * @param {string|number|Date} endTime - Value parseable as the match end time.
 * @param {Date} [now=new Date()] - Reference time used to evaluate the status.
 * @returns {string|null} One of MATCH_STATUS.SCHEDULED, MATCH_STATUS.LIVE, or MATCH_STATUS.FINISHED; `null` if either provided time is invalid.
 */
export function getMatchStatus(startTime, endTime, now = new Date()) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    if (now < start) {
        return MATCH_STATUS.SCHEDULED;
    }

    if (now >= end) {
        return MATCH_STATUS.FINISHED;
    }

    return MATCH_STATUS.LIVE;
}

/**
 * Synchronize a match object's status with the status computed from its start and end times.
 *
 * If the computed status is invalid, the match's status is left unchanged. If the computed
 * status differs from `match.status`, `updateStatus` is invoked with the new status and
 * `match.status` is updated.
 *
 * @param {Object} match - Object containing `startTime`, `endTime`, and `status` properties; `status` may be mutated.
 * @param {function(string): Promise<void>} updateStatus - Async callback invoked with the new status when an update is required.
 * @returns {string} The match's status after synchronization.
 */
export async function syncMatchStatus(match, updateStatus) {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);
    if (!nextStatus) {
        return match.status;
    }
    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }
    return match.status;
}