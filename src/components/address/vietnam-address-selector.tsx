'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2, ChevronDown, Check } from 'lucide-react';
import {
  fetchVietnamProvinces,
  fetchVietnamDistricts,
  fetchVietnamWards,
  type Province,
  type District,
  type Ward,
} from '@/shared/services/vietnam-address.service';

export interface SelectedAddressData {
  provinceCode: number | null;
  provinceName: string;
  districtCode: number | null;
  districtName: string;
  wardCode: number | null;
  wardName: string;
  streetAddress: string;
  fullAddress: string;
}

interface VietnamAddressSelectorProps {
  initialData?: Partial<SelectedAddressData>;
  onChange: (data: SelectedAddressData) => void;
  required?: boolean;
  compact?: boolean;
}

export function VietnamAddressSelector({
  initialData,
  onChange,
  required = false,
  compact = false,
}: VietnamAddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(
    initialData?.provinceCode ?? null,
  );
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(
    initialData?.provinceName ?? '',
  );

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(
    initialData?.districtCode ?? null,
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    initialData?.districtName ?? '',
  );

  const [selectedWardCode, setSelectedWardCode] = useState<number | null>(
    initialData?.wardCode ?? null,
  );
  const [selectedWardName, setSelectedWardName] = useState<string>(
    initialData?.wardName ?? '',
  );

  const [streetAddress, setStreetAddress] = useState<string>(
    initialData?.streetAddress ?? '',
  );

  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(true);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingWards, setLoadingWards] = useState<boolean>(false);

  // Load provinces on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingProvinces(true);
    fetchVietnamProvinces()
      .then((data) => {
        if (isMounted) {
          setProvinces(data);
          setLoadingProvinces(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingProvinces(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // When province changes, load districts
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrictCode(null);
      setSelectedDistrictName('');
      setSelectedWardCode(null);
      setSelectedWardName('');
      return;
    }

    let isMounted = true;
    setLoadingDistricts(true);
    fetchVietnamDistricts(selectedProvinceCode)
      .then((data) => {
        if (isMounted) {
          setDistricts(data);
          setLoadingDistricts(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingDistricts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvinceCode]);

  // When district changes, load wards
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWards([]);
      setSelectedWardCode(null);
      setSelectedWardName('');
      return;
    }

    let isMounted = true;
    setLoadingWards(true);
    fetchVietnamWards(selectedDistrictCode)
      .then((data) => {
        if (isMounted) {
          setWards(data);
          setLoadingWards(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingWards(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrictCode]);

  // Notify parent on change
  useEffect(() => {
    const parts = [
      streetAddress.trim(),
      selectedWardName,
      selectedDistrictName,
      selectedProvinceName,
    ].filter(Boolean);

    onChange({
      provinceCode: selectedProvinceCode,
      provinceName: selectedProvinceName,
      districtCode: selectedDistrictCode,
      districtName: selectedDistrictName,
      wardCode: selectedWardCode,
      wardName: selectedWardName,
      streetAddress,
      fullAddress: parts.join(', '),
    });
  }, [
    selectedProvinceCode,
    selectedProvinceName,
    selectedDistrictCode,
    selectedDistrictName,
    selectedWardCode,
    selectedWardName,
    streetAddress,
    onChange,
  ]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : null;
    const found = provinces.find((p) => p.code === code);
    setSelectedProvinceCode(code);
    setSelectedProvinceName(found?.name ?? '');
    setSelectedDistrictCode(null);
    setSelectedDistrictName('');
    setSelectedWardCode(null);
    setSelectedWardName('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : null;
    const found = districts.find((d) => d.code === code);
    setSelectedDistrictCode(code);
    setSelectedDistrictName(found?.name ?? '');
    setSelectedWardCode(null);
    setSelectedWardName('');
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : null;
    const found = wards.find((w) => w.code === code);
    setSelectedWardCode(code);
    setSelectedWardName(found?.name ?? '');
  };

  return (
    <div className="space-y-4">
      {/* 3 Cascading Select Dropdowns */}
      <div
        className={`grid gap-3 ${
          compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {/* Tỉnh / Thành phố */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Tỉnh / Thành phố {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative mt-1.5">
            <select
              value={selectedProvinceCode ?? ''}
              onChange={handleProvinceChange}
              required={required}
              disabled={loadingProvinces}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 sm:text-sm"
            >
              <option value="">
                {loadingProvinces ? 'Đang tải tỉnh thành...' : 'Chọn Tỉnh/Thành phố'}
              </option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {loadingProvinces ? (
                <Loader2 className="size-4 animate-spin text-emerald-600" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </div>
        </div>

        {/* Quận / Huyện */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Quận / Huyện {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative mt-1.5">
            <select
              value={selectedDistrictCode ?? ''}
              onChange={handleDistrictChange}
              required={required}
              disabled={!selectedProvinceCode || loadingDistricts}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 sm:text-sm"
            >
              <option value="">
                {loadingDistricts
                  ? 'Đang tải quận huyện...'
                  : !selectedProvinceCode
                  ? 'Chọn Tỉnh/TP trước'
                  : 'Chọn Quận/Huyện'}
              </option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {loadingDistricts ? (
                <Loader2 className="size-4 animate-spin text-emerald-600" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </div>
        </div>

        {/* Phường / Xã */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Phường / Xã {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative mt-1.5">
            <select
              value={selectedWardCode ?? ''}
              onChange={handleWardChange}
              required={required}
              disabled={!selectedDistrictCode || loadingWards}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 sm:text-sm"
            >
              <option value="">
                {loadingWards
                  ? 'Đang tải phường xã...'
                  : !selectedDistrictCode
                  ? 'Chọn Quận/Huyện trước'
                  : 'Chọn Phường/Xã'}
              </option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {loadingWards ? (
                <Loader2 className="size-4 animate-spin text-emerald-600" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Street Address Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Số nhà, tên đường, tòa nhà {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="relative mt-1.5">
          <input
            type="text"
            required={required}
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Ví dụ: Số 123 Đường Nguyễn Hữu Thọ, Tòa nhà Landmark..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
          />
        </div>
      </div>

      {/* Live Preview of formatted address */}
      {(selectedProvinceName || streetAddress) && (
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/70">
          <MapPin className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <span className="font-bold text-slate-700">Địa chỉ đầy đủ: </span>
            <span className="font-semibold text-slate-900">
              {[streetAddress.trim(), selectedWardName, selectedDistrictName, selectedProvinceName]
                .filter(Boolean)
                .join(', ') || 'Chưa nhập địa chỉ đầy đủ'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
