export {
  VietnamAddressSelector,
  type SelectedAddressData,
} from './components/vietnam-address-selector';
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
