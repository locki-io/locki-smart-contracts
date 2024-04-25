#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {}

    #[storage_mapper("whitelistedAddresses")]
    fn whitelisted_addresses(&self) -> MapMapper<ManagedAddress, bool>;

    #[endpoint(addNewAddressToWhitelist)]
    fn add_new_address_to_whitelist(&self, new_address: ManagedAddress) {
        if !self.whitelisted_addresses().contains_key(&new_address) {
            self.whitelisted_addresses().insert(new_address, true);
        }
    }

    #[endpoint(removeAddressToWhitelist)]
    fn remove_address_from_whitelist(&self, address: ManagedAddress) {
        if self.whitelisted_addresses().contains_key(&address) {
            self.whitelisted_addresses().remove(&address);
        }
    }

    #[view(isAddressWhitelisted)]
    fn is_address_whitelisted(&self, address: ManagedAddress) -> bool {
        let address_is_whitelisted = self.whitelisted_addresses().contains_key(&address);
        address_is_whitelisted
    }
}
