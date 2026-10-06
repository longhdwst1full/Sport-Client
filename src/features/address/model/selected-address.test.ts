import { describe, expect, it } from 'vitest';
import { EMPTY_SELECTED_ADDRESS, joinAddressParts, toDivisionCode, toSelectedAddressData } from './selected-address';

const saved = {
  addressLine: '12 Láng Hạ',
  ward: 'Phường Thành Công',
  wardCode: '1B2729',
  district: 'Quận Ba Đình',
  districtCode: '1484',
  province: 'Hà Nội',
  provinceCode: '201',
};

describe('selected-address helpers', () => {
  it('EMPTY_SELECTED_ADDRESS has no prefilled division', () => {
    expect(EMPTY_SELECTED_ADDRESS).toEqual({
      provinceCode: null,
      provinceName: '',
      districtCode: null,
      districtName: '',
      wardCode: null,
      wardName: '',
      streetAddress: '',
      fullAddress: '',
    });
  });

  it('toDivisionCode keeps alphanumeric carrier codes and maps blank to null', () => {
    expect(toDivisionCode(' 1B2729 ')).toBe('1B2729');
    expect(toDivisionCode('')).toBeNull();
    expect(toDivisionCode('   ')).toBeNull();
    expect(toDivisionCode(null)).toBeNull();
    expect(toDivisionCode(undefined)).toBeNull();
  });

  it('joinAddressParts skips empty parts', () => {
    expect(joinAddressParts(['12 Láng Hạ', '', null, ' Hà Nội '])).toBe('12 Láng Hạ, Hà Nội');
  });

  it('toSelectedAddressData maps every level and joins the full address', () => {
    expect(toSelectedAddressData(saved)).toEqual({
      provinceCode: '201',
      provinceName: 'Hà Nội',
      districtCode: '1484',
      districtName: 'Quận Ba Đình',
      wardCode: '1B2729',
      wardName: 'Phường Thành Công',
      streetAddress: '12 Láng Hạ',
      fullAddress: '12 Láng Hạ, Phường Thành Công, Quận Ba Đình, Hà Nội',
    });
  });

  it('keeps names without codes by default, drops them when asked', () => {
    const legacy = { ...saved, districtCode: null, wardCode: '' };
    expect(toSelectedAddressData(legacy)).toMatchObject({
      districtCode: null,
      districtName: 'Quận Ba Đình',
      wardCode: null,
      wardName: 'Phường Thành Công',
    });
    expect(toSelectedAddressData(legacy, { dropNamesWithoutCode: true })).toMatchObject({
      districtCode: null,
      districtName: '',
      wardCode: null,
      wardName: '',
      provinceName: 'Hà Nội',
    });
  });
});
