import type {Tables} from '@/types/database.types';
import {atom} from 'jotai';

type Group = Tables<'groups'>;

export const selectedGroupAtom = atom<Group | null>(null);
