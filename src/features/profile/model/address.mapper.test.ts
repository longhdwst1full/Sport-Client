import { describe, expect, it } from 'vitest';

import { EMPTY_LOCATION, toCreateAddressPayload, toSelectorInitialData, type AddressView } from './address.mapper';

// Mã phường GHN ở Hà Nội có chữ (vd. `1B2729`); ép sang số sẽ thành NaN và form không bao giờ hợp lệ.
const hanoiAddress: AddressView = {
  id: '1',
  recipient: 'Nguyễn Văn An',
  phone: '0912345678',
  addressLine: '12 Nguyễn Trãi',
  ward: 'Phường Khương Mai',
  wardCode: '1B2729',
  district: 'Quận Thanh Xuân',
  districtCode: '3303',
  province: 'Hà Nội',
  provinceCode: '201',
  isDefault: true,
  version: 0,
  fullAddress: '12 Nguyễn Trãi, Phường Khương Mai, Quận Thanh Xuân, Hà Nội',
};

describe('address mapper', () => {
  it('keeps alphanumeric carrier ward codes when restoring the selector', () => {
    expect(toSelectorInitialData(hanoiAddress)).toMatchObject({
      provinceCode: '201',
      districtCode: '3303',
      wardCode: '1B2729',
      wardName: 'Phường Khương Mai',
    });
  });

  it('asks to re-pick a level whose code was never saved', () => {
    expect(toSelectorInitialData({ ...hanoiAddress, wardCode: '' })).toMatchObject({ wardCode: null, wardName: '' });
  });

  it('sends the carrier codes unchanged', () => {
    const location = toSelectorInitialData(hanoiAddress);
    expect(toCreateAddressPayload({ recipient: 'An', phone: '0912345678', isDefault: false, location })).toMatchObject({
      provinceCode: '201',
      districtCode: '3303',
      wardCode: '1B2729',
    });
    expect(toCreateAddressPayload({ recipient: 'An', phone: '0912345678', isDefault: false, location: EMPTY_LOCATION }))
      .toMatchObject({ provinceCode: '', wardCode: undefined });
  });
});
