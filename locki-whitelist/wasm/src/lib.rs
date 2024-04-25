// Code generated by the multiversx-sc build system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                            4
// Async Callback (empty):               1
// Total number of exported functions:   6

#![no_std]
#![allow(internal_features)]
#![feature(lang_items)]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    contract
    (
        init => init
        addNewAddressToWhitelist => add_new_address_to_whitelist
        removeAddressToWhitelist => remove_address_from_whitelist
        isAddressWhitelisted => is_address_whitelisted
        getWhitelistedAddressesLength => get_whitelisted_addresses_length
    )
}

multiversx_sc_wasm_adapter::async_callback_empty! {}
