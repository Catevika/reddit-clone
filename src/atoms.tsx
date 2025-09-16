import type {Group} from '@/types/types';
import {atom} from 'jotai';

export const selectedGroupAtom = atom<Group | null>(null);
