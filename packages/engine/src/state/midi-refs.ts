import { MidiRef } from '../common/types';
import { fid } from './fragments';

export const genMidiRefs = (): MidiRef[] => [
    {
      id: '9b33ebf4-e5b1-4e7f-bd11-6f0c916af9cb',
      trackId: 0,
      start: 512,
      end: 1024,
      fragmentId: fid.piano
    },
    {
      id: 'fdd3f656-653c-4102-892e-4e780d2a511d',
      trackId: 1,
      start: 256,
      end: 1024,
      fragmentId: fid.bass
    },
    {
      id: 'b664267b-2ccf-46d7-b728-316418c78bb9',
      trackId: 2,
      start: 0,
      end: 1024,
      fragmentId: fid.kick
    },
    {
      id: 'd5258d2b-ebee-4d2a-aab1-c7a535859860',
      trackId: 3,
      start: 128,
      end: 192,
      fragmentId: fid.clap1
    },
    {
      id: 'a18324c7-6b3b-48ff-88c6-8b4e455a76b2',
      trackId: 3,
      start: 192,
      end: 256,
      fragmentId: fid.clapFast
    },
    {
      id: '99b389f2-f03a-46b7-b07b-c57e509d4220',
      trackId: 3,
      start: 384,
      end: 448,
      fragmentId: fid.clap2
    },
    {
      id: '0b828d85-dab7-4f43-a6e1-915c678b0d33',
      trackId: 3,
      start: 448,
      end: 512,
      fragmentId: fid.clapFast
    },
    {
      id: '5bbe46ba-2d91-4c62-98e4-c362dc667116',
      trackId: 3,
      start: 768,
      end: 960,
      fragmentId: fid.clap2
    },
    {
      id: '03451cec-a9fa-455e-9606-1d3f1935b1e4',
      trackId: 3,
      start: 960,
      end: 1024,
      fragmentId: fid.clapFast
    }
  ];