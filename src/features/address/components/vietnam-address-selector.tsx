'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Field, TextInput } from '@/foundation/components/field-system';
import {
  fetchVietnamProvinces,
  fetchVietnamDistricts,
  fetchVietnamWards,
  type Province,
  type District,
  type Ward,
} from '../api/vietnam-divisions';
import type { SelectedAddressData } from '../model/selected-address';
import { DivisionSelect } from './division-select';
import { AddressPreview } from './address-preview';

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

  // Lỗi tải từng cấp + bộ đếm "thử lại": tăng bộ đếm để effect tương ứng gọi lại API
  // (cache trong `vietnam-divisions` đã bỏ promise lỗi nên lần gọi sau là request mới).
  const [provincesError, setProvincesError] = useState(false);
  const [districtsError, setDistrictsError] = useState(false);
  const [wardsError, setWardsError] = useState(false);
  const [provincesAttempt, setProvincesAttempt] = useState(0);
  const [districtsAttempt, setDistrictsAttempt] = useState(0);
  const [wardsAttempt, setWardsAttempt] = useState(0);
  const streetInputId = useId();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Load provinces on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingProvinces(true);
    setProvincesError(false);
    fetchVietnamProvinces()
      .then((data) => {
        if (isMounted) {
          setProvinces(data);
          setProvincesError(data.length === 0);
          setLoadingProvinces(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProvincesError(true);
          setLoadingProvinces(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [provincesAttempt]);

  // When province changes, load districts
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrictCode(null);
      setSelectedDistrictName('');
      setSelectedWardCode(null);
      setSelectedWardName('');
      setDistrictsError(false);
      return;
    }

    let isMounted = true;
    setLoadingDistricts(true);
    setDistrictsError(false);
    fetchVietnamDistricts(selectedProvinceCode)
      .then((data) => {
        if (isMounted) {
          setDistricts(data);
          setLoadingDistricts(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDistricts([]);
          setDistrictsError(true);
          setLoadingDistricts(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvinceCode, districtsAttempt]);

  // When district changes, load wards
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWards([]);
      setSelectedWardCode(null);
      setSelectedWardName('');
      setWardsError(false);
      return;
    }

    let isMounted = true;
    setLoadingWards(true);
    setWardsError(false);
    fetchVietnamWards(selectedDistrictCode)
      .then((data) => {
        if (isMounted) {
          setWards(data);
          setLoadingWards(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWards([]);
          setWardsError(true);
          setLoadingWards(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrictCode, wardsAttempt]);

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
          error={provincesError ? 'Không tải được danh sách tỉnh/thành.' : undefined}
          onRetry={() => setProvincesAttempt((n) => n + 1)}
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
          error={districtsError ? 'Không tải được danh sách quận/huyện.' : undefined}
          onRetry={() => setDistrictsAttempt((n) => n + 1)}
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
          error={wardsError ? 'Không tải được danh sách phường/xã.' : undefined}
          onRetry={() => setWardsAttempt((n) => n + 1)}
        />
      </div>

      {/* Street Address Input */}
      <div>
        <Field
          label={<>Số nhà, tên đường, tòa nhà {required && <span className="text-rose-500">*</span>}</>}
          labelClassName="block text-xs font-bold uppercase tracking-wider text-slate-600"
        >
          <TextInput
            size="md"
            id={streetInputId}
            type="text"
            required={required}
            autoComplete="street-address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Ví dụ: Số 123 Đường Nguyễn Hữu Thọ, Tòa nhà Landmark..."
            className="mt-1.5 font-medium text-slate-800"
          />
        </Field>
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
