// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PwaInstallPrompt } from './pwa-install-prompt';

const route = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));

function browser(userAgent: string, platform = '', touches = 0, standalone = false) {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
  Object.defineProperty(navigator, 'platform', { configurable: true, value: platform });
  Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: touches });
  Object.defineProperty(navigator, 'standalone', { configurable: true, value: standalone });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
}

function offerInstall(outcome: 'accepted' | 'dismissed' = 'accepted', fail = false) {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  const prompt = fail ? vi.fn().mockRejectedValue(new Error('not available')) : vi.fn().mockResolvedValue(undefined);
  Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome }) });
  act(() => { window.dispatchEvent(event); });
  return { event, prompt };
}

describe('PWA install promotion', () => {
  beforeEach(() => { sessionStorage.clear(); route.pathname = '/'; browser('desktop'); });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it('does not promise a native prompt on desktop before the browser offers one', () => {
    render(<PwaInstallPrompt />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('only calls the retained native event after a user gesture', async () => {
    render(<PwaInstallPrompt />);
    const { event, prompt } = offerInstall();
    expect(event.defaultPrevented).toBe(true);
    expect(prompt).not.toHaveBeenCalled();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Cài ứng dụng' })); });
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it.each([['iPhone', 'iPhone', 1], ['Macintosh', 'MacIntel', 5]])('guides iOS and iPadOS without waiting for an unsupported event: %s', (ua, platform, touches) => {
    browser(ua, platform, touches);
    render(<PwaInstallPrompt />);
    expect(screen.getByText(/Chia sẻ → Thêm vào Màn hình chính/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cài ứng dụng' })).toBeNull();
  });

  it('guides embedded app users to a real browser', () => {
    browser('iPhone FBAN/FBIOS');
    render(<PwaInstallPrompt />);
    expect(screen.getByText(/Safari hoặc Chrome bên ngoài app/)).toBeTruthy();
  });

  it('hides promotion when already standalone or installed', () => {
    browser('iPhone', 'iPhone', 1, true);
    render(<PwaInstallPrompt />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('respects session dismissal and does not nag on remount', () => {
    browser('Android');
    const view = render(<PwaInstallPrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Để sau' }));
    view.unmount();
    render(<PwaInstallPrompt />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('handles browser dismissal and a consumed event without retrying it', async () => {
    render(<PwaInstallPrompt />);
    const { prompt } = offerInstall('dismissed');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Cài ứng dụng' })); });
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('falls back to instructions when the native prompt fails', async () => {
    browser('Android');
    render(<PwaInstallPrompt />);
    offerInstall('accepted', true);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Cài ứng dụng' })); });
    expect(screen.getByText(/Chưa mở được cửa sổ cài đặt/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cài ứng dụng' })).toBeNull();
  });

  it('removes promotion on appinstalled', () => {
    browser('Android');
    render(<PwaInstallPrompt />);
    act(() => { window.dispatchEvent(new Event('appinstalled')); });
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('never covers a checkout workflow', () => {
    route.pathname = '/checkout';
    browser('Android');
    render(<PwaInstallPrompt />);
    offerInstall();
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});
