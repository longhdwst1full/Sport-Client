'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserStore } from '@/core/storage';
import { Button } from '@/foundation/components/buttons';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const dismissal = createBrowserStore<boolean>('dctd.pwa.install-dismissed', { area: 'session' });

/** Browser-owned installation, not an APK download. iOS and in-app browsers need manual instructions. */
export function PwaInstallPrompt() {
  const pathname = usePathname();
  const [mode, setMode] = useState<'ios' | 'android' | 'embedded' | null>(null);
  const [installed, setInstalled] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const iosNavigator = navigator as Navigator & { standalone?: boolean };
    const syncInstalled = () => setInstalled(standalone.matches || iosNavigator.standalone === true);
    syncInstalled();
    setDismissed(dismissal.read() === true);
    const ua = navigator.userAgent;
    // iPadOS may identify itself as a Mac; touch capability distinguishes it from a normal Mac.
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const embedded = /FBAN|FBAV|Instagram|Zalo|TikTok|Bytedance|Line\//i.test(ua);
    setMode(embedded ? 'embedded' : ios ? 'ios' : /Android/i.test(ua) ? 'android' : null);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      setFailed(false);
    };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    standalone.addEventListener('change', syncInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      standalone.removeEventListener('change', syncInstalled);
    };
  }, []);

  // Keep install promotion out of payment/customer workflows and diagnostics. No change to SW caching.
  const sensitiveRoute = /^\/(checkout|payment|profile|orders|returns|login|register|forgot-password|reset-password|pwa)(\/|$)/.test(pathname);
  if (installed || dismissed || sensitiveRoute || (!mode && !prompt)) return null;

  const dismiss = () => { dismissal.write(true); setDismissed(true); };
  const install = async () => {
    if (!prompt || installing) return;
    setInstalling(true);
    try {
      // A retained browser event is single-use and must be invoked from this user gesture.
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
      else dismiss();
    } catch {
      setFailed(true);
    } finally {
      setPrompt(null);
      setInstalling(false);
    }
  };

  return (
    <aside aria-label="Cài đặt ứng dụng Bảo An Sport" className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 right-20 z-40 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-ink shadow-card sm:left-5 sm:right-auto sm:max-w-sm">
      <p className="font-bold">Thêm Bảo An Sport vào màn hình chính</p>
      <p className="mt-2 text-neutral-600">
        {failed ? 'Chưa mở được cửa sổ cài đặt. Bạn có thể cài từ menu trình duyệt.'
          : mode === 'embedded' ? 'Hãy mở website bằng Safari hoặc Chrome bên ngoài app, sau đó thêm vào màn hình chính.'
          : mode === 'ios' ? 'Trên iPhone/iPad: mở bằng Safari, chọn Chia sẻ → Thêm vào Màn hình chính → Thêm.'
          : prompt ? 'Cài ứng dụng web để mở cửa hàng nhanh từ màn hình chính.'
          : 'Trong Chrome, mở menu ⋮ → Thêm vào màn hình chính hoặc Cài đặt ứng dụng (nếu có).'}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {prompt && mode !== 'embedded' && <Button variant="primary" size="md" loading={installing} onClick={() => void install()}>Cài ứng dụng</Button>}
        <Link className="text-link inline-flex min-h-11 items-center" href="/pwa">Hướng dẫn cài đặt</Link>
        <Button variant="ghost" size="md" onClick={dismiss}>Để sau</Button>
      </div>
    </aside>
  );
}
