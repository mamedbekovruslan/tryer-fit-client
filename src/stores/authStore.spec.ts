import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthUser } from '@/services/authService';

const {
  clearChatStore,
  clearWorkoutStore,
  logoutMock,
  getMyProfileMock,
  getClientProfileMock,
  getTrainerProfileMock,
} = vi.hoisted(() => ({
  clearChatStore: vi.fn(),
  clearWorkoutStore: vi.fn(),
  logoutMock: vi.fn(),
  getMyProfileMock: vi.fn(),
  getClientProfileMock: vi.fn(),
  getTrainerProfileMock: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
  authService: {
    logout: logoutMock,
  },
}));

vi.mock('@/services/profileService', () => ({
  profileService: {
    getMyProfile: getMyProfileMock,
  },
}));

vi.mock('@/services/clientService', () => ({
  clientService: {
    getMyProfile: getClientProfileMock,
  },
}));

vi.mock('@/services/trainerService', () => ({
  trainerService: {
    getMyTrainerProfile: getTrainerProfileMock,
  },
}));

vi.mock('@/stores/chatStore', () => ({
  useChatStore: {
    getState: () => ({
      clear: clearChatStore,
    }),
  },
}));

vi.mock('@/stores/trainerWorkoutStore', () => ({
  useTrainerWorkoutStore: {
    getState: () => ({
      clear: clearWorkoutStore,
    }),
  },
}));

import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it('initializeAuth sets user on successful profile fetch', async () => {
    const userProfile = {
      id: 7,
      email: 'client@test.dev',
      username: 'client_user',
      user_type: 'client',
    };
    getMyProfileMock.mockResolvedValue(userProfile);
    getClientProfileMock.mockResolvedValue({
      ...userProfile,
      first_name: 'Client',
      last_name: 'User',
      trainer: {
        id: 11,
        username: 'trainer_user',
        email: 'trainer@test.dev',
      },
    });

    await useAuthStore.getState().initializeAuth();

    expect(getMyProfileMock).toHaveBeenCalledTimes(1);
    expect(getClientProfileMock).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: true,
      isInitializing: false,
      initialized: true,
      user: {
        id: 7,
        email: 'client@test.dev',
        username: 'client_user',
        user_type: 'client',
        first_name: 'Client',
        trainer: {
          id: 11,
        },
      },
    });
  });

  it('initializeAuth clears user on 401', async () => {
    useAuthStore.setState(
      {
        ...useAuthStore.getInitialState(),
        user: {
          id: 99,
          email: 'stale@test.dev',
          username: 'stale_user',
          user_type: 'trainer',
        } as AuthUser,
        isAuthenticated: true,
      },
      true,
    );
    getMyProfileMock.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    await useAuthStore.getState().initializeAuth();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
      initialized: true,
    });
  });

  it('logout clears auth state', async () => {
    useAuthStore.setState(
      {
        ...useAuthStore.getInitialState(),
        user: {
          id: 1,
          email: 'trainer@test.dev',
          username: 'trainer_user',
          user_type: 'trainer',
        } as AuthUser,
        isAuthenticated: true,
      },
      true,
    );
    logoutMock.mockResolvedValue(undefined);

    useAuthStore.getState().logout();
    await Promise.resolve();

    expect(clearChatStore).toHaveBeenCalledTimes(1);
    expect(clearWorkoutStore).toHaveBeenCalledTimes(1);
    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
    });
  });
});
