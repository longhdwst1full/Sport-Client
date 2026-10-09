export { VietnamAddressSelector } from './components/vietnam-address-selector';
export {
  EMPTY_SELECTED_ADDRESS,
  joinAddressParts,
  toDivisionCode,
  toSelectedAddressData,
  type SavedAddressParts,
  type SelectedAddressData,
} from './model/selected-address';
export {
  fetchVietnamProvinces,
  fetchVietnamDistricts,
  fetchVietnamWards,
  resetVietnamAddressCache,
  type Province,
  type District,
  type Ward,
} from './api/vietnam-divisions';
export { useCustomerAddressList, getListCustomerAddressesQueryKey } from './api/customer-address-query';
// test commit