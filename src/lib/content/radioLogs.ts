import { coreRadioCallCards } from './radioCallCards';
import {
  buildRadioLogHandoverBrief,
  createRadioLogEntryFromCard,
  findRadioLogEntriesNeedingFollowUp,
  summarizeRadioLog,
  type RadioLogEntry
} from '$lib/domain/radioLogs';

const mobCard = coreRadioCallCards.find((card) => card.situationId === 'radio:h323-elina:mob-mayday');
const tallinnCard = coreRadioCallCards.find(
  (card) => card.situationId === 'radio:h323-elina:tallinn-ferry-lane-pan-pan'
);
const fogCard = coreRadioCallCards.find((card) => card.situationId === 'radio:h323-elina:fog-bank-securite');

if (!mobCard || !tallinnCard || !fogCard) {
  throw new Error('Expected core H-323 Elina radio call cards to be registered before radio log examples.');
}

export const h323ElinaRadioLogExamples: RadioLogEntry[] = [
  createRadioLogEntryFromCard(mobCard, {
    id: 'radio-log:h323-elina:mob-training-entry',
    timestamp: '2026-07-26T09:20:00+03:00',
    entryType: 'training',
    position: 'MOB waypoint rehearsed from plotter; not a live transmission',
    summary: 'MOB Mayday rehearsal: crew practised position readout, pointing role and recovery priorities without transmitting.',
    actionTaken: 'Helm turned into recovery drill, one crew pointed continuously, radio operator rehearsed read-aloud lines silently.',
    crewRoles: ['Skipper: helm and decision', 'Crew 1: pointer', 'Crew 2: radio prompt and lifebuoy'],
    tags: ['mob', 'training', 'cold-water']
  }),
  createRadioLogEntryFromCard(tallinnCard, {
    id: 'radio-log:h323-elina:tallinn-traffic-decision',
    timestamp: '2026-07-27T15:40:00+03:00',
    entryType: 'decision',
    position: 'North of Tallinn approach; exact GNSS position would be copied before a real call',
    summary: 'Ferry-lane Pan-Pan card reviewed; skipper chose early speed reduction and waiting outside the lane as the first action.',
    actionTaken: 'Assigned visual lookout to ferry target, kept engine ready and delayed crossing until CPA picture was clear.',
    crewRoles: ['Skipper: traffic decision', 'Crew 1: AIS/visual target watch', 'Crew 2: log and position prompt'],
    followUpAt: 'Before entering the next traffic separation or ferry approach',
    tags: ['tallinn', 'ferry-lane', 'decision']
  }),
  createRadioLogEntryFromCard(fogCard, {
    id: 'radio-log:h323-elina:fog-bank-securite',
    timestamp: '2026-07-28T07:10:00+03:00',
    entryType: 'sent',
    position: 'Outer approach; GNSS position to be copied into the real log before transmitting',
    summary: 'Securite practice entry for restricted visibility: safety broadcast wording linked to speed reduction and dedicated lookout.',
    actionTaken: 'Reduced speed, prepared fog signal rhythm, kept AIS target age visible and held outside the harbour approach.',
    crewRoles: ['Skipper: helm and speed', 'Crew 1: lookout and sound signals', 'Crew 2: VHF script and log'],
    followUpAt: 'When visibility improves or before entering harbour traffic',
    tags: ['fog', 'visibility', 'securite']
  })
];

export const h323ElinaRadioLogSummary = summarizeRadioLog(h323ElinaRadioLogExamples);
export const h323ElinaRadioLogFollowUps = findRadioLogEntriesNeedingFollowUp(h323ElinaRadioLogExamples);
export const h323ElinaRadioLogHandover = buildRadioLogHandoverBrief(h323ElinaRadioLogExamples, {
  title: 'H-323 Elina radio watch handover',
  audience: 'a family-crew watch change before the next Baltic approach'
});
