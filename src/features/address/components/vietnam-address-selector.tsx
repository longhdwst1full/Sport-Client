'use client';

import { useEffect, useRef, useState } from 'react';
import {
  fetchVietnamProvinces,
  fetchVietnamDistricts,
  fetchVietnamWards,
  type Province,
  type District,
  type Ward,
} from '../api/vietnam-divisions';
import { DivisionSelect } from './division-select';
import { AddressPreview } from './address-preview';

export interface SelectedAddressData {
  provinceCode: string | null;
  provinceName: string;
  districtCode: string | null;
  districtName: string;
  wardCode: string | null;
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
  const onChangeRef = useRef(onChange);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | null>(
    initialData?.provinceCode ?? null,
  );
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(
    initialData?.provinceName ?? '',
  );

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(
    initialData?.districtCode ?? null,
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    initialData?.districtName ?? '',
  );

  const [selectedWardCode, setSelectedWardCode] = useState<string | null>(
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

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

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

  // Không phụ thuộc trực tiếp vào identity của onChange: các page thường truyền
  // callback inline, đưa callback đó vào dependency sẽ phát lại effect sau mỗi
  // render và có thể tạo vòng lặp setState giữa selector với parent.
  useEffect(() => {
    const parts = [
      streetAddress.trim(),
      selectedWardName,
      selectedDistrictName,
      selectedProvinceName,
    ].filter(Boolean);

    onChangeRef.current({
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
  ]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value || null;
    const found = provinces.find((p) => p.code === code);
    setSelectedProvinceCode(code);
    setSelectedProvinceName(found?.name ?? '');
    setSelectedDistrictCode(null);
    setSelectedDistrictName('');
    setSelectedWardCode(null);
    setSelectedWardName('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value || null;
    const found = districts.find((d) => d.code === code);
    setSelectedDistrictCode(code);
    setSelectedDistrictName(found?.name ?? '');
    setSelectedWardCode(null);
    setSelectedWardName('');
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value || null;
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
        <DivisionSelect
          label="Tỉnh / Thành phố"
          required={required}
          value={selectedProvinceCode}
          onChange={handleProvinceChange}
          disabled={loadingProvinces}
          isLoading={loadingProvinces}
          emptyOptionLabel={loadingProvinces ? 'Đang tải tỉnh thành...' : 'Chọn Tỉnh/Thành phố'}
          options={provinces}
        />

        {/* Quận / Huyện */}
        <DivisionSelect
          label="Quận / Huyện"
          required={required}
          value={selectedDistrictCode}
          onChange={handleDistrictChange}
          disabled={!selectedProvinceCode || loadingDistricts}
          isLoading={loadingDistricts}
          emptyOptionLabel={
            loadingDistricts
              ? 'Đang tải quận huyện...'
              : !selectedProvinceCode
              ? 'Chọn Tỉnh/TP trước'
              : 'Chọn Quận/Huyện'
          }
          options={districts}
        />

        {/* Phường / Xã */}
        <DivisionSelect
          label="Phường / Xã"
          required={required}
          value={selectedWardCode}
          onChange={handleWardChange}
          disabled={!selectedDistrictCode || loadingWards}
          isLoading={loadingWards}
          emptyOptionLabel={
            loadingWards
              ? 'Đang tải phường xã...'
              : !selectedDistrictCode
              ? 'Chọn Quận/Huyện trước'
              : 'Chọn Phường/Xã'
          }
          options={wards}
        />
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
      <AddressPreview
        streetAddress={streetAddress}
        wardName={selectedWardName}
        districtName={selectedDistrictName}
        provinceName={selectedProvinceName}
      />
    </div>
  );
}
