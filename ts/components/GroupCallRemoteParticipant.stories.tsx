// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import { memoize, noop } from 'lodash';
import { select } from '@storybook/addon-knobs';

import type { PropsType } from './GroupCallRemoteParticipant';
import { GroupCallRemoteParticipant } from './GroupCallRemoteParticipant';
import { getDefaultConversation } from '../test-both/helpers/getDefaultConversation';
import { FRAME_BUFFER_SIZE } from '../calling/constants';
import { setupI18n } from '../util/setupI18n';
import { generateAci } from '../types/ServiceId';
import enMessages from '../../_locales/en/messages.json';

const i18n = setupI18n('en', enMessages);

type OverridePropsType = {
  audioLevel?: number;
  remoteParticipantsCount?: number;
} & (
  | {
      isInPip: true;
    }
  | {
      isInPip: false;
      height: number;
      left: number;
      top: number;
      width: number;
    }
);

const getFrameBuffer = memoize(() => Buffer.alloc(FRAME_BUFFER_SIZE));

const createProps = (
  overrideProps: OverridePropsType,
  {
    isBlocked = false,
    hasRemoteAudio = false,
    presenting = false,
  }: {
    isBlocked?: boolean;
    hasRemoteAudio?: boolean;
    presenting?: boolean;
  } = {}
): PropsType => ({
  getFrameBuffer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGroupCallVideoFrameSource: noop as any,
  i18n,
  audioLevel: 0,
  remoteParticipant: {
    aci: generateAci(),
    demuxId: 123,
    hasRemoteAudio,
    hasRemoteVideo: true,
    presenting,
    sharingScreen: false,
    videoAspectRatio: 1.3,
    ...getDefaultConversation({
      isBlocked: Boolean(isBlocked),
      title:
        'Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso',
      serviceId: generateAci(),
    }),
  },
  remoteParticipantsCount: 1,
  isActiveSpeakerInSpeakerView: false,
  ...overrideProps,
});

export default {
  title: 'Components/GroupCallRemoteParticipant',
};

export function Default(): JSX.Element {
  return (
    <GroupCallRemoteParticipant
      {...createProps({
        isInPip: false,
        height: 120,
        left: 0,
        top: 0,
        width: 120,
      })}
    />
  );
}

export function Speaking(): JSX.Element {
  function createSpeakingProps(
    index: number,
    remoteParticipantsCount: number,
    presenting: boolean
  ) {
    return createProps(
      {
        isInPip: false,
        height: 120,
        left: (120 + 10) * index,
        top: 0,
        width: 120,
        audioLevel: select('audioLevel', [0, 0.5, 1], 0.5),
        remoteParticipantsCount,
      },
      { hasRemoteAudio: true, presenting }
    );
  }
  return (
    <>
      <GroupCallRemoteParticipant {...createSpeakingProps(0, 1, false)} />
      <GroupCallRemoteParticipant {...createSpeakingProps(1, 2, false)} />
      <GroupCallRemoteParticipant {...createSpeakingProps(2, 2, true)} />
    </>
  );
}

export function IsInPip(): JSX.Element {
  return (
    <GroupCallRemoteParticipant
      {...createProps({
        isInPip: true,
      })}
    />
  );
}

IsInPip.story = {
  name: 'isInPip',
};

export function Blocked(): JSX.Element {
  return (
    <GroupCallRemoteParticipant
      {...createProps(
        {
          isInPip: false,
          height: 120,
          left: 0,
          top: 0,
          width: 120,
        },
        { isBlocked: true }
      )}
    />
  );
}
